using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BookHub.Models.New;
using BookHub.Data;
using System.Linq;

namespace BookHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomsController : ControllerBase
    {
        private readonly BookHubDbContext _db;
        public RoomsController(BookHubDbContext db) { _db = db; }

        [HttpGet]
        [Authorize(Roles = "SystemAdmin,NetworkOwner,ClubManager")]
        public IActionResult GetAll() => Ok(_db.Rooms.ToList());

        [HttpPost]
        [Authorize(Roles = "SystemAdmin,NetworkOwner,ClubManager")]
        public IActionResult Create([FromBody] Room room)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            _db.Rooms.Add(room);
            _db.SaveChanges();
            return CreatedAtAction(nameof(GetAll), new { id = room.Id }, room);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "SystemAdmin,NetworkOwner,ClubManager")]
        public IActionResult Update(int id, [FromBody] Room room)
        {
            var r = _db.Rooms.Find(id);
            if (r == null) return NotFound();
            r.Name = room.Name;
            r.RoomType = room.RoomType;
            r.MetadataJson = room.MetadataJson;
            _db.SaveChanges();
            return Ok(r);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "SystemAdmin,NetworkOwner,ClubManager")]
        public IActionResult Delete(int id)
        {
            var r = _db.Rooms.Find(id);
            if (r == null) return NotFound();
            _db.Rooms.Remove(r);
            _db.SaveChanges();
            return NoContent();
        }
    }
}
