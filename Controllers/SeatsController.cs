using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BookHub.Models.New;
using BookHub.Data;
using System.Linq;

namespace BookHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeatsController : ControllerBase
    {
        private readonly BookHubDbContext _db;
        public SeatsController(BookHubDbContext db) { _db = db; }

        [HttpGet]
        
        public IActionResult GetAll() => Ok(_db.Seats.ToList());

        [HttpPost]
        
        public IActionResult Create([FromBody] Seat seat)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            _db.Seats.Add(seat);
            _db.SaveChanges();
            return CreatedAtAction(nameof(GetAll), new { id = seat.Id }, seat);
        }

        [HttpPut("{id}")]
        
        public IActionResult Update(int id, [FromBody] Seat seat)
        {
            var s = _db.Seats.Find(id);
            if (s == null) return NotFound();
            s.Label = seat.Label;
            s.SeatType = seat.SeatType;
            s.IsActive = seat.IsActive;
            s.MetadataJson = seat.MetadataJson;
            _db.SaveChanges();
            return Ok(s);
        }

        [HttpDelete("{id}")]
        
        public IActionResult Delete(int id)
        {
            var s = _db.Seats.Find(id);
            if (s == null) return NotFound();
            _db.Seats.Remove(s);
            _db.SaveChanges();
            return NoContent();
        }
    }
}
