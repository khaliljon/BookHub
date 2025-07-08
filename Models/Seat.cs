using System.ComponentModel.DataAnnotations.Schema;

namespace OynaApi.Models
{
    [Table("seats")]
    public class Seat
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("hall_id")]
        public int HallId { get; set; }

        [Column("seat_number")]
        public string SeatNumber { get; set; }

        [Column("description")]
        public string Description { get; set; }

        [Column("status")]
        public string Status { get; set; } = "работает";

        [Column("is_deleted")]
        public bool IsDeleted { get; set; }
    }
}
