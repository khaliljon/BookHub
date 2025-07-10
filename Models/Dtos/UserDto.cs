namespace OynaApi.Models.Dtos
{
    public class UserDto
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public DateTime RegistrationDate { get; set; }
        public decimal Balance { get; set; }
        public int Points { get; set; }
        public bool IsDeleted { get; set; }
    }
}
