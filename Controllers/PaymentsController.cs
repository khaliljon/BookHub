using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BookHub.Models.New;
using BookHub.Data;
using System.Linq;

namespace BookHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly BookHubDbContext _db;
        public PaymentsController(BookHubDbContext db) { _db = db; }

        [HttpGet]
        [Authorize(Roles = "SystemAdmin,ClubManager")]
        public IActionResult GetAll() => Ok(_db.Payments.ToList());

        [HttpPost]
        [Authorize(Roles = "SystemAdmin,ClubManager,User")]
        public IActionResult Create([FromBody] Payment payment)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            _db.Payments.Add(payment);
            _db.SaveChanges();
            return CreatedAtAction(nameof(GetAll), new { id = payment.Id }, payment);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "SystemAdmin,ClubManager")]
        public IActionResult Update(int id, [FromBody] Payment payment)
        {
            var p = _db.Payments.Find(id);
            if (p == null) return NotFound();
            p.Amount = payment.Amount;
            p.Method = payment.Method;
            p.Status = payment.Status;
            p.PaidAt = payment.PaidAt;
            _db.SaveChanges();
            return Ok(p);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "SystemAdmin,ClubManager")]
        public IActionResult Delete(int id)
        {
            var p = _db.Payments.Find(id);
            if (p == null) return NotFound();
            _db.Payments.Remove(p);
            _db.SaveChanges();
            return NoContent();
        }
    }
}
