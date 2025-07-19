# OynaApi - Gaming Club Booking System

## 🚀 Quick Start

### Base URL
```
https://localhost:7183/api
```

### Authentication
```http
POST /api/auth/login
Content-Type: application/json

{
  "emailOrPhone": "khalych.kz@gmail.com",
  "password": "Burbik27092004"
}
```
**Response:** `{ "token": "jwt_token_here", "user": {...} }`

Add to headers: `Authorization: Bearer {token}`

---

## 👤 Authentication Endpoints

### Login
```http
POST /api/auth/login
{
  "emailOrPhone": "string",  // Email or phone
  "password": "string"
}
```

### Register
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

## 🏢 Clubs

### Get All Clubs
```http
GET /api/clubs
```

### Get Club by ID
```http
GET /api/clubs/{id}
```

### Create Club (Admin only)
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

## 🏛️ Halls

### Get Halls by Club
```http
GET /api/halls?clubId={clubId}
```

### Get Hall by ID
```http
GET /api/halls/{id}
```

---

## 💺 Seats

### Get Seats by Hall
```http
GET /api/seats?hallId={hallId}
```

### Get Seat by ID
```http
GET /api/seats/{id}
```

---

## 📅 Bookings

### Create Booking
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

### Get My Bookings
```http
GET /api/bookings/my
```

### Get Booking by ID
```http
GET /api/bookings/{id}
```

### Cancel Booking
```http
DELETE /api/bookings/{id}
```

---

## 💳 Payments

### Create Payment
```http
POST /api/payments
{
  "bookingId": 1,
  "amount": 1000.00,
  "paymentMethod": "card"
}
```

### Get My Payments
```http
GET /api/payments/my
```

---

## 💰 Tariffs

### Get Tariffs by Club
```http
GET /api/tariffs?clubId={clubId}
```

---

## 👤 Users (Admin endpoints)

### Get All Users
```http
GET /api/users
Authorization: Bearer {admin_token}
```

### Create User
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

### Update User
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

### Delete User (Physical deletion)
```http
DELETE /api/users/{id}
Authorization: Bearer {superadmin_token}
```

---

## 🔐 Roles & Permissions

### User Roles
- **User** - Book seats, view own bookings/payments
- **Manager** - Manage club bookings, view reports
- **Admin** - Manage clubs/halls/seats, user management
- **SuperAdmin** - Full access, delete users

### Protected Endpoints
- `🔓 Public` - No auth required
- `🔒 User` - Requires login  
- `🔐 Admin` - Admin/SuperAdmin only
- `⭐ SuperAdmin` - SuperAdmin only

---

## 📱 Common Response Formats

### Success Response
```json
{
  "id": 1,
  "field": "value",
  "createdAt": "2025-07-19T10:00:00Z"
}
```

### Error Response
```json
{
  "type": "https://httpstatuses.com/400",
  "title": "Bad Request", 
  "status": 400,
  "detail": "Error description"
}
```

### Array Response
```json
[
  { "id": 1, "name": "Item 1" },
  { "id": 2, "name": "Item 2" }
]
```

---

## 🎯 Key Features

### Booking Flow
1. **Login** → Get token
2. **Browse clubs** → `/api/clubs`
3. **Select hall** → `/api/halls?clubId={id}`
4. **Choose seat** → `/api/seats?hallId={id}`
5. **Create booking** → `/api/bookings`
6. **Make payment** → `/api/payments`

### Admin Features
- User management (CRUD)
- Club/Hall/Seat management
- Booking oversight
- Payment tracking

---

## 🛠️ Test Credentials

### SuperAdmin
```
Email: khalych.kz@gmail.com
Password: Burbik27092004
```

### Test User
```
Email: test@oyna.kz  
Password: 123456
```

---

## 📊 Status Codes

- `200` - Success
- `201` - Created
- `204` - No Content (successful delete/update)
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## 🔄 Data Types

### DateTime Format
```json
"2025-07-19T14:30:00Z"
```

### Time Format
```json
"14:30:00"
```

### Date Format
```json
"2025-07-19"
```

### Decimal Format
```json
1000.50
```

---

## 🚨 Important Notes

- All timestamps are in UTC
- Phone numbers should include country code
- Passwords minimum 6 characters
- JWT tokens expire in 24 hours
- Physical deletion for users (no soft delete)
- Soft deletion for clubs/halls/seats
- All amounts in tenge (KZT)
