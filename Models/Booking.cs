using System;
using System.Collections.Generic;
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

        [ForeignKey("UserId")]
        public User User { get; set; }

        [Column("seat_id")]
        public int SeatId { get; set; }

        [ForeignKey("SeatId")]
        public Seat Seat { get; set; }

        [Column("tariff_id")]
        public int? TariffId { get; set; }

        [ForeignKey("TariffId")]
        public Tariff Tariff { get; set; }

        [Column("date")]
        public DateTime Date { get; set; }

        [Column("start_time")]
        public TimeSpan TimeStart { get; set; }

        [Column("end_time")]
        public TimeSpan TimeEnd { get; set; }

        [Column("total_price")]
        public decimal TotalPrice { get; set; }

        [Column("status")]
        public string Status { get; set; } = "активно";

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        public ICollection<Payment> Payments { get; set; }
    }
}
