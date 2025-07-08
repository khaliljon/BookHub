using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OynaApi.Data;
using OynaApi.Models;

namespace OynaApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClubPhotosController : ControllerBase
    {
        private readonly OynaDbContext _context;

        public ClubPhotosController(OynaDbContext context)
        {
            _context = context;
        }

        // GET: api/ClubPhotos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClubPhoto>>> GetClubPhotos()
        {
            return await _context.ClubPhotos.ToListAsync();
        }

        // GET: api/ClubPhotos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ClubPhoto>> GetClubPhoto(int id)
        {
            var clubPhoto = await _context.ClubPhotos.FindAsync(id);

            if (clubPhoto == null)
            {
                return NotFound();
            }

            return clubPhoto;
        }

        // PUT: api/ClubPhotos/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutClubPhoto(int id, ClubPhoto clubPhoto)
        {
            if (id != clubPhoto.Id)
            {
                return BadRequest();
            }

            _context.Entry(clubPhoto).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClubPhotoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/ClubPhotos
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ClubPhoto>> PostClubPhoto(ClubPhoto clubPhoto)
        {
            _context.ClubPhotos.Add(clubPhoto);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetClubPhoto", new { id = clubPhoto.Id }, clubPhoto);
        }

        // DELETE: api/ClubPhotos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClubPhoto(int id)
        {
            var clubPhoto = await _context.ClubPhotos.FindAsync(id);
            if (clubPhoto == null)
            {
                return NotFound();
            }

            _context.ClubPhotos.Remove(clubPhoto);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ClubPhotoExists(int id)
        {
            return _context.ClubPhotos.Any(e => e.Id == id);
        }
    }
}
