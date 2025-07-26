using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using BookHub.Data;
using BookHub.Models;
using BookHub.Models.Dtos;
using BookHub.Helpers;

namespace BookHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class NotificationsController : ControllerBase
    {
        private readonly BookHubDbContext _context;

        public NotificationsController(BookHubDbContext context)
        {
            _context = context;
        }

        // GET: api/Notifications
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NotificationDto>>> GetNotifications()
        {
            var notifications = await _context.Notifications.ToListAsync();
            // User видит только свои уведомления
            if (User.IsInRole("User"))
            {
                int currentUserId = AuthorizationHelper.GetCurrentUserId(User);
                notifications = notifications.Where(n => n.UserId == currentUserId).ToList();
            }
            var dtos = notifications.Select(n => new NotificationDto
            {
                Id = n.Id,
                UserId = n.UserId,
                Title = n.Title,
                Message = n.Message,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt
            }).ToList();
            return dtos;
        }

        // GET: api/Notifications/5
        [HttpGet("{id}")]
        public async Task<ActionResult<NotificationDto>> GetNotification(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null)
                return NotFound();
            // Проверка разрешения на просмотр уведомления
            bool canView = AuthorizationHelper.HasPermission(User, "Уведомления", "Просмотр", (uid) =>
                _context.UserRoles.Where(ur => ur.UserId == uid).Select(ur => ur.Role).FirstOrDefault());
            // User может просматривать только свои уведомления
            if (User.IsInRole("User") && notification.UserId != AuthorizationHelper.GetCurrentUserId(User))
                canView = false;
            if (!canView)
                return AuthorizationHelper.CreateForbidResult("Недостаточно прав для просмотра уведомления");
            var dto = new NotificationDto
            {
                Id = notification.Id,
                UserId = notification.UserId,
                Title = notification.Title,
                Message = notification.Message,
                IsRead = notification.IsRead,
                CreatedAt = notification.CreatedAt
            };
            return dto;
        }

        // PUT: api/Notifications/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNotification(int id, NotificationDto dto)
        {
            if (id != dto.Id)
                return BadRequest("ID в URL не совпадает с ID объекта.");
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null)
                return NotFound();
            // Проверка разрешения на редактирование уведомления
            bool canEdit = AuthorizationHelper.HasPermission(User, "Уведомления", "Изменение", (uid) =>
                _context.UserRoles.Where(ur => ur.UserId == uid).Select(ur => ur.Role).FirstOrDefault());
            // User может редактировать только свои уведомления
            if (User.IsInRole("User") && notification.UserId != AuthorizationHelper.GetCurrentUserId(User))
                canEdit = false;
            if (!canEdit)
                return AuthorizationHelper.CreateForbidResult("Недостаточно прав для редактирования уведомления");
            notification.UserId = dto.UserId;
            notification.Title = dto.Title;
            notification.Message = dto.Message;
            notification.IsRead = dto.IsRead;
            notification.CreatedAt = dto.CreatedAt;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NotificationExists(id))
                    return NotFound();
                else
                    throw;
            }
            return NoContent();
        }

        // POST: api/Notifications
        [HttpPost]
        public async Task<ActionResult<NotificationDto>> PostNotification(NotificationDto dto)
        {
            // Проверка разрешения на создание уведомления
            bool canCreate = AuthorizationHelper.HasPermission(User, "Уведомления", "Создание", (uid) =>
                _context.UserRoles.Where(ur => ur.UserId == uid).Select(ur => ur.Role).FirstOrDefault());
            // User может создавать только свои уведомления
            if (User.IsInRole("User") && dto.UserId != AuthorizationHelper.GetCurrentUserId(User))
                canCreate = false;
            if (!canCreate)
                return AuthorizationHelper.CreateForbidResult("Недостаточно прав для создания уведомления");
            var notification = new Notification
            {
                UserId = dto.UserId,
                Title = dto.Title,
                Message = dto.Message,
                IsRead = dto.IsRead,
                CreatedAt = dto.CreatedAt
            };
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
            dto.Id = notification.Id;
            return CreatedAtAction(nameof(GetNotification), new { id = notification.Id }, dto);
        }

        // DELETE: api/Notifications/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotification(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null)
                return NotFound();
            // Проверка разрешения на удаление уведомления
            bool canDelete = AuthorizationHelper.HasPermission(User, "Уведомления", "Удаление", (uid) =>
                _context.UserRoles.Where(ur => ur.UserId == uid).Select(ur => ur.Role).FirstOrDefault());
            // User может удалять только свои уведомления
            if (User.IsInRole("User") && notification.UserId != AuthorizationHelper.GetCurrentUserId(User))
                canDelete = false;
            if (!canDelete)
                return AuthorizationHelper.CreateForbidResult("Недостаточно прав для удаления уведомления");
            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool NotificationExists(int id)
        {
            return _context.Notifications.Any(e => e.Id == id);
        }
    }
}
