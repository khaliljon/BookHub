using System;
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
    [Authorize(Roles = "Admin")]
    public class AuditLogsController : ControllerBase
    {
        private readonly BookHubDbContext _context;

        public AuditLogsController(BookHubDbContext context)
        {
            _context = context;
        }

        // GET: api/AuditLogs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AuditLogDto>>> GetAuditLogs()
        {
            // Проверка разрешения на просмотр аудит-логов
            bool canRead = AuthorizationHelper.HasPermission(User, "АудитЛоги", "Чтение", (uid) =>
                _context.UserRoles.Where(ur => ur.UserId == uid).Select(ur => ur.Role).FirstOrDefault());
            if (!canRead)
                return AuthorizationHelper.CreateForbidResult("Недостаточно прав для просмотра аудит-логов");
            var logs = await _context.AuditLogs.ToListAsync();
            var dtos = logs.Select(log => new AuditLogDto
            {
                Id = log.Id,
                UserId = log.UserId,
                Action = log.Action,
                TableName = log.TableName,
                RecordId = log.RecordId,
                CreatedAt = log.CreatedAt
            }).ToList();
            return dtos;
        }

        // GET: api/AuditLogs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AuditLogDto>> GetAuditLog(int id)
        {
            // Проверка разрешения на просмотр аудит-лога
            bool canRead = AuthorizationHelper.HasPermission(User, "АудитЛоги", "Чтение", (uid) =>
                _context.UserRoles.Where(ur => ur.UserId == uid).Select(ur => ur.Role).FirstOrDefault());
            if (!canRead)
                return AuthorizationHelper.CreateForbidResult("Недостаточно прав для просмотра аудит-лога");
            var log = await _context.AuditLogs.FindAsync(id);
            if (log == null)
                return NotFound();
            var dto = new AuditLogDto
            {
                Id = log.Id,
                UserId = log.UserId,
                Action = log.Action,
                TableName = log.TableName,
                RecordId = log.RecordId,
                CreatedAt = log.CreatedAt
            };
            return dto;
        }

        // PUT: api/AuditLogs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAuditLog(int id, AuditLogDto dto)
        {
            if (id != dto.Id)
                return BadRequest("ID в URL не совпадает с ID объекта.");
            var log = await _context.AuditLogs.FindAsync(id);
            if (log == null)
                return NotFound();
            // Проверка разрешения на редактирование аудит-лога
            bool canEdit = AuthorizationHelper.HasPermission(User, "АудитЛоги", "Изменение", (uid) =>
                _context.UserRoles.Where(ur => ur.UserId == uid).Select(ur => ur.Role).FirstOrDefault());
            if (!canEdit)
                return AuthorizationHelper.CreateForbidResult("Недостаточно прав для редактирования аудит-лога");
            log.UserId = dto.UserId;
            log.Action = dto.Action;
            log.TableName = dto.TableName;
            log.RecordId = dto.RecordId;
            log.CreatedAt = dto.CreatedAt;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AuditLogExists(id))
                    return NotFound();
                else
                    throw;
            }
            return NoContent();
        }

        // POST: api/AuditLogs
        [HttpPost]
        public async Task<ActionResult<AuditLogDto>> PostAuditLog(AuditLogDto dto)
        {
            // Проверка разрешения на создание аудит-лога
            bool canCreate = AuthorizationHelper.HasPermission(User, "АудитЛоги", "Создание", (uid) =>
                _context.UserRoles.Where(ur => ur.UserId == uid).Select(ur => ur.Role).FirstOrDefault());
            if (!canCreate)
                return AuthorizationHelper.CreateForbidResult("Недостаточно прав для создания аудит-лога");
            var log = new AuditLog
            {
                UserId = dto.UserId,
                Action = dto.Action,
                TableName = dto.TableName,
                RecordId = dto.RecordId,
                CreatedAt = dto.CreatedAt
            };
            _context.AuditLogs.Add(log);
            await _context.SaveChangesAsync();
            dto.Id = log.Id;
            return CreatedAtAction(nameof(GetAuditLog), new { id = log.Id }, dto);
        }

        // DELETE: api/AuditLogs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAuditLog(int id)
        {
            var log = await _context.AuditLogs.FindAsync(id);
            if (log == null)
                return NotFound();
            // Проверка разрешения на удаление аудит-лога
            bool canDelete = AuthorizationHelper.HasPermission(User, "АудитЛоги", "Удаление", (uid) =>
                _context.UserRoles.Where(ur => ur.UserId == uid).Select(ur => ur.Role).FirstOrDefault());
            if (!canDelete)
                return AuthorizationHelper.CreateForbidResult("Недостаточно прав для удаления аудит-лога");
            _context.AuditLogs.Remove(log);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool AuditLogExists(int id)
        {
            return _context.AuditLogs.Any(e => e.Id == id);
        }
    }
}
