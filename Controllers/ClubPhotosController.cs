using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using BookHub.Data;
using BookHub.Models;
using BookHub.Models.Dtos;
using Microsoft.AspNetCore.Http;
using System.IO;
using System;

namespace BookHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ClubPhotosController : ControllerBase
    {
        private readonly BookHubDbContext _context;

        public ClubPhotosController(BookHubDbContext context)
        {
            _context = context;
        }

        // GET: api/ClubPhotos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClubPhotoDto>>> GetClubPhotos([FromQuery(Name = "club_id")] int? club_id)
        {
            var query = _context.ClubPhotos.AsQueryable();
            if (club_id.HasValue)
                query = query.Where(p => p.ClubId == club_id.Value);
            var photos = await query.ToListAsync();
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

        public class ClubPhotoUploadDto
        {
            public IFormFile File { get; set; }
        }

        // POST: api/ClubPhotos/upload
        [HttpPost("upload")]
        public async Task<IActionResult> UploadClubPhoto([FromForm] ClubPhotoUploadDto dto)
        {
            var file = dto.File;
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "clubs");
            Directory.CreateDirectory(uploadsFolder);

            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var url = $"/uploads/clubs/{fileName}";
            return Ok(new { url });
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

            // Удалить файл с диска, если он находится в /uploads/clubs/
            if (!string.IsNullOrEmpty(photo.PhotoUrl) && photo.PhotoUrl.StartsWith("/uploads/clubs/"))
            {
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", photo.PhotoUrl.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
                try
                {
                    System.IO.File.AppendAllText("delete_log.txt", $"Пытаюсь удалить файл: {filePath}\n");
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                        System.IO.File.AppendAllText("delete_log.txt", $"Файл удалён: {filePath}\n");
                    }
                    else
                    {
                        System.IO.File.AppendAllText("delete_log.txt", $"Файл не найден: {filePath}\n");
                    }
                }
                catch (Exception ex)
                {
                    System.IO.File.AppendAllText("delete_log.txt", $"Ошибка при удалении файла: {ex.Message}\n");
                }
            }

            return NoContent();
        }

        private bool ClubPhotoExists(int id)
        {
            return _context.ClubPhotos.Any(e => e.Id == id);
        }
    }
}
