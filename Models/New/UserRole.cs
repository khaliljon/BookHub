using System;

namespace BookHub.Models.New
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("user_roles")]
    public class UserRole
    {
        [Key]
        [Column("user_id", Order = 0)]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }

        [Key]
        [Column("role_id", Order = 1)]
        public int RoleId { get; set; }

        [ForeignKey("RoleId")]
        public Role Role { get; set; }

        [Column("assigned_at")]
        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    }
}
