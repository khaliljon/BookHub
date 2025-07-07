namespace OynaApi.Models
{
    public class Booking
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int SeatId { get; set; }
        public int? TariffId { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan TimeStart { get; set; }
        public TimeSpan TimeEnd { get; set; }
        public decimal TotalPrice { get; set; }
        public string Status { get; set; } = "активно";
        public DateTime CreatedAt { get; set; }
    }
}
