# 🔒 МАТРИЦА РОЛЕЙ И РАЗРЕШЕНИЙ

## 👥 РОЛИ СИСТЕМЫ

### 🔴 SuperAdmin (Суперадминистратор)
- **Назначение**: Полный контроль системы
- **Кто**: Владелец системы, главный разработчик
- **Доступ**: ПОЛНЫЙ доступ ко всем функциям

### 🟠 Admin (Администратор)
- **Назначение**: Управление бизнес-процессами
- **Кто**: IT-администратор, руководитель сети клубов
- **Доступ**: Управление клубами, пользователями, отчеты

### 🟡 Manager (Менеджер)
- **Назначение**: Управление конкретным клубом
- **Кто**: Менеджер игрового клуба
- **Доступ**: Бронирования, платежи, отчеты по своему клубу

### 🟢 User (Пользователь)
- **Назначение**: Клиент игрового клуба
- **Кто**: Игроки, посетители
- **Доступ**: Свой профиль, свои бронирования

---

## 📋 ДЕТАЛЬНЫЕ РАЗРЕШЕНИЯ ПО КОНТРОЛЛЕРАМ

### 👤 **UsersController**

| Действие | SuperAdmin | Admin | Manager | User |
|----------|:----------:|:-----:|:-------:|:----:|
| GET /api/users (все пользователи) | ✅ | ✅ | ❌ | ❌ |
| GET /api/users/{id} (конкретный) | ✅ | ✅ | ❌ | 🔒 Только свой |
| POST /api/users (создание) | ✅ | ✅ | ❌ | ❌ |
| PUT /api/users/{id} (редактирование) | ✅ | ✅ | ❌ | 🔒 Только свой |
| DELETE /api/users/{id} (удаление) | ✅ | ❌ | ❌ | ❌ |

### 🏢 **ClubsController**

| Действие | SuperAdmin | Admin | Manager | User |
|----------|:----------:|:-----:|:-------:|:----:|
| GET /api/clubs (все клубы) | ✅ | ✅ | ✅ | ✅ |
| GET /api/clubs/{id} | ✅ | ✅ | ✅ | ✅ |
| POST /api/clubs | ✅ | ✅ | ❌ | ❌ |
| PUT /api/clubs/{id} | ✅ | ✅ | 🔒 Только свой | ❌ |
| DELETE /api/clubs/{id} | ✅ | ✅ | ❌ | ❌ |

### 🏛️ **HallsController**

| Действие | SuperAdmin | Admin | Manager | User |
|----------|:----------:|:-----:|:-------:|:----:|
| GET /api/halls | ✅ | ✅ | ✅ | ✅ |
| GET /api/halls/{id} | ✅ | ✅ | ✅ | ✅ |
| POST /api/halls | ✅ | ✅ | 🔒 Только для своего клуба | ❌ |
| PUT /api/halls/{id} | ✅ | ✅ | 🔒 Только своего клуба | ❌ |
| DELETE /api/halls/{id} | ✅ | ✅ | ❌ | ❌ |

### 💺 **SeatsController**

| Действие | SuperAdmin | Admin | Manager | User |
|----------|:----------:|:-----:|:-------:|:----:|
| GET /api/seats | ✅ | ✅ | ✅ | ✅ |
| GET /api/seats/{id} | ✅ | ✅ | ✅ | ✅ |
| POST /api/seats | ✅ | ✅ | 🔒 Только для своего клуба | ❌ |
| PUT /api/seats/{id} | ✅ | ✅ | 🔒 Только своего клуба | ❌ |
| DELETE /api/seats/{id} | ✅ | ✅ | ❌ | ❌ |

### 💰 **TariffsController**

| Действие | SuperAdmin | Admin | Manager | User |
|----------|:----------:|:-----:|:-------:|:----:|
| GET /api/tariffs | ✅ | ✅ | ✅ | ✅ |
| GET /api/tariffs/{id} | ✅ | ✅ | ✅ | ✅ |
| POST /api/tariffs | ✅ | ✅ | 🔒 Только для своего клуба | ❌ |
| PUT /api/tariffs/{id} | ✅ | ✅ | 🔒 Только своего клуба | ❌ |
| DELETE /api/tariffs/{id} | ✅ | ✅ | ❌ | ❌ |

### 📅 **BookingsController**

| Действие | SuperAdmin | Admin | Manager | User |
|----------|:----------:|:-----:|:-------:|:----:|
| GET /api/bookings (все) | ✅ | ✅ | 🔒 Только своего клуба | 🔒 Только свои |
| GET /api/bookings/{id} | ✅ | ✅ | 🔒 Только своего клуба | 🔒 Только свои |
| POST /api/bookings | ✅ | ✅ | ✅ | ✅ |
| PUT /api/bookings/{id} | ✅ | ✅ | 🔒 Только своего клуба | 🔒 Только свои |
| DELETE /api/bookings/{id} | ✅ | ✅ | 🔒 Только своего клуба | 🔒 Только свои |

### 💳 **PaymentsController**

| Действие | SuperAdmin | Admin | Manager | User |
|----------|:----------:|:-----:|:-------:|:----:|
| GET /api/payments (все) | ✅ | ✅ | 🔒 Только своего клуба | 🔒 Только свои |
| GET /api/payments/{id} | ✅ | ✅ | 🔒 Только своего клуба | 🔒 Только свои |
| POST /api/payments | ✅ | ✅ | ✅ | ✅ |
| PUT /api/payments/{id} | ✅ | ✅ | 🔒 Только своего клуба | ❌ |
| DELETE /api/payments/{id} | ✅ | ❌ | ❌ | ❌ |

### 🔔 **NotificationsController**

| Действие | SuperAdmin | Admin | Manager | User |
|----------|:----------:|:-----:|:-------:|:----:|
| GET /api/notifications | ✅ | ✅ | ✅ | 🔒 Только свои |
| GET /api/notifications/{id} | ✅ | ✅ | ✅ | 🔒 Только свои |
| POST /api/notifications | ✅ | ✅ | ✅ | ❌ |
| PUT /api/notifications/{id} | ✅ | ✅ | ✅ | 🔒 Только свои (mark as read) |
| DELETE /api/notifications/{id} | ✅ | ✅ | ✅ | 🔒 Только свои |

### 🔧 **ComputerSpecsController**

| Действие | SuperAdmin | Admin | Manager | User |
|----------|:----------:|:-----:|:-------:|:----:|
| GET /api/computerspecs | ✅ | ✅ | ✅ | ✅ |
| GET /api/computerspecs/{id} | ✅ | ✅ | ✅ | ✅ |
| POST /api/computerspecs | ✅ | ✅ | 🔒 Только для своего клуба | ❌ |
| PUT /api/computerspecs/{id} | ✅ | ✅ | 🔒 Только своего клуба | ❌ |
| DELETE /api/computerspecs/{id} | ✅ | ✅ | ❌ | ❌ |

### 📸 **ClubPhotosController**

| Действие | SuperAdmin | Admin | Manager | User |
|----------|:----------:|:-----:|:-------:|:----:|
| GET /api/clubphotos | ✅ | ✅ | ✅ | ✅ |
| GET /api/clubphotos/{id} | ✅ | ✅ | ✅ | ✅ |
| POST /api/clubphotos | ✅ | ✅ | 🔒 Только для своего клуба | ❌ |
| PUT /api/clubphotos/{id} | ✅ | ✅ | 🔒 Только своего клуба | ❌ |
| DELETE /api/clubphotos/{id} | ✅ | ✅ | 🔒 Только своего клуба | ❌ |

### 🛡️ **RolesController**

| Действие | SuperAdmin | Admin | Manager | User |
|----------|:----------:|:-----:|:-------:|:----:|
| GET /api/roles | ✅ | ✅ | ❌ | ❌ |
| GET /api/roles/{id} | ✅ | ✅ | ❌ | ❌ |
| POST /api/roles | ✅ | ❌ | ❌ | ❌ |
| PUT /api/roles/{id} | ✅ | ❌ | ❌ | ❌ |
| DELETE /api/roles/{id} | ✅ | ❌ | ❌ | ❌ |

### 📋 **AuditLogsController**

| Действие | SuperAdmin | Admin | Manager | User |
|----------|:----------:|:-----:|:-------:|:----:|
| GET /api/auditlogs | ✅ | ✅ | ❌ | ❌ |
| GET /api/auditlogs/{id} | ✅ | ✅ | ❌ | ❌ |
| POST /api/auditlogs | ✅ | ✅ | ❌ | ❌ |
| PUT /api/auditlogs/{id} | ✅ | ❌ | ❌ | ❌ |
| DELETE /api/auditlogs/{id} | ✅ | ❌ | ❌ | ❌ |

---

## 🔐 СПЕЦИАЛЬНЫЕ ОГРАНИЧЕНИЯ

### 🔒 "Только свой" - означает:
- **User**: Может видеть/редактировать только свои записи (по UserId)
- **Manager**: Может управлять только записями своего клуба (по ClubId)

### 📝 Примечания:
1. **SuperAdmin** имеет абсолютный доступ ко всему
2. **Admin** не может удалять пользователей (только SuperAdmin)
3. **Manager** может управлять только объектами своего клуба
4. **User** может только просматривать общую информацию и управлять своими данными

### 🚨 Критически важно:
- Все операции с ролями - только SuperAdmin
- Удаление пользователей - только SuperAdmin  
- Логи аудита - только SuperAdmin и Admin
- Финансовые операции требуют дополнительной проверки
