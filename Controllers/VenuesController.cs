using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BookHub.Models.New;
using BookHub.Data;
using System.Linq;

namespace BookHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VenuesController : ControllerBase
    {
        private readonly BookHubDbContext _db;
        public VenuesController(BookHubDbContext db) { _db = db; }

        // SystemAdmin, NetworkOwner: получить все объекты
        [HttpGet]
        
        public IActionResult GetAll() => Ok(_db.Venues.ToList());

        // NetworkOwner, ClubManager: создать объект
        [HttpPost]
        
        public IActionResult Create([FromBody] Venue venue)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            _db.Venues.Add(venue);
            _db.SaveChanges();
            return CreatedAtAction(nameof(GetAll), new { id = venue.Id }, venue);
        }

        // NetworkOwner, ClubManager: обновить объект
        [HttpPut("{id}")]
        
        public IActionResult Update(int id, [FromBody] Venue venue)
        {
            var v = _db.Venues.Find(id);
            if (v == null) return NotFound();
            v.Name = venue.Name;
            v.Type = venue.Type;
            v.Description = venue.Description;
            v.Location = venue.Location;
            v.OwnerId = venue.OwnerId;
            v.MetadataJson = venue.MetadataJson;
            _db.SaveChanges();
            return Ok(v);
        }

        // SystemAdmin, NetworkOwner: удалить объект
        [HttpDelete("{id}")]
        
        public IActionResult Delete(int id)
        {
            var v = _db.Venues.Find(id);
            if (v == null) return NotFound();
            _db.Venues.Remove(v);
            _db.SaveChanges();
            return NoContent();
        }
    }
}
