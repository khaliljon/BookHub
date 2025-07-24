using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using BookHub.Data;
using BookHub.Models;
using BookHub.Models.Dtos;

namespace BookHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BookingsController : ControllerBase
    {
        private readonly BookHubDbContext _context;

        public BookingsController(BookHubDbContext context)
        {
            _context = context;
        }

        // GET: api/Bookings (свои бронирования или все для админа/менеджера)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetBookings()
        {
            var userIdClaim = User.Claims.FirstOrDefault(x => x.Type == "id" || x.Type == ClaimTypes.NameIdentifier);
            var emailClaim = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email);

            int currentUserId;
            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out currentUserId))
            {
                // Всё ок, используем userId
            }
            else if (emailClaim != null)
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == emailClaim.Value);
                if (user == null)
                    return Forbid("Пользователь с таким email не найден.");
                currentUserId = user.Id;
            }
            else
            {
                return Forbid("Не найден id пользователя или email в клеймах.");
            }
            var isAdminOrManager = User.IsInRole("Admin") || User.IsInRole("Manager") || User.IsInRole("SuperAdmin");

            IQueryable<Booking> query = _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Seat)
                    .ThenInclude(s => s.Hall)
                        .ThenInclude(h => h.Club)
                .Include(b => b.Tariff)
                .Include(b => b.Payments);

            // Обычные пользователи видят только свои бронирования
            if (!isAdminOrManager)
            {
                query = query.Where(b => b.UserId == currentUserId);
            }

            var bookings = await query.ToListAsync();

            if (isAdminOrManager)
            {
                var dtos = bookings.Select(b => new BookingDetailsDto
                {
                    Id = b.Id,
                    UserId = b.UserId,
                    SeatId = b.SeatId,
                    TariffId = b.TariffId,
                    Date = b.Date,
                    StartTime = b.TimeStart.ToString(),
                    EndTime = b.TimeEnd.ToString(),
                    TotalAmount = b.TotalPrice,
                    Status = b.Status,
                    CreatedAt = b.CreatedAt,
                    User = b.User == null ? null : new UserDto
                    {
                        Id = b.User.Id,
                        FullName = b.User.FullName,
                        PhoneNumber = b.User.PhoneNumber,
                        Email = b.User.Email,
                        CreatedAt = b.User.CreatedAt,
                        Balance = b.User.Balance,
                        Points = b.User.Points,
                        IsDeleted = b.User.IsDeleted,
                        Roles = b.User.UserRoles?.Select(ur => ur.Role.Name).ToList() ?? new List<string>()
                    },
                    Seat = b.Seat == null ? null : new SeatDetailsDto
                    {
                        Id = b.Seat.Id,
                        HallId = b.Seat.HallId,
                        SeatNumber = b.Seat.SeatNumber,
                        Description = b.Seat.Description,
                        Status = b.Seat.Status,
                        IsDeleted = b.Seat.IsDeleted,
                        Hall = b.Seat.Hall == null ? null : new HallDetailsDto
                        {
                            Id = b.Seat.Hall.Id,
                            ClubId = b.Seat.Hall.ClubId,
                            Name = b.Seat.Hall.Name,
                            Description = b.Seat.Hall.Description,
                            IsDeleted = b.Seat.Hall.IsDeleted,
                            PhotoUrls = b.Seat.Hall.PhotoUrls,
                            Club = b.Seat.Hall.Club == null ? null : new ClubDto
                            {
                                Id = b.Seat.Hall.Club.Id,
                                Name = b.Seat.Hall.Club.Name,
                                City = b.Seat.Hall.Club.City,
                                Address = b.Seat.Hall.Club.Address,
                                Description = b.Seat.Hall.Club.Description,
                                Phone = b.Seat.Hall.Club.Phone,
                                Email = b.Seat.Hall.Club.Email,
                                OpeningHours = b.Seat.Hall.Club.OpeningHours,
                                IsDeleted = b.Seat.Hall.Club.IsDeleted,
                                IsActive = b.Seat.Hall.Club.IsActive,
                                LogoUrl = b.Seat.Hall.Club.LogoUrl
                            }
                        }
                    },
                    Tariff = b.Tariff == null ? null : new TariffDto
                    {
                        Id = b.Tariff.Id,
                        ClubId = b.Tariff.ClubId,
                        Name = b.Tariff.Name,
                        Description = b.Tariff.Description,
                        PricePerHour = b.Tariff.PricePerHour,
                        IsNightTariff = b.Tariff.IsNightTariff
                    },
                    Payments = b.Payments?.Select(p => new PaymentDto
                    {
                        Id = p.Id,
                        BookingId = p.BookingId,
                        Amount = p.Amount,
                        PaymentMethod = p.PaymentMethod,
                        PaymentStatus = p.PaymentStatus,
                        PaidAt = p.PaidAt
                    }).ToList() ?? new List<PaymentDto>()
                }).ToList();
                return dtos;
            }
            else
            {
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
        }

        // GET: api/Bookings/5 (свое бронирование или админ/менеджер)
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
