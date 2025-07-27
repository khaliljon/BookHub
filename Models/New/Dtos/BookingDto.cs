namespace BookHub.Models.New.Dtos
{
    public class BookingDto
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public int? SeatId { get; set; }
        public string? StartTime { get; set; }
        public string? EndTime { get; set; }
        public decimal TotalPrice { get; set; }
        public string? Status { get; set; }
    }
}
