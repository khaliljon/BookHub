using System;
using System.Text.Json.Nodes;

namespace BookHub.Models.New
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("rooms")]
    public class Room
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("venue_id")]
        public int VenueId { get; set; }

        [ForeignKey("VenueId")]
        public Venue? Venue { get; set; }

        // Навигация: места комнаты
        public ICollection<Seat> Seats { get; set; } = new List<Seat>();

        [Column("name")]
        public string? Name { get; set; }

        [Column("room_type")]
        public string? RoomType { get; set; }

        [Column("metadata")]
        public string? MetadataJson { get; set; }
    }
}
