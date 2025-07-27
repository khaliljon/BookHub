using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BookHub.Models.New;
using BookHub.Data;
using System.Linq;

namespace BookHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RolesController : ControllerBase
    {
        private readonly BookHubDbContext _db;
        public RolesController(BookHubDbContext db) { _db = db; }

        // SystemAdmin: получить все роли
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetAll() => Ok(_db.Roles.ToList());

        // SystemAdmin: создать роль
        [HttpPost]
        [AllowAnonymous]
        public IActionResult Create([FromBody] Role role)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            _db.Roles.Add(role);
            _db.SaveChanges();
            return CreatedAtAction(nameof(GetAll), new { id = role.Id }, role);
        }

        // SystemAdmin: удалить роль
        [HttpDelete("{id}")]
        [AllowAnonymous]
        public IActionResult Delete(int id)
        {
            var role = _db.Roles.Find(id);
            if (role == null) return NotFound();
            _db.Roles.Remove(role);
            _db.SaveChanges();
            return NoContent();
        }
    }
}
