namespace OynaApi.Models
{
    public class AuthModel
    {
        public int Id { get; set; }  // Добавляем Id как первичный ключ
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
