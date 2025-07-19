using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using OynaApi.Data;
using OynaApi.Models;
using OynaApi.Models.Dtos;

namespace OynaApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PaymentsController : ControllerBase
    {
        private readonly OynaDbContext _context;

        public PaymentsController(OynaDbContext context)
        {
            _context = context;
        }

        // GET: api/Payments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymentDto>>> GetPayments()
        {
            var payments = await _context.Payments.ToListAsync();

            var dtos = payments.Select(p => new PaymentDto
            {
                Id = p.Id,
                BookingId = p.BookingId,
                Amount = p.Amount,
                PaymentMethod = p.PaymentMethod,
                PaymentStatus = p.PaymentStatus,
                PaidAt = p.PaidAt
            }).ToList();

            return dtos;
        }

        // GET: api/Payments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymentDto>> GetPayment(int id)
        {
            var p = await _context.Payments.FindAsync(id);

            if (p == null)
                return NotFound();

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

            var payment = await _context.Payments.FindAsync(id);

            if (payment == null)
                return NotFound();

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
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null)
                return NotFound();

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
