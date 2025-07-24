using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookHub.Models
{
    [Table("user_roles")]
    public class UserRole
    {
        [Column("user_id")]
        public int UserId { get; set; }
        
        [Column("role_id")]
        public int RoleId { get; set; }

        [Column("assigned_at")]
        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

        // [Column("assigned_by")]
        // public int? AssignedBy { get; set; }

        // Navigation properties
        public User User { get; set; } = null!;
        public Role Role { get; set; } = null!;
    }
}
