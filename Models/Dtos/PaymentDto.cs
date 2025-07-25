namespace BookHub.Models.Dtos
{
    public class PaymentDto
    {
        public int Id { get; set; }
        public int BookingId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; }
        public string PaymentStatus { get; set; }
        public DateTime? PaidAt { get; set; }
        public string UserName { get; set; } // ФИО пользователя
        public string ClubName { get; set; } // Название клуба
        public string UserAvatar { get; set; } // Заглушка для аватарки
    }
}
