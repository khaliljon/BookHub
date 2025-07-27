namespace BookHub.Models.New.Dtos
{
    public class PaymentDto
    {
        public int Id { get; set; }
        public int? BookingId { get; set; }
        public decimal Amount { get; set; }
        public string? Method { get; set; }
        public string? Status { get; set; }
        public string? PaidAt { get; set; }
    }
}
