using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OynaApi.Data;
using OynaApi.Models;
using OynaApi.Models.Dtos;

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
        public async Task<ActionResult<IEnumerable<ClubPhotoDto>>> GetClubPhotos()
        {
            var photos = await _context.ClubPhotos.ToListAsync();

            var dtos = photos.Select(photo => new ClubPhotoDto
            {
                Id = photo.Id,
                ClubId = photo.ClubId,
                PhotoUrl = photo.PhotoUrl,
                Description = photo.Description,
                UploadedAt = photo.UploadedAt
            }).ToList();

            return dtos;
        }

        // GET: api/ClubPhotos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ClubPhotoDto>> GetClubPhoto(int id)
        {
            var photo = await _context.ClubPhotos.FindAsync(id);

            if (photo == null)
                return NotFound();

            var dto = new ClubPhotoDto
            {
                Id = photo.Id,
                ClubId = photo.ClubId,
                PhotoUrl = photo.PhotoUrl,
                Description = photo.Description,
                UploadedAt = photo.UploadedAt
            };

            return dto;
        }

        // PUT: api/ClubPhotos/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutClubPhoto(int id, ClubPhotoDto dto)
        {
            if (id != dto.Id)
                return BadRequest("ID в URL не совпадает с ID объекта.");

            var photo = await _context.ClubPhotos.FindAsync(id);
            if (photo == null)
                return NotFound();

            photo.ClubId = dto.ClubId;
            photo.PhotoUrl = dto.PhotoUrl;
            photo.Description = dto.Description;
            photo.UploadedAt = dto.UploadedAt;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClubPhotoExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // POST: api/ClubPhotos
        [HttpPost]
        public async Task<ActionResult<ClubPhotoDto>> PostClubPhoto(ClubPhotoDto dto)
        {
            var photo = new ClubPhoto
            {
                ClubId = dto.ClubId,
                PhotoUrl = dto.PhotoUrl,
                Description = dto.Description,
                UploadedAt = dto.UploadedAt
            };

            _context.ClubPhotos.Add(photo);
            await _context.SaveChangesAsync();

            dto.Id = photo.Id;

            return CreatedAtAction(nameof(GetClubPhoto), new { id = photo.Id }, dto);
        }

        // DELETE: api/ClubPhotos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClubPhoto(int id)
        {
            var photo = await _context.ClubPhotos.FindAsync(id);
            if (photo == null)
                return NotFound();

            _context.ClubPhotos.Remove(photo);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ClubPhotoExists(int id)
        {
            return _context.ClubPhotos.Any(e => e.Id == id);
        }
    }
}
