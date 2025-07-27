using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BookHub.Models.New;
using BookHub.Models.New.Dtos;
using BookHub.Data;
using System.Linq;

namespace BookHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly BookHubDbContext _db;

        public UsersController(BookHubDbContext db)
        {
            _db = db;
        }

        // SystemAdmin, NetworkOwner: получить всех пользователей
        [HttpGet]
        
        public IActionResult GetAll()
        {
            var users = _db.Users.Select(u => new UserDto
            {
                Id = u.Id,
                FullName = u.FullName,
                Email = u.Email,
                Phone = u.Phone,
                Avatar = u.Avatar,
                IsActive = u.IsActive,
                Role = u.Role
            }).ToList();
            return Ok(users);
        }

        // User: получить свои данные
        [HttpGet("{id}")]
        
        public IActionResult Get(int id)
        {
            var user = _db.Users.Find(id);
            if (user == null) return NotFound();
            // Только свои данные или если SystemAdmin/NetworkOwner
            if (User.IsInRole("SystemAdmin") || User.IsInRole("NetworkOwner") || User.Identity.Name == user.Email)
            {
                return Ok(new UserDto
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    Email = user.Email,
                    Phone = user.Phone,
                    Avatar = user.Avatar,
                    IsActive = user.IsActive,
                    Role = user.Role
                });
            }
            return Forbid();
        }

        // SystemAdmin, NetworkOwner: создать пользователя
        [HttpPost]
        
        public IActionResult Create([FromBody] UserDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                Phone = dto.Phone,
                Avatar = dto.Avatar,
                IsActive = dto.IsActive,
                Role = dto.Role,
                PasswordHash = "" // генерировать или принимать отдельно
            };
            _db.Users.Add(user);
            _db.SaveChanges();
            dto.Id = user.Id;
            return CreatedAtAction(nameof(Get), new { id = user.Id }, dto);
        }

        // User, ClubManager: обновить свои данные
        [HttpPut("{id}")]
        
        public IActionResult Update(int id, [FromBody] UserDto dto)
        {
            var user = _db.Users.Find(id);
            if (user == null) return NotFound();
            // Разрешить обновление всем (MVP)
            user.FullName = dto.FullName;
            user.Phone = dto.Phone;
            user.Avatar = dto.Avatar;
            user.IsActive = dto.IsActive;
            user.Role = dto.Role;
            _db.SaveChanges();
            return Ok(new UserDto {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Phone = user.Phone,
                Avatar = user.Avatar,
                IsActive = user.IsActive,
                Role = user.Role
            });
        }

        // SystemAdmin, NetworkOwner: удалить пользователя
        [HttpDelete("{id}")]
        
        public IActionResult Delete(int id)
        {
            var user = _db.Users.Find(id);
            if (user == null) return NotFound();
            _db.Users.Remove(user);
            _db.SaveChanges();
            return NoContent();
        }
    }
}
