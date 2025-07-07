namespace OynaApi.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string HashedPassword { get; set; }
        public DateTime RegistrationDate { get; set; }
        public decimal Balance { get; set; }
        public int Points { get; set; }
        public bool IsDeleted { get; set; }
    }
}
