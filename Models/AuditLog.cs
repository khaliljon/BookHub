using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace OynaApi.Models
{
    [Table("audit_logs")]
    public class AuditLog
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("user_id")]
        public int? UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }

        [Column("action")]
        public string Action { get; set; }

        [Column("table_name")]
        public string TableName { get; set; }

        [Column("record_id")]
        public int RecordId { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
    }
}
