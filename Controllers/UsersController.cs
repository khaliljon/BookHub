using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OynaApi.Data;
using OynaApi.Models;
using OynaApi.Models.Dtos;

namespace OynaApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly OynaDbContext _context;

        public UsersController(OynaDbContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = await _context.Users.ToListAsync();

            var dtos = users.Select(u => new UserDto
            {
                Id = u.Id,
                FullName = u.FullName,
                PhoneNumber = u.PhoneNumber,
                Email = u.Email,
                RegistrationDate = u.RegistrationDate,
                Balance = u.Balance,
                Points = u.Points,
                IsDeleted = u.IsDeleted
            }).ToList();

            return dtos;
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound();

            var dto = new UserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                PhoneNumber = user.PhoneNumber,
                Email = user.Email,
                RegistrationDate = user.RegistrationDate,
                Balance = user.Balance,
                Points = user.Points,
                IsDeleted = user.IsDeleted
            };

            return dto;
        }

        // PUT: api/Users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, UserDto dto)
        {
            if (id != dto.Id)
                return BadRequest("ID в URL не совпадает с ID объекта.");

            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

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

        // POST: api/Users
        [HttpPost]
        public async Task<ActionResult<UserDto>> PostUser(UserDto dto)
        {
            var user = new User
            {
                FullName = dto.FullName,
                PhoneNumber = dto.PhoneNumber,
                Email = dto.Email,
                RegistrationDate = DateTime.UtcNow,
                Balance = dto.Balance,
                Points = dto.Points,
                IsDeleted = dto.IsDeleted
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            dto.Id = user.Id;
            dto.RegistrationDate = user.RegistrationDate;

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, dto);
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
