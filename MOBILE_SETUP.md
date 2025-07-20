# Настройка для мобильной разработки

## 🔧 Конфигурация для разных сценариев

### Сценарий 1: Локальная разработка (каждый на своей машине)

**Что нужно коллеге:**
1. Склонировать репозиторий
2. Установить PostgreSQL
3. Запустить SQL скрипт setup_database.sql
4. Создать своего суперадмина в скрипте
5. Запустить проект: `dotnet run`

**appsettings.Development.json коллеги:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=oyna_db;Username=postgres;Password=his_password"
  },
  "Jwt": {
    "Key": "MySuperSecretKey123456789123456789",
    "Issuer": "OynaApi",
    "Audience": "OynaUsers", 
    "ExpiresInDays": "7"
  }
}
```

### Сценарий 2: Работа по локальной сети

**Если коллега в той же сети:**

**Ваши настройки (Program.cs):**
```csharp
// Добавьте в Program.cs для доступа извне
app.Urls.Add("https://0.0.0.0:7183");
```

**Или в launchSettings.json:**
```json
{
  "profiles": {
    "http": {
      "commandName": "Project",
      "dotnetRunMessages": true,
      "launchBrowser": true,
      "applicationUrl": "https://0.0.0.0:7183",
      "environmentName": "Development"
    }
  }
}
```

**Коллега обращается к:**
- API: `https://YOUR_IP:7183/api/auth/login`
- Swagger: `https://YOUR_IP:7183/swagger`

### Сценарий 3: Облачное развёртывание (Production)

**Для реального мобильного приложения:**
- Развернуть на Azure/AWS/DigitalOcean
- Настроить HTTPS сертификат
- Использовать облачную БД (Azure PostgreSQL/AWS RDS)

**Пример production URL:**
```
https://oynaapi.yourcompany.com/api/auth/login
```

## 📱 Для мобильного разработчика

### Как протестировать API:

**1. Через Postman/Insomnia:**
```http
POST https://192.168.1.100:7183/api/auth/register
Content-Type: application/json

{
  "fullName": "Мобильный Тестер",
  "phoneNumber": "+998901111111", 
  "email": "mobile@test.com",
  "password": "Test123!"
}
```

**2. Через curl:**
```bash
curl -X POST https://192.168.1.100:7183/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "mobile@test.com",
    "password": "Test123!"
  }'
```

**3. В мобильном приложении (React Native/Flutter):**
```javascript
// React Native пример
const response = await fetch('https://192.168.1.100:7183/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    emailOrPhone: 'mobile@test.com',
    password: 'Test123!'
  })
});

const data = await response.json();
const token = data.token;
```

## 🛠️ Рекомендуемая настройка

### Для начала разработки:
1. **Каждый работает на своем localhost** (проще отладка)
2. **Общий Git репозиторий** для синхронизации кода
3. **Одинаковые тестовые данные** в БД

### Для тестирования интеграции:
1. **Один поднимает API на 0.0.0.0:7183**
2. **Другой подключается по IP** для тестирования
3. **Используйте ngrok** для внешнего доступа (опционально)

### Для production:
1. **Облачное развёртывание**
2. **HTTPS обязательно**
3. **Отдельная production БД**
