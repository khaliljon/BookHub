using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using BookHub.Data;
using BookHub.Models;
using BookHub.Models.Dtos;

namespace BookHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ClubsController : ControllerBase
    {
        private readonly BookHubDbContext _context;

        public ClubsController(BookHubDbContext context)
        {
            _context = context;
        }

        // GET: api/Clubs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClubDto>>> GetClubs()
        {
            var clubs = await _context.Clubs.ToListAsync();
            var dtos = clubs.Select(club => new ClubDto
            {
                Id = club.Id,
                Name = club.Name,
                City = club.City,
                Address = club.Address,
                Description = club.Description,
                Phone = club.Phone,
                Email = club.Email,
                OpeningHours = club.OpeningHours,
                IsDeleted = club.IsDeleted,
                IsActive = club.IsActive,
                LogoUrl = club.LogoUrl
            }).ToList();
            return dtos;
        }

        // GET: api/Clubs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ClubDto>> GetClub(int id)
        {
            var club = await _context.Clubs.FirstOrDefaultAsync(c => c.Id == id);

            if (club == null)
                return NotFound();

            var dto = new ClubDto
            {
                Id = club.Id,
                Name = club.Name,
                City = club.City,
                Address = club.Address,
                Description = club.Description,
                Phone = club.Phone,
                Email = club.Email,
                OpeningHours = club.OpeningHours,
                IsDeleted = club.IsDeleted,
                IsActive = club.IsActive,
                LogoUrl = club.LogoUrl
            };
            return dto;
        }

        // GET: api/Clubs/{id}/Halls
        [HttpGet("{id}/Halls")]
        public async Task<ActionResult<IEnumerable<HallDto>>> GetClubHalls(int id)
        {
            var halls = await _context.Halls.Where(h => h.ClubId == id).ToListAsync();
            var dtos = halls.Select(h => new HallDto
            {
                Id = h.Id,
                ClubId = h.ClubId,
                Name = h.Name,
                Description = h.Description,
                IsDeleted = h.IsDeleted,
                PhotoUrls = h.PhotoUrls ?? new List<string>()
            }).ToList();
            return dtos;
        }

        // PUT: api/Clubs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutClub(int id, ClubDto dto)
        {
            if (id != dto.Id)
                return BadRequest("ID в URL не совпадает с ID объекта.");

            var club = await _context.Clubs.FindAsync(id);
            if (club == null)
                return NotFound();

            club.Name = dto.Name;
            club.City = dto.City;
            club.Address = dto.Address;
            club.Description = dto.Description;
            club.Phone = dto.Phone;
            club.Email = dto.Email;
            club.OpeningHours = dto.OpeningHours;
            club.IsActive = dto.IsActive;
            club.LogoUrl = dto.LogoUrl;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClubExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // POST: api/Clubs
        [HttpPost]
        public async Task<ActionResult<ClubDto>> PostClub(ClubDto dto)
        {
            var club = new Club
            {
                Name = dto.Name,
                City = dto.City,
                Address = dto.Address,
                Description = dto.Description,
                Phone = dto.Phone,
                Email = dto.Email,
                OpeningHours = dto.OpeningHours,
                IsDeleted = dto.IsDeleted,
                IsActive = dto.IsActive,
                LogoUrl = dto.LogoUrl
            };

            _context.Clubs.Add(club);
            await _context.SaveChangesAsync();

            dto.Id = club.Id;
            dto.IsActive = club.IsActive;

            return CreatedAtAction(nameof(GetClub), new { id = club.Id }, dto);
        }

        // DELETE: api/Clubs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClub(int id)
        {
            var club = await _context.Clubs.FindAsync(id);
            if (club == null)
                return NotFound();

            _context.Clubs.Remove(club);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ClubExists(int id)
        {
            return _context.Clubs.Any(e => e.Id == id);
        }
    }
}
