using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookHub.Models
{
    [Table("payments")]
    public class Payment
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("booking_id")]
        public int BookingId { get; set; }

        [ForeignKey("BookingId")]
        public Booking Booking { get; set; }

        [Column("amount")]
        public decimal Amount { get; set; }

        [Column("payment_method")]
        public string PaymentMethod { get; set; } = "Kaspi";

        [Column("payment_status")]
        public string PaymentStatus { get; set; } = "ожидает";

        [Column("paid_at")]
        public DateTime? PaidAt { get; set; }
    }
}
