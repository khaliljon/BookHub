# OynaApi - Система Бронирования Игровых Клубов

## 🚀 Быстрый старт

### Базовый URL
```
https://localhost:7183/api
```

### Авторизация
```http
POST /api/auth/login
Content-Type: application/json

{
  "emailOrPhone": "khalych.kz@gmail.com",
  "password": "Burbik27092004"
}
```
**Ответ:** `{ "token": "jwt_token_here", "user": {...} }`

Добавить в заголовки: `Authorization: Bearer {token}`

---

## 👤 Эндпоинты авторизации

### Вход
```http
POST /api/auth/login
{
  "emailOrPhone": "string",  // Email или телефон
  "password": "string"
}
```

### Регистрация
```http
POST /api/auth/register
{
  "fullName": "string",
  "phoneNumber": "string",
  "email": "string",
  "password": "string"
}
```

---

## 🏢 Клубы

### Получить все клубы
```http
GET /api/clubs
```

### Получить клуб по ID
```http
GET /api/clubs/{id}
```

### Создать клуб (только админ)
```http
POST /api/clubs
{
  "name": "string",
  "city": "string",
  "address": "string",
  "description": "string",
  "phone": "string",
  "email": "string",
  "openingHours": "string"
}
```

---

## 🏛️ Залы

### Получить залы по клубу
```http
GET /api/halls?clubId={clubId}
```

### Получить зал по ID
```http
GET /api/halls/{id}
```

---

## 💺 Места

### Получить места по залу
```http
GET /api/seats?hallId={hallId}
```

### Получить место по ID
```http
GET /api/seats/{id}
```

---

## 📅 Бронирования

### Создать бронирование
```http
POST /api/bookings
{
  "seatId": 1,
  "tariffId": 1,
  "date": "2025-07-20",
  "startTime": "14:00:00",
  "endTime": "16:00:00"
}
```

### Получить мои бронирования
```http
GET /api/bookings/my
```

### Получить бронирование по ID
```http
GET /api/bookings/{id}
```

### Отменить бронирование
```http
DELETE /api/bookings/{id}
```

---

## 💳 Платежи

### Создать платеж
```http
POST /api/payments
{
  "bookingId": 1,
  "amount": 1000.00,
  "paymentMethod": "card"
}
```

### Получить мои платежи
```http
GET /api/payments/my
```

---

## 💰 Тарифы

### Получить тарифы по клубу
```http
GET /api/tariffs?clubId={clubId}
```

---

## 👤 Пользователи (эндпоинты админа)

### Получить всех пользователей
```http
GET /api/users
Authorization: Bearer {admin_token}
```

### Создать пользователя
```http
POST /api/users
Authorization: Bearer {admin_token}
{
  "fullName": "string",
  "phoneNumber": "string", 
  "email": "string",
  "password": "string",
  "balance": 0,
  "points": 0,
  "roles": ["User"]
}
```

### Обновить пользователя
```http
PUT /api/users/{id}
Authorization: Bearer {admin_token}
{
  "id": 1,
  "fullName": "string",
  "phoneNumber": "string",
  "email": "string",
  "balance": 1000,
  "points": 100,
  "isDeleted": false
}
```

### Удалить пользователя (мягкое удаление)
```http
DELETE /api/users/{id}
Authorization: Bearer {superadmin_token}
```

---

## 🔐 Роли и права доступа

### Роли пользователей
- **User** - Бронирование мест, просмотр собственных бронирований/платежей
- **Manager** - Управление бронированиями клуба, просмотр отчетов
- **Admin** - Управление клубами/залами/местами, управление пользователями
- **SuperAdmin** - Полный доступ, удаление пользователей

### Защищенные эндпоинты
- `🔓 Открытые` - Авторизация не требуется
- `🔒 Пользователь` - Требуется вход в систему
- `🔐 Админ` - Только Admin/SuperAdmin
- `⭐ СуперАдмин` - Только SuperAdmin

---

## 📱 Общие форматы ответов

### Успешный ответ
```json
{
  "id": 1,
  "field": "value",
  "createdAt": "2025-07-19T10:00:00Z"
}
```

### Ответ с ошибкой
```json
{
  "type": "https://httpstatuses.com/400",
  "title": "Bad Request", 
  "status": 400,
  "detail": "Описание ошибки"
}
```

### Ответ массивом
```json
[
  { "id": 1, "name": "Элемент 1" },
  { "id": 2, "name": "Элемент 2" }
]
```

---

## 🎯 Ключевые возможности

### Процесс бронирования
1. **Вход** → Получить токен
2. **Просмотр клубов** → `/api/clubs`
3. **Выбор зала** → `/api/halls?clubId={id}`
4. **Выбор места** → `/api/seats?hallId={id}`
5. **Создание бронирования** → `/api/bookings`
6. **Оплата** → `/api/payments`

### Возможности админа
- Управление пользователями (CRUD)
- Управление клубами/залами/местами
- Контроль бронирований
- Отслеживание платежей

---

## 🛠️ Тестовые учетные данные

### СуперАдмин
```
Email: khalych.kz@gmail.com
Пароль: Burbik27092004
```

### Тестовый пользователь
```
Email: test@oyna.kz  
Пароль: 123456
```

---

## 📊 Коды состояния

- `200` - Успешно
- `201` - Создано
- `204` - Нет содержимого (успешное удаление/обновление)
- `400` - Неверный запрос
- `401` - Не авторизован
- `403` - Запрещено
- `404` - Не найдено
- `500` - Внутренняя ошибка сервера

---

## 🔄 Типы данных

### Формат DateTime
```json
"2025-07-19T14:30:00Z"
```

### Формат времени
```json
"14:30:00"
```

### Формат даты
```json
"2025-07-19"
```

### Формат суммы
```json
1000.50
```

---

## 🚨 Важные примечания

- Все временные метки в UTC
- Номера телефонов должны включать код страны
- Пароли минимум 6 символов
- JWT токены истекают через 24 часа
- Мягкое удаление для пользователей (IsDeleted = true)
- Мягкое удаление для клубов/залов/мест
- Все суммы в тенге (KZT)
