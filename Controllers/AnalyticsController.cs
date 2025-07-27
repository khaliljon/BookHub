using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BookHub.Models.New;
using BookHub.Data;
using System.Linq;

namespace BookHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyticsController : ControllerBase
    {
        private readonly BookHubDbContext _db;
        public AnalyticsController(BookHubDbContext db) { _db = db; }

        [HttpGet]
        public IActionResult GetAll() => Ok(_db.Analytics.ToList());
    }
}
