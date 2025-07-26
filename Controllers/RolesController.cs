using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookHub.Attributes;
using BookHub.Data;
using BookHub.Models;
using BookHub.Models.Dtos;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace BookHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public class RolesController : ControllerBase
    {
        private readonly BookHubDbContext _context;

        public RolesController(BookHubDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<RoleDto>>> GetRoles()
        {
            var roles = await _context.Roles
                .Where(r => r.IsActive)
                .Include(r => r.UserRoles)
                .ToListAsync();

            var result = roles.Select(r => new RoleDto
            {
                Id = r.Id,
                Name = r.Name,
                Description = r.Description,
                IsActive = r.IsActive,
                Permissions = GetPermissionsForRole(r),
                UserCount = r.UserRoles?.Count ?? 0,
                CreatedAt = r.CreatedAt > DateTime.MinValue ? r.CreatedAt.ToUniversalTime().ToString("o") : null
            }).ToList();

            return Ok(result);
        }

        private Dictionary<string, Dictionary<string, bool>> GetPermissionsForRole(Role role)
        {
            // Сначала проверяем сохраненные права в БД
            if (!string.IsNullOrEmpty(role.PermissionMatrixJson))
            {
                try
                {
                    var savedPermissions = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, Dictionary<string, bool>>>(role.PermissionMatrixJson);
                    if (savedPermissions != null)
                        return savedPermissions;
                }
                catch
                {
                    // Если десериализация не удалась, используем дефолтные права
                }
            }

            // Если сохраненных прав нет, используем дефолтные
            var allActions = new Dictionary<string, bool> { { "create", true }, { "read", true }, { "update", true }, { "delete", true } };
            var adminActions = new Dictionary<string, bool> { { "create", true }, { "read", true }, { "update", true }, { "delete", false } };
            var managerActions = new Dictionary<string, bool> { { "create", true }, { "read", true }, { "update", true }, { "delete", false } };
            var userActions = new Dictionary<string, bool> { { "create", false }, { "read", true }, { "update", true }, { "delete", false } };

            var keys = new[] { "users", "clubs", "bookings", "payments", "roles", "notifications", "reports", "settings" };
            var matrix = new Dictionary<string, Dictionary<string, bool>>();

            foreach (var key in keys)
            {
                matrix[key] = role.Name switch
                {
                    "SuperAdmin" => new Dictionary<string, bool>(allActions),
                    "Admin" => new Dictionary<string, bool>(adminActions),
                    "Manager" => new Dictionary<string, bool>(managerActions),
                    "User" => new Dictionary<string, bool>(userActions),
                    _ => new Dictionary<string, bool>()
                };
            }

            return matrix;
        }

        [HttpPut("{id}/permissions")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> UpdatePermissions(int id, [FromBody] Dictionary<string, Dictionary<string, bool>> updatedPermissions)
        {
            var role = await _context.Roles.FindAsync(id);
            if (role == null)
                return NotFound();

            // Для простоты — сохраняем как сериализованную строку
            role.PermissionMatrixJson = System.Text.Json.JsonSerializer.Serialize(updatedPermissions);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPost]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<ActionResult<RoleDto>> CreateRole(CreateRoleDto createRoleDto)
        {
            var role = new Role
            {
                Name = createRoleDto.Name,
                Description = createRoleDto.Description,
                IsActive = createRoleDto.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            _context.Roles.Add(role);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRole), new { id = role.Id }, new RoleDto
            {
                Id = role.Id,
                Name = role.Name,
                Description = role.Description,
                IsActive = role.IsActive
            });
        }

        [HttpGet("{id}")]
        [RoleAuthorization("Admin", "Manager")]
        public async Task<ActionResult<RoleDto>> GetRole(int id)
        {
            var role = await _context.Roles.FindAsync(id);

            if (role == null)
                return NotFound();

            return Ok(new RoleDto
            {
                Id = role.Id,
                Name = role.Name,
                Description = role.Description,
                IsActive = role.IsActive
            });
        }

        [HttpPost("assign")]
        [RoleAuthorization("Admin")]
        public async Task<IActionResult> AssignRole(AssignRoleDto dto)
        {
            var user = await _context.Users.FindAsync(dto.UserId);
            var role = await _context.Roles.FindAsync(dto.RoleId);

            if (user == null || role == null)
                return NotFound();

            var exists = await _context.UserRoles.AnyAsync(ur => ur.UserId == dto.UserId && ur.RoleId == dto.RoleId);
            if (exists)
                return BadRequest("Пользователь уже имеет эту роль");

            _context.UserRoles.Add(new UserRole
            {
                UserId = dto.UserId,
                RoleId = dto.RoleId,
                AssignedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("revoke")]
        [RoleAuthorization("Admin")]
        public async Task<IActionResult> RevokeRole(AssignRoleDto dto)
        {
            var userRole = await _context.UserRoles
                .FirstOrDefaultAsync(ur => ur.UserId == dto.UserId && ur.RoleId == dto.RoleId);

            if (userRole == null)
                return NotFound();

            _context.UserRoles.Remove(userRole);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
