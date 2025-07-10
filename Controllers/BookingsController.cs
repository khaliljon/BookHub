using System;
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
    public class BookingsController : ControllerBase
    {
        private readonly OynaDbContext _context;

        public BookingsController(OynaDbContext context)
        {
            _context = context;
        }

        // GET: api/Bookings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookingDto>>> GetBookings()
        {
            var bookings = await _context.Bookings.ToListAsync();

            var dtos = bookings.Select(b => new BookingDto
            {
                Id = b.Id,
                UserId = b.UserId,
                SeatId = b.SeatId,
                TariffId = b.TariffId,
                Date = b.Date,
                TimeStart = b.TimeStart,
                TimeEnd = b.TimeEnd,
                TotalPrice = b.TotalPrice,
                Status = b.Status
            }).ToList();

            return dtos;
        }

        // GET: api/Bookings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BookingDto>> GetBooking(int id)
        {
            var b = await _context.Bookings.FindAsync(id);

            if (b == null)
                return NotFound();

            var dto = new BookingDto
            {
                Id = b.Id,
                UserId = b.UserId,
                SeatId = b.SeatId,
                TariffId = b.TariffId,
                Date = b.Date,
                TimeStart = b.TimeStart,
                TimeEnd = b.TimeEnd,
                TotalPrice = b.TotalPrice,
                Status = b.Status
            };

            return dto;
        }

        // PUT: api/Bookings/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBooking(int id, BookingDto dto)
        {
            if (id != dto.Id)
                return BadRequest("ID в URL не совпадает с ID объекта.");

            if (dto.TimeEnd <= dto.TimeStart)
                return BadRequest("Время окончания должно быть больше времени начала.");

            var booking = await _context.Bookings.FindAsync(id);

            if (booking == null)
                return NotFound();

            booking.UserId = dto.UserId;
            booking.SeatId = dto.SeatId;
            booking.TariffId = dto.TariffId;
            booking.Date = dto.Date;
            booking.TimeStart = dto.TimeStart;
            booking.TimeEnd = dto.TimeEnd;
            booking.TotalPrice = dto.TotalPrice;
            booking.Status = dto.Status;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookingExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // POST: api/Bookings
        [HttpPost]
        public async Task<ActionResult<BookingDto>> PostBooking(BookingDto dto)
        {
            if (dto.TimeEnd <= dto.TimeStart)
                return BadRequest("Время окончания должно быть больше времени начала.");

            var booking = new Booking
            {
                UserId = dto.UserId,
                SeatId = dto.SeatId,
                TariffId = dto.TariffId,
                Date = dto.Date,
                TimeStart = dto.TimeStart,
                TimeEnd = dto.TimeEnd,
                TotalPrice = dto.TotalPrice,
                Status = dto.Status,
                CreatedAt = DateTime.UtcNow
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            dto.Id = booking.Id;

            return CreatedAtAction(nameof(GetBooking), new { id = booking.Id }, dto);
        }

        // DELETE: api/Bookings/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
                return NotFound();

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BookingExists(int id)
        {
            return _context.Bookings.Any(e => e.Id == id);
        }
    }
}
