using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BookHub.Models.New;
using BookHub.Data;
using System.Linq;

namespace BookHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly BookHubDbContext _db;
        public ReviewsController(BookHubDbContext db) { _db = db; }

        [HttpGet]
        [Authorize(Roles = "SystemAdmin,ClubManager,User")]
        public IActionResult GetAll() => Ok(_db.Reviews.ToList());

        [HttpPost]
        [Authorize(Roles = "User")]
        public IActionResult Create([FromBody] Review review)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            _db.Reviews.Add(review);
            _db.SaveChanges();
            return CreatedAtAction(nameof(GetAll), new { id = review.Id }, review);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "User")]
        public IActionResult Update(int id, [FromBody] Review review)
        {
            var r = _db.Reviews.Find(id);
            if (r == null) return NotFound();
            r.Rating = review.Rating;
            r.Comment = review.Comment;
            _db.SaveChanges();
            return Ok(r);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "SystemAdmin,ClubManager")]
        public IActionResult Delete(int id)
        {
            var r = _db.Reviews.Find(id);
            if (r == null) return NotFound();
            _db.Reviews.Remove(r);
            _db.SaveChanges();
            return NoContent();
        }
    }
}
