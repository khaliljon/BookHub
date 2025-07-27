using System;
using System.Text.Json.Nodes;

namespace BookHub.Models.New
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("seats")]
    public class Seat
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("room_id")]
        public int RoomId { get; set; }

        [ForeignKey("RoomId")]
        public Room? Room { get; set; }

        // Навигация: бронирования места
        public ICollection<Booking>? Bookings { get; set; }

        [Column("label")]
        public string? Label { get; set; }

        [Column("seat_type")]
        public string? SeatType { get; set; }

        [Column("is_active")]
        public bool IsActive { get; set; } = true;

        [Column("metadata_json")]
        public string? MetadataJson { get; set; }
    }
}
