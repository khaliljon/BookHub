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
    public class HallsController : ControllerBase
    {
        private readonly BookHubDbContext _context;

        public HallsController(BookHubDbContext context)
        {
            _context = context;
        }

        // GET: api/Halls
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HallDto>>> GetHalls([FromQuery(Name = "club_id")] int? club_id)
        {
            var query = _context.Halls.AsQueryable();
            if (club_id.HasValue)
                query = query.Where(h => h.ClubId == club_id.Value);
            var halls = await query.ToListAsync();
            var dtos = halls.Select(h => new HallDto
            {
                Id = h.Id,
                ClubId = h.ClubId,
                Name = h.Name,
                Description = h.Description,
                IsDeleted = h.IsDeleted
            }).ToList();
            return dtos;
        }

        // GET: api/Halls/5
        [HttpGet("{id}")]
        public async Task<ActionResult<HallDto>> GetHall(int id)
        {
            var hall = await _context.Halls.FindAsync(id);

            if (hall == null)
                return NotFound();

            var dto = new HallDto
            {
                Id = hall.Id,
                ClubId = hall.ClubId,
                Name = hall.Name,
                Description = hall.Description,
                IsDeleted = hall.IsDeleted
            };

            return dto;
        }

        // PUT: api/Halls/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHall(int id, HallDto dto)
        {
            if (id != dto.Id)
                return BadRequest("ID в URL не совпадает с ID объекта.");

            var hall = await _context.Halls.FindAsync(id);
            if (hall == null)
                return NotFound();

            hall.ClubId = dto.ClubId;
            hall.Name = dto.Name;
            hall.Description = dto.Description;
            hall.IsDeleted = dto.IsDeleted;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HallExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // POST: api/Halls
        [HttpPost]
        public async Task<ActionResult<HallDto>> PostHall(HallDto dto)
        {
            var hall = new Hall
            {
                ClubId = dto.ClubId,
                Name = dto.Name,
                Description = dto.Description,
                IsDeleted = dto.IsDeleted
            };

            _context.Halls.Add(hall);
            await _context.SaveChangesAsync();

            dto.Id = hall.Id;

            return CreatedAtAction(nameof(GetHall), new { id = hall.Id }, dto);
        }

        // DELETE: api/Halls/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHall(int id)
        {
            var hall = await _context.Halls.FindAsync(id);
            if (hall == null)
                return NotFound();

            _context.Halls.Remove(hall);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool HallExists(int id)
        {
            return _context.Halls.Any(e => e.Id == id);
        }
    }
}
