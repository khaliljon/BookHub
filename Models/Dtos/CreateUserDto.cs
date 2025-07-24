using System.Collections.Generic;

namespace BookHub.Models.Dtos
{
    public class CreateUserDto
    {
        public string FullName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty; // Новое поле для пароля
        public decimal Balance { get; set; } = 0;
        public int Points { get; set; } = 0;
        public List<string> Roles { get; set; } = new List<string>(); // Роли для назначения
    }
}
