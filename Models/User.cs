using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace OynaApi.Models
{
    [Table("users")]
    public class User
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("full_name")]
        public string FullName { get; set; } = string.Empty;

        [Column("phone_number")]
        public string PhoneNumber { get; set; } = string.Empty;

        [Column("email")]
        public string Email { get; set; } = string.Empty;

        [Column("password_hash")]
        public string PasswordHash { get; set; } = string.Empty;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }

        [Column("balance")]
        public decimal Balance { get; set; }

        [Column("points")]
        public int Points { get; set; }

        [Column("is_deleted")]
        public bool IsDeleted { get; set; }

        [Column("managed_club_id")]
        public int? ManagedClubId { get; set; } // Для менеджеров - ID клуба который они управляют

        // Navigation properties
        public Club? ManagedClub { get; set; } // Клуб, которым управляет менеджер
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
        public ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();
        public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
        public ICollection<Role> Roles { get; set; } = new List<Role>();
    }
}
