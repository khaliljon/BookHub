-- Весь файл закомментирован для предотвращения ошибок сборки
-- Клубы
-- INSERT INTO clubs (name, city, address, description, phone_number, email, opening_hours, is_active, is_deleted, created_at, updated_at)
-- VALUES
-- ('CyberArena', 'Алматы', 'ул. Абая 10', 'Лучший клуб', '+77010000001', 'arena@club.kz', '10:00-02:00', true, false, NOW(), NOW()),
-- ('GameZone', 'Астана', 'пр. Мира 5', 'Современный клуб', '+77010000002', 'zone@club.kz', '09:00-01:00', true, false, NOW(), NOW());

-- Залы
-- INSERT INTO halls (club_id, name, description, is_deleted, created_at, updated_at)
-- VALUES
-- (1, 'VIP', 'VIP зал', false, NOW(), NOW()),
-- (1, 'Main', 'Основной зал', false, NOW(), NOW()),
-- (2, 'Premium', 'Премиум зал', false, NOW(), NOW());

-- Места
-- INSERT INTO seats (hall_id, seat_number, description, status, is_deleted, created_at, updated_at)
-- VALUES
-- (1, '1', 'Лучшее место', 'работает', false, NOW(), NOW()),
-- (1, '2', 'Обычное место', 'работает', false, NOW(), NOW()),
-- (2, '1', 'Место в основном зале', 'работает', false, NOW(), NOW()),
-- (3, '1', 'Премиум место', 'работает', false, NOW(), NOW());

-- Тарифы
-- INSERT INTO tariffs (club_id, name, description, price_per_hour, is_night_tariff, created_at, updated_at)
-- VALUES
-- (1, 'Стандарт', 'Обычный тариф', 800, false, NOW(), NOW()),
-- (1, 'Ночной', 'Скидка ночью', 600, true, NOW(), NOW()),
-- (2, 'Премиум', 'Премиум тариф', 1200, false, NOW(), NOW());

-- Пользователи
-- INSERT INTO users (full_name, phone_number, email, password_hash, balance, points, is_deleted, created_at, updated_at, managed_club_id)
-- VALUES
-- ('Иван Иванов', '+77011111111', 'ivan@club.kz', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewdBzpzgjWPkLlTm', 10000, 100, false, NOW(), NOW(), 1),
-- ('Петр Петров', '+77012222222', 'petr@club.kz', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewdBzpzgjWPkLlTm', 5000, 50, false, NOW(), NOW(), 2);

-- Привязка ролей (User)
-- INSERT INTO user_roles (user_id, role_id, assigned_at)
-- SELECT u.id, r.id, NOW()
-- FROM users u, roles r
-- WHERE u.email IN ('ivan@club.kz', 'petr@club.kz') AND r.name = 'User'
-- ON CONFLICT DO NOTHING;

-- Бронирования
-- INSERT INTO bookings (user_id, seat_id, tariff_id, date, start_time, end_time, total_price, status, created_at, updated_at)
-- VALUES
-- (1, 1, 1, '2025-07-25', '12:00', '14:00', 1600, 'активно', NOW(), NOW()),
-- (2, 4, 3, '2025-07-25', '15:00', '17:00', 2400, 'активно', NOW(), NOW());

-- Платежи
-- INSERT INTO payments (booking_id, amount, payment_method, payment_status, created_at, updated_at)
-- VALUES
-- (1, 1600, 'Kaspi', 'успешно', NOW(), NOW()),
-- (2, 2400, 'Kaspi', 'успешно', NOW(), NOW());

-- Уведомления
-- INSERT INTO notifications (user_id, title, message, is_read, created_at)
-- VALUES
-- (1, 'Добро пожаловать!', 'Спасибо за регистрацию!', false, NOW()),
-- (2, 'Бронирование подтверждено', 'Ваше бронирование успешно создано.', false, NOW());