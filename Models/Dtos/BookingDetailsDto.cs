using System;
using System.Collections.Generic;

namespace BookHub.Models.Dtos
{
    public class BookingDetailsDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int SeatId { get; set; }
        public int? TariffId { get; set; }
        public DateTime Date { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public UserDto User { get; set; }
        public SeatDetailsDto Seat { get; set; }
        public TariffDto Tariff { get; set; }
        public List<PaymentDto> Payments { get; set; }
    }

    public class SeatDetailsDto : SeatDto
    {
        public HallDetailsDto Hall { get; set; }
    }

    public class HallDetailsDto : HallDto
    {
        public ClubDto Club { get; set; }
    }
} 