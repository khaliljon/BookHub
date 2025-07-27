using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BookHub.Models.New;
using BookHub.Data;
using System.Linq;

namespace BookHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly BookHubDbContext _db;
        public NotificationsController(BookHubDbContext db) { _db = db; }

        [HttpGet]
        
        public IActionResult GetAll() => Ok(_db.Notifications.ToList());

        [HttpPost]
        
        public IActionResult Create([FromBody] Notification notification)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            _db.Notifications.Add(notification);
            _db.SaveChanges();
            return CreatedAtAction(nameof(GetAll), new { id = notification.Id }, notification);
        }

        [HttpPut("{id}")]
        
        public IActionResult Update(int id, [FromBody] Notification notification)
        {
            var n = _db.Notifications.Find(id);
            if (n == null) return NotFound();
            n.Title = notification.Title;
            n.Message = notification.Message;
            n.IsRead = notification.IsRead;
            _db.SaveChanges();
            return Ok(n);
        }

        [HttpDelete("{id}")]
        
        public IActionResult Delete(int id)
        {
            var n = _db.Notifications.Find(id);
            if (n == null) return NotFound();
            _db.Notifications.Remove(n);
            _db.SaveChanges();
            return NoContent();
        }
    }
}
