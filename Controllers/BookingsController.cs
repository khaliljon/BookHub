using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BookHub.Models.New;
using BookHub.Data;
using System.Linq;

namespace BookHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingsController : ControllerBase
    {
        private readonly BookHubDbContext _db;
        public BookingsController(BookHubDbContext db) { _db = db; }

        // SystemAdmin, ClubManager: получить все бронирования
        [HttpGet]
        [Authorize(Roles = "SystemAdmin,ClubManager")]
        public IActionResult GetAll() => Ok(_db.Bookings.ToList());

        // User: получить свои бронирования
        [HttpGet("user/{userId}")]
        [Authorize(Roles = "User")]
        public IActionResult GetByUser(int userId)
        {
            var bookings = _db.Bookings.Where(b => b.UserId == userId).ToList();
            return Ok(bookings);
        }

        // User, ClubManager: создать бронирование
        [HttpPost]
        [Authorize(Roles = "SystemAdmin,ClubManager,User")]
        public IActionResult Create([FromBody] Booking booking)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            _db.Bookings.Add(booking);
            _db.SaveChanges();
            return CreatedAtAction(nameof(GetAll), new { id = booking.Id }, booking);
        }

        // User, ClubManager: обновить бронирование
        [HttpPut("{id}")]
        [Authorize(Roles = "SystemAdmin,ClubManager,User")]
        public IActionResult Update(int id, [FromBody] Booking booking)
        {
            var b = _db.Bookings.Find(id);
            if (b == null) return NotFound();
            b.SeatId = booking.SeatId;
            b.StartTime = booking.StartTime;
            b.EndTime = booking.EndTime;
            b.TotalPrice = booking.TotalPrice;
            b.Status = booking.Status;
            _db.SaveChanges();
            return Ok(b);
        }

        // SystemAdmin, ClubManager: удалить бронирование
        [HttpDelete("{id}")]
        [Authorize(Roles = "SystemAdmin,ClubManager")]
        public IActionResult Delete(int id)
        {
            var b = _db.Bookings.Find(id);
            if (b == null) return NotFound();
            _db.Bookings.Remove(b);
            _db.SaveChanges();
            return NoContent();
        }
    }
}
