﻿namespace OynaApi.Models
{
    public class Payment
    {
        public int Id { get; set; }
        public int BookingId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } = "Kaspi";
        public string PaymentStatus { get; set; } = "ожидает";
        public DateTime? PaidAt { get; set; }
    }
}
