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
    public class SeatsController : ControllerBase
    {
        private readonly BookHubDbContext _context;

        public SeatsController(BookHubDbContext context)
        {
            _context = context;
        }

        // GET: api/Seats
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SeatDto>>> GetSeats()
        {
            var seats = await _context.Seats.ToListAsync();

            var dtos = seats.Select(seat => new SeatDto
            {
                Id = seat.Id,
                HallId = seat.HallId,
                SeatNumber = seat.SeatNumber,
                Description = seat.Description,
                Status = seat.Status,
                IsDeleted = seat.IsDeleted
            }).ToList();

            return dtos;
        }

        // GET: api/Seats/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SeatDto>> GetSeat(int id)
        {
            var seat = await _context.Seats.FindAsync(id);

            if (seat == null)
                return NotFound();

            var dto = new SeatDto
            {
                Id = seat.Id,
                HallId = seat.HallId,
                SeatNumber = seat.SeatNumber,
                Description = seat.Description,
                Status = seat.Status,
                IsDeleted = seat.IsDeleted
            };

            return dto;
        }

        // PUT: api/Seats/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSeat(int id, SeatDto dto)
        {
            if (id != dto.Id)
                return BadRequest("ID в URL не совпадает с ID объекта.");
            var seat = await _context.Seats.FindAsync(id);
            if (seat == null)
                return NotFound();
            // Проверка разрешения на редактирование места
            bool canEdit = AuthorizationHelper.HasPermission(User, "Места", "Изменение", (uid) =>
                _context.UserRoles.Where(ur => ur.UserId == uid).Select(ur => ur.Role).FirstOrDefault());
            // Менеджер может редактировать только места своего клуба
            var hall = await _context.Halls.FindAsync(seat.HallId);
            if (User.IsInRole("Manager") && hall?.ClubId != AuthorizationHelper.GetManagedClubId(User))
                canEdit = false;
            if (!canEdit)
                return AuthorizationHelper.CreateForbidResult("Недостаточно прав для редактирования места");
            seat.HallId = dto.HallId;
            seat.SeatNumber = dto.SeatNumber;
            seat.Description = dto.Description;
            seat.Status = dto.Status;
            seat.IsDeleted = dto.IsDeleted;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SeatExists(id))
                    return NotFound();
                else
                    throw;
            }
            return NoContent();
        }

        // POST: api/Seats
        [HttpPost]
        public async Task<ActionResult<SeatDto>> PostSeat(SeatDto dto)
        {
            // Проверка разрешения на создание места
            bool canCreate = AuthorizationHelper.HasPermission(User, "Места", "Создание", (uid) =>
                _context.UserRoles.Where(ur => ur.UserId == uid).Select(ur => ur.Role).FirstOrDefault());
            // Менеджер может создавать места только для своего клуба
            var hall = await _context.Halls.FindAsync(dto.HallId);
            if (User.IsInRole("Manager") && hall?.ClubId != AuthorizationHelper.GetManagedClubId(User))
                canCreate = false;
            if (!canCreate)
                return AuthorizationHelper.CreateForbidResult("Недостаточно прав для создания места");
            var seat = new Seat
            {
                HallId = dto.HallId,
                SeatNumber = dto.SeatNumber,
                Description = dto.Description,
                Status = dto.Status,
                IsDeleted = dto.IsDeleted
            };
            _context.Seats.Add(seat);
            await _context.SaveChangesAsync();
            dto.Id = seat.Id;
            return CreatedAtAction(nameof(GetSeat), new { id = seat.Id }, dto);
        }

        // DELETE: api/Seats/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSeat(int id)
        {
            var seat = await _context.Seats.FindAsync(id);
            if (seat == null)
                return NotFound();
            // Проверка разрешения на удаление места
            bool canDelete = AuthorizationHelper.HasPermission(User, "Места", "Удаление", (uid) =>
                _context.UserRoles.Where(ur => ur.UserId == uid).Select(ur => ur.Role).FirstOrDefault());
            var hall = await _context.Halls.FindAsync(seat.HallId);
            // Менеджер может удалять только места своего клуба
            if (User.IsInRole("Manager") && hall?.ClubId != AuthorizationHelper.GetManagedClubId(User))
                canDelete = false;
            if (!canDelete)
                return AuthorizationHelper.CreateForbidResult("Недостаточно прав для удаления места");
            _context.Seats.Remove(seat);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool SeatExists(int id)
        {
            return _context.Seats.Any(e => e.Id == id);
        }
    }
}
