using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OynaApi.Data;
using OynaApi.Services;
using OynaApi.Models;
using OynaApi.Models.Dtos;
using OynaApi.Helpers;
using System.Security.Cryptography;
using System.Text;
using System.Linq;
using BCrypt.Net;

namespace OynaApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly OynaDbContext _context;
        private readonly JwtService _jwtService;

        public AuthController(OynaDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            Console.WriteLine($"=== НАЧАЛО ЛОГИНА ===");
            Console.WriteLine($"Email/Phone из запроса: '{dto.EmailOrPhone}'");
            Console.WriteLine($"Пароль из запроса: '{dto.Password}'");
            Console.WriteLine($"Длина пароля: {dto.Password?.Length ?? 0}");

            // Покажем всех пользователей в базе для отладки
            var allUsers = await _context.Users.Select(u => new { u.Id, u.Email, u.PhoneNumber, u.FullName, PasswordLength = u.PasswordHash.Length }).ToListAsync();
            Console.WriteLine($"Всего пользователей в базе: {allUsers.Count}");
            foreach (var u in allUsers)
            {
                Console.WriteLine($"  ID: {u.Id}, Email: '{u.Email}', Phone: '{u.PhoneNumber}', Name: '{u.FullName}', PwdLen: {u.PasswordLength}");
            }

            var user = await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => (u.Email == dto.EmailOrPhone || u.PhoneNumber == dto.EmailOrPhone) && !u.IsDeleted);

            if (user == null)
            {
                Console.WriteLine($"ОШИБКА: Пользователь с email/phone '{dto.EmailOrPhone}' не найден в базе");
                return Unauthorized(new { message = "Неверный логин или пароль" });
            }

            Console.WriteLine($"Пользователь найден: ID={user.Id}, Email='{user.Email}', Phone='{user.PhoneNumber}', FullName='{user.FullName}'");
            Console.WriteLine($"Хэш из БД: '{user.PasswordHash}'");
            Console.WriteLine($"Длина хэша из БД: {user.PasswordHash?.Length ?? 0}");
            Console.WriteLine($"Введённый пароль: '{dto.Password}'");
            Console.WriteLine($"Длина введённого пароля: {dto.Password?.Length ?? 0}");

            if (string.IsNullOrEmpty(dto.Password))
            {
                Console.WriteLine("ОШИБКА: Пароль пустой!");
                return Unauthorized(new { message = "Неверный логин или пароль" });
            }

            if (string.IsNullOrEmpty(user.PasswordHash))
            {
                Console.WriteLine("ОШИБКА: Хэш пароля в базе пустой!");
                return Unauthorized(new { message = "Неверный логин или пароль" });
            }

            // Проверяем формат BCrypt хэша
            if (!user.PasswordHash.StartsWith("$2a$") && !user.PasswordHash.StartsWith("$2b$") && !user.PasswordHash.StartsWith("$2y$"))
            {
                Console.WriteLine($"ОШИБКА: Хэш не соответствует формату BCrypt! Хэш начинается с: '{user.PasswordHash.Substring(0, Math.Min(10, user.PasswordHash.Length))}'");
                return Unauthorized(new { message = "Неверный логин или пароль" });
            }

            Console.WriteLine("Хэш соответствует формату BCrypt, начинаем проверку...");

            try
            {
                var isPasswordValid = PasswordHelper.VerifyPassword(dto.Password, user.PasswordHash);
                Console.WriteLine($"Результат PasswordHelper.VerifyPassword: {isPasswordValid}");
                
                // Дополнительная проверка напрямую через BCrypt
                var directBCryptCheck = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
                Console.WriteLine($"Результат прямой проверки BCrypt.Net.BCrypt.Verify: {directBCryptCheck}");
                
                if (isPasswordValid != directBCryptCheck)
                {
                    Console.WriteLine("ВНИМАНИЕ: Результаты PasswordHelper и BCrypt не совпадают!");
                }

                if (!isPasswordValid)
                {
                    Console.WriteLine("ОШИБКА: Пароль не прошёл проверку!");
                    
                    // Попробуем создать новый хэш для сравнения
                    var newHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
                    Console.WriteLine($"Новый хэш для того же пароля: {newHash}");
                    var newHashVerify = BCrypt.Net.BCrypt.Verify(dto.Password, newHash);
                    Console.WriteLine($"Проверка нового хэша: {newHashVerify}");
                    
                    return Unauthorized(new { message = "Неверный логин или пароль" });
                }

                Console.WriteLine("Пароль верный, генерируем токен...");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ОШИБКА при проверке пароля: {ex.Message}");
                Console.WriteLine($"Стек ошибки: {ex.StackTrace}");
                return Unauthorized(new { message = "Неверный логин или пароль" });
            }

            try
            {
                var roles = user.UserRoles.Select(ur => ur.Role.Name).ToList();
                var token = _jwtService.GenerateToken(user, roles);
                
                Console.WriteLine($"Токен сгенерирован: {token.Substring(0, Math.Min(50, token.Length))}...");
                Console.WriteLine($"Роли пользователя: {string.Join(", ", roles)}");
                Console.WriteLine($"=== ЛОГИН УСПЕШЕН ===");

                var userDto = new UserDto
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    Balance = user.Balance,
                    Points = user.Points,
                    CreatedAt = user.CreatedAt,
                    IsDeleted = user.IsDeleted,
                    Roles = roles
                };

                return Ok(new { message = "Успешный вход", token, user = userDto });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ОШИБКА при генерации токена: {ex.Message}");
                return StatusCode(500, new { message = "Ошибка при генерации токена" });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            Console.WriteLine($"=== РЕГИСТРАЦИЯ ===");
            Console.WriteLine($"Email: {dto.Email}");
            Console.WriteLine($"Phone: {dto.PhoneNumber}");
            Console.WriteLine($"Пароль: {dto.Password}");
            Console.WriteLine($"FullName: {dto.FullName}");

            if (await _context.Users.AnyAsync(u => u.Email == dto.Email || u.PhoneNumber == dto.PhoneNumber))
            {
                Console.WriteLine($"ОШИБКА: Email {dto.Email} или телефон {dto.PhoneNumber} уже зарегистрирован");
                return BadRequest(new { message = "Пользователь уже существует" });
            }

            var passwordHash = PasswordHelper.HashPassword(dto.Password);
            Console.WriteLine($"Хэш пароля: {passwordHash}");

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                PasswordHash = passwordHash,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Balance = 0,
                Points = 0,
                IsDeleted = false
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            Console.WriteLine($"Пользователь успешно создан с ID: {user.Id}");

            // Логика назначения ролей:
            // Все новые пользователи получают роль User
            // SuperAdmin назначается только через SQL скрипт или существующим суперадмином
            string defaultRoleName = "User";
            
            Console.WriteLine($"Назначаем роль: {defaultRoleName}");
            
            var defaultRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == defaultRoleName);
            if (defaultRole != null)
            {
                var userRoleAssignment = new UserRole
                {
                    UserId = user.Id,
                    RoleId = defaultRole.Id,
                    AssignedAt = DateTime.UtcNow
                };
                _context.UserRoles.Add(userRoleAssignment);
                await _context.SaveChangesAsync();
                Console.WriteLine($"Роль {defaultRoleName} успешно назначена");
            }
            else
            {
                Console.WriteLine($"ОШИБКА: Роль {defaultRoleName} не найдена в базе данных");
            }

            var roles = new List<string> { defaultRoleName };
            var token = _jwtService.GenerateToken(user, roles);
            
            var userDto = new UserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Balance = user.Balance,
                Points = user.Points,
                CreatedAt = user.CreatedAt,
                IsDeleted = user.IsDeleted,
                Roles = roles
            };

            Console.WriteLine($"Сохранён FullName: '{user.FullName}'");
            Console.WriteLine($"=== РЕГИСТРАЦИЯ ЗАВЕРШЕНА ===");

            return Ok(new { message = "Регистрация успешна", token, user = userDto });
        }
    }
}