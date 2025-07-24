using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using BookHub.Data;
using BookHub.Models;
using BookHub.Models.Dtos;
using BookHub.Helpers;

namespace BookHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly BookHubDbContext _context;

        public UsersController(BookHubDbContext context)
        {
            _context = context;
        }

        // GET: api/Users (только для SuperAdmin и Admin)
        [HttpGet]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = await _context.Users
                .Where(u => !u.IsDeleted) // Исключаем удаленных пользователей
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .ToListAsync();

            var dtos = users.Select(u => new UserDto
            {
                Id = u.Id,
                FullName = u.FullName,
                PhoneNumber = u.PhoneNumber,
                Email = u.Email,
                CreatedAt = u.CreatedAt,
                Balance = u.Balance,
                Points = u.Points,
                IsDeleted = u.IsDeleted,
                Roles = u.UserRoles.Select(ur => ur.Role.Name).ToList()
            }).ToList();

            return dtos;
        }

        // GET: api/Users/5 (свой профиль или SuperAdmin/Admin)
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            // Используем helper для проверки прав
            if (!AuthorizationHelper.CanViewUser(User, id))
            {
                return AuthorizationHelper.CreateForbidResult("Вы можете просматривать только свой профиль");
            }
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted);

            if (user == null)
                return NotFound("Пользователь не найден или удален");

            var dto = new UserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                PhoneNumber = user.PhoneNumber,
                Email = user.Email,
                CreatedAt = user.CreatedAt,
                Balance = user.Balance,
                Points = user.Points,
                IsDeleted = user.IsDeleted
            };

            return dto;
        }

        // PUT: api/Users/5 (свой профиль или SuperAdmin/Admin)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, UserDto dto)
        {
            if (id != dto.Id)
                return BadRequest("ID в URL не совпадает с ID объекта.");

            // Используем helper для проверки прав
            if (!AuthorizationHelper.CanEditUser(User, id))
            {
                return AuthorizationHelper.CreateForbidResult("Вы можете редактировать только свой профиль");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted);
            if (user == null)
                return NotFound("Пользователь не найден или удален");

            // Обычные пользователи не могут менять Balance, Points и ManagedClubId
            if (!AuthorizationHelper.IsAdminOrHigher(User))
            {
                dto.Balance = user.Balance; // Сохраняем текущий баланс
                dto.Points = user.Points;   // Сохраняем текущие очки
                dto.IsDeleted = user.IsDeleted; // Не дают удалять себя
                // ManagedClubId может менять только SuperAdmin/Admin
            }

            user.FullName = dto.FullName;
            user.PhoneNumber = dto.PhoneNumber;
            user.Email = dto.Email;
            user.Balance = dto.Balance;
            user.Points = dto.Points;
            user.IsDeleted = dto.IsDeleted;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // POST: api/Users (только SuperAdmin и Admin)
        [HttpPost]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<ActionResult<UserDto>> PostUser(CreateUserDto createDto)
        {
            // Валидация пароля
            if (string.IsNullOrWhiteSpace(createDto.Password))
            {
                return BadRequest("Пароль является обязательным полем.");
            }

            if (createDto.Password.Length < 6)
            {
                return BadRequest("Пароль должен содержать минимум 6 символов.");
            }

            // Проверка уникальности номера телефона и email
            if (await _context.Users.AnyAsync(u => u.PhoneNumber == createDto.PhoneNumber))
            {
                return BadRequest("Пользователь с таким номером телефона уже существует.");
            }

            if (await _context.Users.AnyAsync(u => u.Email == createDto.Email))
            {
                return BadRequest("Пользователь с таким email уже существует.");
            }

            var user = new User
            {
                FullName = createDto.FullName,
                PhoneNumber = createDto.PhoneNumber,
                Email = createDto.Email,
                PasswordHash = PasswordHelper.HashPassword(createDto.Password), // Хешируем пароль
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Balance = createDto.Balance,
                Points = createDto.Points,
                IsDeleted = false
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Назначаем роли, если указаны
            if (createDto.Roles.Any())
            {
                foreach (var roleName in createDto.Roles)
                {
                    var role = await _context.Roles.FirstOrDefaultAsync(r => r.Name == roleName);
                    if (role != null)
                    {
                        var userRole = new UserRole
                        {
                            UserId = user.Id,
                            RoleId = role.Id,
                            AssignedAt = DateTime.UtcNow
                        };
                        _context.UserRoles.Add(userRole);
                    }
                }
                await _context.SaveChangesAsync();
            }

            // Возвращаем UserDto (без пароля)
            var dto = new UserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                PhoneNumber = user.PhoneNumber,
                Email = user.Email,
                CreatedAt = user.CreatedAt,
                Balance = user.Balance,
                Points = user.Points,
                IsDeleted = user.IsDeleted,
                Roles = createDto.Roles
            };

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, dto);
        }

        // DELETE: api/Users/5 (только SuperAdmin) - МЯГКОЕ УДАЛЕНИЕ
        [HttpDelete("{id}")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var currentUserId = AuthorizationHelper.GetCurrentUserId(User);
            
            // SuperAdmin не может удалить сам себя
            if (currentUserId == id)
            {
                return BadRequest("Вы не можете удалить свой собственный аккаунт");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted);
                
            if (user == null)
                return NotFound("Пользователь не найден или уже удален");

            // МЯГКОЕ удаление пользователя (сохраняем историю бронирований и платежей)
            user.IsDeleted = true;
            user.UpdatedAt = DateTime.UtcNow;
            
            var result = await _context.SaveChangesAsync();
            Console.WriteLine($"Пользователь {id} помечен как удаленный (мягкое удаление). Изменений в БД: {result}");

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
