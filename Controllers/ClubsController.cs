using Microsoft.AspNetCore.Mvc;
using BookHub.Models.New;
using BookHub.Data;
using System.Linq;

namespace BookHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClubsController : ControllerBase
    {
        private readonly BookHubDbContext _db;
        public ClubsController(BookHubDbContext db) { _db = db; }

        // Получить все клубы
        [HttpGet]
        public IActionResult GetAll() => Ok(_db.Clubs.ToList());

        // Создать клуб
        [HttpPost]
        public IActionResult Create([FromBody] Club club)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            _db.Clubs.Add(club);
            _db.SaveChanges();
            return CreatedAtAction(nameof(GetAll), new { id = club.Id }, club);
        }

        // Обновить клуб
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Club club)
        {
            var c = _db.Clubs.Find(id);
            if (c == null) return NotFound();
            c.Name = club.Name;
            c.Description = club.Description;
            c.NetworkId = club.NetworkId;
            c.MetadataJson = club.MetadataJson;
            _db.SaveChanges();
            return Ok(c);
        }

        // Удалить клуб
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var c = _db.Clubs.Find(id);
            if (c == null) return NotFound();
            _db.Clubs.Remove(c);
            _db.SaveChanges();
            return NoContent();
        }
    }
}
