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
using BookHub.Helpers;

namespace BookHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PaymentsController : ControllerBase
    {
        private readonly BookHubDbContext _context;

        public PaymentsController(BookHubDbContext context)
        {
            _context = context;
        }

        // GET: api/Payments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymentDto>>> GetPayments()
        {
            var payments = await _context.Payments
                .Include(p => p.Booking)
                    .ThenInclude(b => b.User)
                .Include(p => p.Booking)
                    .ThenInclude(b => b.Seat)
                        .ThenInclude(s => s.Hall)
                            .ThenInclude(h => h.Club)
                .ToListAsync();
            // Менеджер видит только платежи своего клуба
            if (User.IsInRole("Manager"))
            {
                int? managedClubId = AuthorizationHelper.GetManagedClubId(User);
                payments = payments.Where(p => p.Booking?.Seat?.Hall?.ClubId == managedClubId).ToList();
            }
            // User видит только свои платежи
            if (User.IsInRole("User"))
            {
                int currentUserId = AuthorizationHelper.GetCurrentUserId(User);
                payments = payments.Where(p => p.Booking?.UserId == currentUserId).ToList();
            }
            var dtos = payments.Select(p => new PaymentDto
            {
                Id = p.Id,
                BookingId = p.BookingId,
                Amount = p.Amount,
                PaymentMethod = p.PaymentMethod,
                PaymentStatus = p.PaymentStatus,
                PaidAt = p.PaidAt,
                UserName = p.Booking?.User?.FullName ?? "-",
                ClubName = p.Booking?.Seat?.Hall?.Club?.Name ?? "-",
                UserAvatar = "https://i.pravatar.cc/150?u=" + (p.Booking?.User?.Email ?? "user")
            }).ToList();
            return dtos;
        }

        // GET: api/Payments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymentDto>> GetPayment(int id)
        {
            var p = await _context.Payments
                .Include(pay => pay.Booking)
                    .ThenInclude(b => b.Seat)
                        .ThenInclude(s => s.Hall)
                .Include(pay => pay.Booking)
                    .ThenInclude(b => b.User)
                .FirstOrDefaultAsync(pay => pay.Id == id);
            if (p == null)
                return NotFound();
            // Проверка разрешения на просмотр платежа
            bool canView = AuthorizationHelper.HasPermission(User, "Платежи", "Просмотр", (uid) =>
                _context.UserRoles.Where(ur => ur.UserId == uid).Select(ur => ur.Role).FirstOrDefault());
            // Менеджер может просматривать только платежи своего клуба
            if (User.IsInRole("Manager"))
            {
                int? managedClubId = AuthorizationHelper.GetManagedClubId(User);
                if (p.Booking?.Seat?.Hall?.ClubId != managedClubId)
                    canView = false;
            }
            // User может просматривать только свои платежи
            if (User.IsInRole("User") && p.Booking?.UserId != AuthorizationHelper.GetCurrentUserId(User))
                canView = false;
            if (!canView)
                return AuthorizationHelper.CreateForbidResult("Недостаточно прав для просмотра платежа");
            var dto = new PaymentDto
            {
                Id = p.Id,
                BookingId = p.BookingId,
                Amount = p.Amount,
                PaymentMethod = p.PaymentMethod,
                PaymentStatus = p.PaymentStatus,
                PaidAt = p.PaidAt
            };
            return dto;
        }

        // PUT: api/Payments/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPayment(int id, PaymentDto dto)
        {
            if (id != dto.Id)
                return BadRequest("ID в URL не совпадает с ID объекта.");
            if (dto.Amount < 0)
                return BadRequest("Сумма платежа должна быть положительной.");
            var payment = await _context.Payments
                .Include(pay => pay.Booking)
                    .ThenInclude(b => b.Seat)
                        .ThenInclude(s => s.Hall)
                .Include(pay => pay.Booking)
                    .ThenInclude(b => b.User)
                .FirstOrDefaultAsync(pay => pay.Id == id);
            if (payment == null)
                return NotFound();
            // Проверка разрешения на редактирование платежа
            bool canEdit = AuthorizationHelper.HasPermission(User, "Платежи", "Изменение", (uid) =>
                _context.UserRoles.Where(ur => ur.UserId == uid).Select(ur => ur.Role).FirstOrDefault());
            // Менеджер может редактировать только платежи своего клуба
            if (User.IsInRole("Manager"))
            {
                int? managedClubId = AuthorizationHelper.GetManagedClubId(User);
                if (payment.Booking?.Seat?.Hall?.ClubId != managedClubId)
                    canEdit = false;
            }
            // User может редактировать только свои платежи
            if (User.IsInRole("User") && payment.Booking?.UserId != AuthorizationHelper.GetCurrentUserId(User))
                canEdit = false;
            if (!canEdit)
                return AuthorizationHelper.CreateForbidResult("Недостаточно прав для редактирования платежа");
            payment.BookingId = dto.BookingId;
            payment.Amount = dto.Amount;
            payment.PaymentMethod = dto.PaymentMethod;
            payment.PaymentStatus = dto.PaymentStatus;
            payment.PaidAt = dto.PaidAt;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymentExists(id))
                    return NotFound();
                else
                    throw;
            }
            return NoContent();
        }

        // POST: api/Payments
        [HttpPost]
        public async Task<ActionResult<PaymentDto>> PostPayment(PaymentDto dto)
        {
            if (dto.Amount < 0)
                return BadRequest("Сумма платежа должна быть положительной.");
            // Проверка разрешения на создание платежа
            bool canCreate = AuthorizationHelper.HasPermission(User, "Платежи", "Создание", (uid) =>
                _context.UserRoles.Where(ur => ur.UserId == uid).Select(ur => ur.Role).FirstOrDefault());
            // Менеджер может создавать платежи только для своего клуба
            var booking = await _context.Bookings
                .Include(b => b.Seat)
                    .ThenInclude(s => s.Hall)
                .FirstOrDefaultAsync(b => b.Id == dto.BookingId);
            if (User.IsInRole("Manager"))
            {
                int? managedClubId = AuthorizationHelper.GetManagedClubId(User);
                if (booking?.Seat?.Hall?.ClubId != managedClubId)
                    canCreate = false;
            }
            // User может создавать только свои платежи
            if (User.IsInRole("User") && booking?.UserId != AuthorizationHelper.GetCurrentUserId(User))
                canCreate = false;
            if (!canCreate)
                return AuthorizationHelper.CreateForbidResult("Недостаточно прав для создания платежа");
            var payment = new Payment
            {
                BookingId = dto.BookingId,
                Amount = dto.Amount,
                PaymentMethod = dto.PaymentMethod,
                PaymentStatus = dto.PaymentStatus,
                PaidAt = dto.PaidAt
            };
            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();
            dto.Id = payment.Id;
            return CreatedAtAction(nameof(GetPayment), new { id = payment.Id }, dto);
        }

        // DELETE: api/Payments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePayment(int id)
        {
            var payment = await _context.Payments
                .Include(pay => pay.Booking)
                    .ThenInclude(b => b.Seat)
                        .ThenInclude(s => s.Hall)
                .Include(pay => pay.Booking)
                    .ThenInclude(b => b.User)
                .FirstOrDefaultAsync(pay => pay.Id == id);
            if (payment == null)
                return NotFound();
            // Проверка разрешения на удаление платежа
            bool canDelete = AuthorizationHelper.HasPermission(User, "Платежи", "Удаление", (uid) =>
                _context.UserRoles.Where(ur => ur.UserId == uid).Select(ur => ur.Role).FirstOrDefault());
            // Менеджер может удалять только платежи своего клуба
            if (User.IsInRole("Manager"))
            {
                int? managedClubId = AuthorizationHelper.GetManagedClubId(User);
                if (payment.Booking?.Seat?.Hall?.ClubId != managedClubId)
                    canDelete = false;
            }
            // User может удалять только свои платежи
            if (User.IsInRole("User") && payment.Booking?.UserId != AuthorizationHelper.GetCurrentUserId(User))
                canDelete = false;
            if (!canDelete)
                return AuthorizationHelper.CreateForbidResult("Недостаточно прав для удаления платежа");
            _context.Payments.Remove(payment);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool PaymentExists(int id)
        {
            return _context.Payments.Any(e => e.Id == id);
        }
    }
}
