# Инструкция по настройке первого суперадмина

## Зачем это нужно?

В системе OynaApi первый суперадмин должен быть создан вручную через SQL скрипт. Это сделано из соображений безопасности - никто не может стать суперадмином через обычную регистрацию в приложении.

## Пошаговая инструкция

### 1. Откройте SQL скрипт

Найдите файл `Scripts/setup_database.sql` в корне проекта.

### 2. Найдите секцию создания суперадмина

Ищите строки примерно с 866 по 873:

```sql
-- Создание суперадминистратора системы
-- ВАЖНО: Измените данные ниже для вашего реального суперадмина!
INSERT INTO users (full_name, phone_number, email, password_hash, created_at, updated_at, is_deleted) 
VALUES (
    'Системный Администратор',
    '+77777777777',
    'admin@oynaapi.com',
    '$2a$11$example_hash_change_this_in_production',  -- ОБЯЗАТЕЛЬНО ИЗМЕНИТЕ!
    NOW(),
    NOW(),
    false
) ON CONFLICT (phone_number) DO NOTHING;
```

### 3. Измените данные

**Обязательно измените:**
- `'Системный Администратор'` → ваше реальное имя
- `'+77777777777'` → ваш реальный номер телефона
- `'admin@oynaapi.com'` → ваш реальный email
- `'$2a$11$example_hash_change_this_in_production'` → хеш вашего пароля

### 4. Сгенерируйте хеш пароля

**Вариант 1: Онлайн генератор**
- Откройте https://bcrypt-generator.com/
- Введите ваш пароль
- Выберите rounds: 11
- Скопируйте полученный хеш

**Вариант 2: .NET код**
```csharp
using BCrypt.Net;

var password = "ВашСуперСекретныйПароль123!";
var hash = BCrypt.HashPassword(password, 11);
Console.WriteLine(hash);
```

**Вариант 3: PowerShell (Windows)**
```powershell
# Установить пакет, если не установлен
Install-Package BCrypt.Net-Next

# В C# проекте или LINQPad
var hash = BCrypt.Net.BCrypt.HashPassword("ВашПароль", 11);
```

### 5. Пример правильного заполнения

```sql
INSERT INTO users (full_name, phone_number, email, password_hash, created_at, updated_at, is_deleted) 
VALUES (
    'Иван Петров',
    '+998901234567',
    'ivan.petrov@mycompany.com',
    '$2a$11$XYZ123RealHashFromBcryptGenerator...',
    NOW(),
    NOW(),
    false
) ON CONFLICT (phone_number) DO NOTHING;
```

### 6. Запустите скрипт

```bash
# Подключитесь к PostgreSQL и выполните скрипт
psql -U postgres -d oyna_db -f Scripts/setup_database.sql
```

### 7. Проверьте результат

После успешного выполнения вы увидите:
```
NOTICE: SuperAdmin роль назначена пользователю ID: 1
```

### 8. Первый вход в систему

Теперь можете авторизоваться через API:

```http
POST /api/auth/login
Content-Type: application/json

{
  "emailOrPhone": "ivan.petrov@mycompany.com",
  "password": "ВашСуперСекретныйПароль123!"
}
```

Получите JWT токен и используйте его для управления ролями других пользователей.

## ⚠️ ВАЖНЫЕ ЗАМЕЧАНИЯ

1. **Никогда не оставляйте тестовые данные в production!**
2. **Используйте сложный пароль для суперадмина**
3. **Храните данные суперадмина в безопасном месте**
4. **Рекомендуется сменить пароль после первого входа**
5. **Email и телефон должны быть уникальными в системе**

## Что происходит в скрипте?

1. **Создается пользователь** с указанными данными
2. **Автоматически назначается роль SuperAdmin** через секцию DO $$
3. **Проверяется конфликт по телефону** - если пользователь уже существует, он не пересоздается
4. **Выводится уведомление** о успешном назначении роли

## Troubleshooting

**Ошибка: "duplicate key value violates unique constraint"**
- Пользователь с таким email или телефоном уже существует
- Измените email и телефон на уникальные

**Ошибка: "invalid password hash"**
- Хеш пароля некорректный
- Убедитесь, что используете bcrypt hash с правильным количеством rounds (11)

**Роль не назначилась:**
- Проверьте, что роль "SuperAdmin" существует в таблице roles
- Проверьте, что пользователь создался успешно
