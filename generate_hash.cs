using BCrypt.Net;

namespace OynaApi
{
    public class HashGenerator
    {
        public static void Main(string[] args)
        {
            try
            {
                // Ввод пароля из консоли для безопасности
                Console.Write("Введите пароль для хеширования: ");
                string password = Console.ReadLine() ?? "Burbik27092004";
                
                string hash = BCrypt.Net.BCrypt.HashPassword(password, 12); // workFactor 12 для повышенной безопасности

                Console.WriteLine($"BCrypt хеш: {hash}");

                // Проверка что хеш работает
                bool isValid = BCrypt.Net.BCrypt.Verify(password, hash);
                Console.WriteLine($"Проверка хеша: {(isValid ? "успешна" : "провалена")}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Ошибка: {ex.Message}");
            }
        }
    }
}
