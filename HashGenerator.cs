using BCrypt.Net;

public class HashGenerator
{
    public static void Main(string[] args)
    {
        string password = "admin123";
        string hash = BCrypt.Net.BCrypt.HashPassword(password, 12);
        
        Console.WriteLine($"Пароль: {password}");
        Console.WriteLine($"BCrypt хеш: {hash}");
        
        // Проверяем, что хеш работает
        bool isValid = BCrypt.Net.BCrypt.Verify(password, hash);
        Console.WriteLine($"Проверка хеша: {isValid}");
        
        Console.WriteLine("\n=== ДАННЫЕ ДЛЯ SQL ===");
        Console.WriteLine($"Телефон: +77770001122");
        Console.WriteLine($"Email: superadmin@oyna.kz");
        Console.WriteLine($"Пароль: {password}");
        Console.WriteLine($"Хеш: {hash}");
    }
}
