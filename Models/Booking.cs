using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace OynaApi.Models
{
    [Table("bookings")]
    public class Booking
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("user_id")]
        public int UserId { get; set; }

        [Column("seat_id")]
        public int SeatId { get; set; }

        [Column("tariff_id")]
        public int? TariffId { get; set; }

        [Column("date")]
        public DateTime Date { get; set; }

        [Column("time_start")]
        public TimeSpan TimeStart { get; set; }

        [Column("time_end")]
        public TimeSpan TimeEnd { get; set; }

        [Column("total_price")]
        public decimal TotalPrice { get; set; }

        [Column("status")]
        public string Status { get; set; } = "активно";

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
    }
}
