using System;
using System.Collections.Generic;

namespace BookHub.Models.Dtos
{
    public class RoleDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsActive { get; set; }

        // ✅ Добавлены поля:
        public int UserCount { get; set; }
        public string? CreatedAt { get; set; }

        public Dictionary<string, Dictionary<string, bool>> Permissions { get; set; } = new();
    }

    public class CreateRoleDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class AssignRoleDto
    {
        public int UserId { get; set; }
        public int RoleId { get; set; }
    }
}
