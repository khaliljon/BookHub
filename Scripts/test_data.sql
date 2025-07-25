-- Полная очистка и заполнение тестовыми связанными данными

-- УДАЛЕНИЕ ВСЕХ ДАННЫХ (с учётом связей)
TRUNCATE TABLE payments RESTART IDENTITY CASCADE;
TRUNCATE TABLE bookings RESTART IDENTITY CASCADE;
TRUNCATE TABLE notifications RESTART IDENTITY CASCADE;
TRUNCATE TABLE user_roles RESTART IDENTITY CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;
TRUNCATE TABLE roles RESTART IDENTITY CASCADE;
TRUNCATE TABLE seats RESTART IDENTITY CASCADE;
TRUNCATE TABLE halls RESTART IDENTITY CASCADE;
TRUNCATE TABLE tariffs RESTART IDENTITY CASCADE;
TRUNCATE TABLE clubs RESTART IDENTITY CASCADE;

-- РОЛИ
INSERT INTO roles (id, name, description)
VALUES
  (1, 'SuperAdmin', 'Суперадминистратор - полный доступ ко всем функциям системы, управление пользователями и ролями'),
  (2, 'Admin', 'Администратор - управление клубами, залами, местами, тарифами и отчеты'),
  (3, 'Manager', 'Менеджер клуба - управление бронированиями, платежами и отчеты по своему клубу'),
  (4, 'User', 'Обычный пользователь - бронирование мест, просмотр своего профиля и платежей');

-- КЛУБЫ
INSERT INTO clubs (id, name, city, address, description, phone_number, email, opening_hours, is_active, is_deleted, created_at, updated_at)
VALUES
  (1, 'CyberArena', 'Алматы', 'ул. Абая 10', 'Лучший клуб', '+77010000001', 'arena@club.kz', '10:00-02:00', true, false, NOW(), NOW()),
  (2, 'GameZone', 'Астана', 'пр. Мира 5', 'Современный клуб', '+77010000002', 'zone@club.kz', '09:00-01:00', true, false, NOW(), NOW());

-- ЗАЛЫ
INSERT INTO halls (id, club_id, name, description, is_deleted, created_at, updated_at)
VALUES
  (1, 1, 'VIP', 'VIP зал', false, NOW(), NOW()),
  (2, 1, 'Main', 'Основной зал', false, NOW(), NOW()),
  (3, 2, 'Premium', 'Премиум зал', false, NOW(), NOW());

-- МЕСТА
INSERT INTO seats (id, hall_id, seat_number, description, status, is_deleted, created_at, updated_at)
VALUES
  (1, 1, '1', 'Лучшее место', 'работает', false, NOW(), NOW()),
  (2, 1, '2', 'Обычное место', 'работает', false, NOW(), NOW()),
  (3, 2, '1', 'Место в основном зале', 'работает', false, NOW(), NOW()),
  (4, 3, '1', 'Премиум место', 'работает', false, NOW(), NOW());

-- ТАРИФЫ
INSERT INTO tariffs (id, club_id, name, description, price_per_hour, is_night_tariff, created_at, updated_at)
VALUES
  (1, 1, 'Стандарт', 'Обычный тариф', 800, false, NOW(), NOW()),
  (2, 1, 'Ночной', 'Скидка ночью', 600, true, NOW(), NOW()),
  (3, 2, 'Премиум', 'Премиум тариф', 1200, false, NOW(), NOW());

-- ПОЛЬЗОВАТЕЛИ
INSERT INTO users (id, full_name, phone_number, email, password_hash, balance, points, is_deleted, created_at, updated_at, managed_club_id)
VALUES
  (1, 'Иван Иванов', '+77011111111', 'ivan@club.kz', 'hash1', 10000, 100, false, NOW(), NOW(), 1),
  (2, 'Петр Петров', '+77012222222', 'petr@club.kz', 'hash2', 5000, 50, false, NOW(), NOW(), 2),
  (3, 'Алия Сарсенова', '+77013333333', 'aliya@club.kz', 'hash3', 7000, 70, false, NOW(), NOW(), NULL),
  (4, 'Жанна Касымова', '+77014444444', 'zhanna@club.kz', 'hash4', 3000, 30, false, NOW(), NOW(), NULL),
  (5, 'Ерлан Абдуллаев', '+77015555555', 'erlan@club.kz', 'hash5', 2000, 20, false, NOW(), NOW(), NULL);

-- ПРИВЯЗКА РОЛЕЙ
INSERT INTO user_roles (user_id, role_id, assigned_at) VALUES
  (1, 3, NOW()), -- Иван Иванов - Manager
  (2, 2, NOW()), -- Петр Петров - Admin
  (3, 4, NOW()), -- Алия Сарсенова - User
  (4, 4, NOW()), -- Жанна Касымова - User
  (5, 4, NOW()), -- Ерлан Абдуллаев - User
  (1, 1, NOW()); -- Иван Иванов - SuperAdmin (пример мульти-ролей)

-- БРОНИРОВАНИЯ
INSERT INTO bookings (id, user_id, seat_id, tariff_id, date, start_time, end_time, total_price, status, created_at, updated_at)
VALUES
  (1, 3, 1, 1, '2025-07-25', '12:00', '14:00', 1600, 'активно', NOW(), NOW()),
  (2, 4, 2, 1, '2025-07-25', '15:00', '17:00', 1600, 'активно', NOW(), NOW()),
  (3, 5, 4, 3, '2025-07-26', '10:00', '13:00', 3600, 'активно', NOW(), NOW()),
  (4, 3, 3, 2, '2025-07-27', '18:00', '20:00', 1200, 'отменено', NOW(), NOW());

-- ПЛАТЕЖИ
INSERT INTO payments (booking_id, amount, payment_method, payment_status, created_at, updated_at)
VALUES
  (1, 1600, 'Kaspi', 'успешно', NOW(), NOW()),
  (2, 1600, 'Card', 'успешно', NOW(), NOW()),
  (3, 3600, 'Kaspi', 'ожидание', NOW(), NOW()),
  (4, 1200, 'Card', 'отменено', NOW(), NOW());

-- УВЕДОМЛЕНИЯ
INSERT INTO notifications (user_id, title, message, is_read, created_at)
VALUES
  (3, 'Добро пожаловать!', 'Спасибо за регистрацию!', false, NOW()),
  (4, 'Бронирование подтверждено', 'Ваше бронирование успешно создано.', false, NOW()),
  (5, 'Платеж ожидает', 'Ваш платеж на сумму 3600₸ ожидает подтверждения.', false, NOW()),
  (1, 'Системное сообщение', 'Вы назначены менеджером клуба.', true, NOW());