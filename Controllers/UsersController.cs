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
        [Authorize(Roles = "SystemAdmin,NetworkOwner")]
        public IActionResult GetAll()
        {
            var users = _db.Users.Select(u => new UserDto
            {
                Id = u.Id,
                FullName = u.FullName,
                Email = u.Email,
                Phone = u.Phone,
                Avatar = u.Avatar,
                IsActive = u.IsActive
            }).ToList();
            return Ok(users);
        }

        // User: получить свои данные
        [HttpGet("{id}")]
        [Authorize]
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
                    IsActive = user.IsActive
                });
            }
            return Forbid();
        }

        // SystemAdmin, NetworkOwner: создать пользователя
        [HttpPost]
        [Authorize(Roles = "SystemAdmin,NetworkOwner")]
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
                PasswordHash = "" // генерировать или принимать отдельно
            };
            _db.Users.Add(user);
            _db.SaveChanges();
            return CreatedAtAction(nameof(Get), new { id = user.Id }, dto);
        }

        // User, ClubManager: обновить свои данные
        [HttpPut("{id}")]
        [Authorize]
        public IActionResult Update(int id, [FromBody] UserDto dto)
        {
            var user = _db.Users.Find(id);
            if (user == null) return NotFound();
            if (User.IsInRole("SystemAdmin") || User.IsInRole("NetworkOwner") || User.IsInRole("ClubManager") || User.Identity.Name == user.Email)
            {
                user.FullName = dto.FullName;
                user.Phone = dto.Phone;
                user.Avatar = dto.Avatar;
                user.IsActive = dto.IsActive;
                _db.SaveChanges();
                return Ok(dto);
            }
            return Forbid();
        }

        // SystemAdmin, NetworkOwner: удалить пользователя
        [HttpDelete("{id}")]
        [Authorize(Roles = "SystemAdmin,NetworkOwner")]
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
