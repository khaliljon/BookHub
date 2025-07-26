using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using BookHub.Data;
using BookHub.Models;
using BookHub.Models.Dtos;
using BookHub.Helpers;

namespace BookHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ComputerSpecsController : ControllerBase
    {
        private readonly BookHubDbContext _context;

        public ComputerSpecsController(BookHubDbContext context)
        {
            _context = context;
        }

        // GET: api/ComputerSpecs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ComputerSpecDto>>> GetComputerSpecs()
        {
            var specs = await _context.ComputerSpecs.ToListAsync();

            var dtos = specs.Select(s => new ComputerSpecDto
            {
                Id = s.Id,
                SeatId = s.SeatId,
                CPU = s.CPU,
                GPU = s.GPU,
                RAM = s.RAM,
                Monitor = s.Monitor,
                Peripherals = s.Peripherals,
                UpdatedAt = s.UpdatedAt
            }).ToList();

            return dtos;
        }

        // GET: api/ComputerSpecs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ComputerSpecDto>> GetComputerSpec(int id)
        {
            var spec = await _context.ComputerSpecs.FindAsync(id);

            if (spec == null)
                return NotFound();

            var dto = new ComputerSpecDto
            {
                Id = spec.Id,
                SeatId = spec.SeatId,
                CPU = spec.CPU,
                GPU = spec.GPU,
                RAM = spec.RAM,
                Monitor = spec.Monitor,
                Peripherals = spec.Peripherals,
                UpdatedAt = spec.UpdatedAt
            };

            return dto;
        }

        // PUT: api/ComputerSpecs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutComputerSpec(int id, ComputerSpecDto dto)
        {
            if (id != dto.Id)
                return BadRequest("ID в URL не совпадает с ID объекта.");
            var spec = await _context.ComputerSpecs.FindAsync(id);
            if (spec == null)
                return NotFound();
            // Проверка разрешения на редактирование характеристики
            bool canEdit = AuthorizationHelper.HasPermission(User, "Компьютеры", "Изменение", (uid) =>
                _context.UserRoles.Where(ur => ur.UserId == uid).Select(ur => ur.Role).FirstOrDefault());
            // Менеджер может редактировать только характеристики своего клуба
            var seat = await _context.Seats.FindAsync(spec.SeatId);
            var hall = seat != null ? await _context.Halls.FindAsync(seat.HallId) : null;
            if (User.IsInRole("Manager") && hall?.ClubId != AuthorizationHelper.GetManagedClubId(User))
                canEdit = false;
            if (!canEdit)
                return AuthorizationHelper.CreateForbidResult("Недостаточно прав для редактирования компьютера");
            spec.SeatId = dto.SeatId;
            spec.CPU = dto.CPU;
            spec.GPU = dto.GPU;
            spec.RAM = dto.RAM;
            spec.Monitor = dto.Monitor;
            spec.Peripherals = dto.Peripherals;
            spec.UpdatedAt = dto.UpdatedAt;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ComputerSpecExists(id))
                    return NotFound();
                else
                    throw;
            }
            return NoContent();
        }

        // POST: api/ComputerSpecs
        [HttpPost]
        public async Task<ActionResult<ComputerSpecDto>> PostComputerSpec(ComputerSpecDto dto)
        {
            // Проверка разрешения на создание характеристики
            bool canCreate = AuthorizationHelper.HasPermission(User, "Компьютеры", "Создание", (uid) =>
                _context.UserRoles.Where(ur => ur.UserId == uid).Select(ur => ur.Role).FirstOrDefault());
            // Менеджер может создавать характеристики только для своего клуба
            var seat = await _context.Seats.FindAsync(dto.SeatId);
            var hall = seat != null ? await _context.Halls.FindAsync(seat.HallId) : null;
            if (User.IsInRole("Manager") && hall?.ClubId != AuthorizationHelper.GetManagedClubId(User))
                canCreate = false;
            if (!canCreate)
                return AuthorizationHelper.CreateForbidResult("Недостаточно прав для создания компьютера");
            var spec = new ComputerSpec
            {
                SeatId = dto.SeatId,
                CPU = dto.CPU,
                GPU = dto.GPU,
                RAM = dto.RAM,
                Monitor = dto.Monitor,
                Peripherals = dto.Peripherals,
                UpdatedAt = dto.UpdatedAt
            };
            _context.ComputerSpecs.Add(spec);
            await _context.SaveChangesAsync();
            dto.Id = spec.Id;
            return CreatedAtAction(nameof(GetComputerSpec), new { id = spec.Id }, dto);
        }

        // DELETE: api/ComputerSpecs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComputerSpec(int id)
        {
            var spec = await _context.ComputerSpecs.FindAsync(id);
            if (spec == null)
                return NotFound();
            // Проверка разрешения на удаление характеристики
            bool canDelete = AuthorizationHelper.HasPermission(User, "Компьютеры", "Удаление", (uid) =>
                _context.UserRoles.Where(ur => ur.UserId == uid).Select(ur => ur.Role).FirstOrDefault());
            var seat = await _context.Seats.FindAsync(spec.SeatId);
            var hall = seat != null ? await _context.Halls.FindAsync(seat.HallId) : null;
            if (User.IsInRole("Manager") && hall?.ClubId != AuthorizationHelper.GetManagedClubId(User))
                canDelete = false;
            if (!canDelete)
                return AuthorizationHelper.CreateForbidResult("Недостаточно прав для удаления компьютера");
            _context.ComputerSpecs.Remove(spec);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool ComputerSpecExists(int id)
        {
            return _context.ComputerSpecs.Any(e => e.Id == id);
        }
    }
}
