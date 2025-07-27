using System;

namespace BookHub.Models.New
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("permissions")]
    public class Permission
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("role_id")]
        public int RoleId { get; set; }

        [ForeignKey("RoleId")]
        public Role Role { get; set; }

        [Required]
        [Column("section")]
        public string Section { get; set; } = string.Empty;

        [Required]
        [Column("action")]
        public string Action { get; set; } = string.Empty;

        [Column("allowed")]
        public bool Allowed { get; set; } = false;
    }
}
