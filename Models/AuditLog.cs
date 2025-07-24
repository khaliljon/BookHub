using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookHub.Models
{
    [Table("audit_logs")]
    public class AuditLog
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("user_id")]
        public int? UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

        [Column("action")]
        public string Action { get; set; } = string.Empty;

        [Column("table_name")]
        public string TableName { get; set; } = string.Empty;

        [Column("record_id")]
        public int? RecordId { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
    }
}
