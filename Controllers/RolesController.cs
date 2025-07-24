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
                .Select(r => new RoleDto
                {
                    Id = r.Id,
                    Name = r.Name,
                    Description = r.Description,
                    IsActive = r.IsActive
                })
                .ToListAsync();

            return Ok(roles);
        }

        [HttpPost]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<ActionResult<RoleDto>> CreateRole(CreateRoleDto createRoleDto)
        {
            var role = new Role
            {
                Name = createRoleDto.Name,
                Description = createRoleDto.Description,
                IsActive = createRoleDto.IsActive
            };

            _context.Roles.Add(role);
            await _context.SaveChangesAsync();

            var roleDto = new RoleDto
            {
                Id = role.Id,
                Name = role.Name,
                Description = role.Description,
                IsActive = role.IsActive
            };

            return CreatedAtAction(nameof(GetRole), new { id = role.Id }, roleDto);
        }

        [HttpGet("{id}")]
        [RoleAuthorization("Admin", "Manager")]
        public async Task<ActionResult<RoleDto>> GetRole(int id)
        {
            var role = await _context.Roles.FindAsync(id);

            if (role == null)
            {
                return NotFound();
            }

            var roleDto = new RoleDto
            {
                Id = role.Id,
                Name = role.Name,
                Description = role.Description,
                IsActive = role.IsActive
            };

            return Ok(roleDto);
        }

        [HttpPost("assign")]
        [RoleAuthorization("Admin")]
        public async Task<IActionResult> AssignRole(AssignRoleDto assignRoleDto)
        {
            var user = await _context.Users.FindAsync(assignRoleDto.UserId);
            var role = await _context.Roles.FindAsync(assignRoleDto.RoleId);

            if (user == null || role == null)
            {
                return NotFound();
            }

            var existingUserRole = await _context.UserRoles
                .FirstOrDefaultAsync(ur => ur.UserId == assignRoleDto.UserId && ur.RoleId == assignRoleDto.RoleId);

            if (existingUserRole != null)
            {
                return BadRequest("Пользователь уже имеет эту роль");
            }

            var userRole = new UserRole
            {
                UserId = assignRoleDto.UserId,
                RoleId = assignRoleDto.RoleId,
                AssignedAt = DateTime.UtcNow
            };

            _context.UserRoles.Add(userRole);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("revoke")]
        [RoleAuthorization("Admin")]
        public async Task<IActionResult> RevokeRole(AssignRoleDto assignRoleDto)
        {
            var userRole = await _context.UserRoles
                .FirstOrDefaultAsync(ur => ur.UserId == assignRoleDto.UserId && ur.RoleId == assignRoleDto.RoleId);

            if (userRole == null)
            {
                return NotFound();
            }

            _context.UserRoles.Remove(userRole);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
