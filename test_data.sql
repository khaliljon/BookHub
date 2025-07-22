-- Тестовые клубы
INSERT INTO clubs (name, city, address, description, phone_number, email, opening_hours) VALUES
('CyberArena Almaty', 'Алматы', 'ул. Абая 150/230', 'Современный игровой клуб с топовыми компьютерами и удобными креслами. Проводим турниры и мастер-классы.', '+7 701 234 5678', 'info@cyberarena-almaty.kz', '10:00-02:00'),
('GameZone Astana', 'Астана', 'пр. Кабанбай батыра 53', 'Премиальный игровой клуб в центре столицы. VIP-залы, профессиональное оборудование.', '+7 702 345 6789', 'contact@gamezone-astana.kz', '09:00-01:00'),
('ProGaming Shymkent', 'Шымкент', 'ул. Кунаева 12', 'Клуб для настоящих геймеров. Регулярные турниры по CS:GO, Dota 2, Valorant.', '+7 703 456 7890', 'hello@progaming-shymkent.kz', '11:00-00:00'),
('NetCafe Pavlodar', 'Павлодар', 'ул. Торайгырова 45', 'Уютный игровой клуб с семейной атмосферой. Отличные цены, дружелюбный персонал.', '+7 704 567 8901', 'netcafe@pavlodar.kz', '12:00-23:00'),
('Cyber Club Aktobe', 'Актобе', 'пр. Абилкайыр хана 89', 'Новый современный клуб с игровыми автоматами и компьютерными играми.', '+7 705 678 9012', 'info@cyberclub-aktobe.kz', '10:00-01:00');

-- Тестовые залы
INSERT INTO halls (club_id, name, description) VALUES
(1, 'VIP Зал', 'Премиальный зал с геймерскими креслами DXRacer'),
(1, 'Основной зал', 'Главный игровой зал с мониторами 144Hz'),
(1, 'Турнирный зал', 'Специальный зал для проведения турниров'),
(2, 'Премиум зона', 'Зал с RTX 4080 и мониторами 240Hz'),
(2, 'Стандарт зал', 'Комфортный зал для повседневного гейминга'),
(3, 'Pro Gaming Arena', 'Профессиональная арена для киберспорта'),
(3, 'Casual Gaming', 'Зал для казуального гейминга'),
(4, 'Семейная зона', 'Тихий зал для семейного отдыха'),
(5, 'Игровой зал', 'Основной зал с современным оборудованием');

-- Тестовые места
-- Добавьте места вручную, например:
INSERT INTO seats (hall_id, seat_number, status) VALUES
(1, '1', 'работает'),
(1, '2', 'работает'),
(2, '1', 'работает'),
(2, '2', 'работает');

-- Тестовые тарифы
INSERT INTO tariffs (club_id, name, description, price_per_hour) VALUES
(1, 'Стандарт', 'Обычный тариф для игры в любое время', 800.00),
(1, 'VIP', 'Премиальный тариф с дополнительными услугами', 1500.00),
(1, 'Ночной', 'Скидка 30% с 00:00 до 08:00', 560.00),
(2, 'Базовый', 'Стандартное время игры', 900.00),
(2, 'Премиум', 'Доступ к лучшим компьютерам', 1800.00),
(3, 'Турнирный', 'Специальный тариф для участников турниров', 700.00),
(3, 'Обычный', 'Стандартный тариф', 750.00),
(4, 'Семейный', 'Специальная цена для семей', 600.00),
(5, 'Студенческий', 'Скидка для студентов (при предъявлении)', 650.00);

-- Тестовые пользователи
DO $$
DECLARE
    hashed_password TEXT;
BEGIN
    hashed_password := '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewdBzpzgjWPkLlTm';
    INSERT INTO users (full_name, phone_number, email, password_hash, balance, points) VALUES
    ('Алексей Петров', '+77011234567', 'aleksey.petrov@email.com', hashed_password, 15000.00, 250),
    ('Мария Сидорова', '+77012345678', 'maria.sidorova@email.com', hashed_password, 8500.00, 180),
    ('Дмитрий Козлов', '+77013456789', 'dmitry.kozlov@email.com', hashed_password, 25000.00, 420),
    ('Анна Новикова', '+77014567890', 'anna.novikova@email.com', hashed_password, 12000.00, 310),
    ('Сергей Морозов', '+77015678901', 'sergey.morozov@email.com', hashed_password, 3200.00, 95),
    ('Елена Волкова', '+77016789012', 'elena.volkova@email.com', hashed_password, 18700.00, 380),
    ('Иван Соколов', '+77017890123', 'ivan.sokolov@email.com', hashed_password, 7800.00, 160),
    ('Ольга Лебедева', '+77018901234', 'olga.lebedeva@email.com', hashed_password, 21500.00, 450),
    ('Максим Орлов', '+77019012345', 'maxim.orlov@email.com', hashed_password, 9300.00, 220),
    ('Татьяна Зайцева', '+77010123456', 'tatyana.zaytseva@email.com', hashed_password, 14200.00, 290);
END $$;

-- Назначаем роли тестовым пользователям
DO $$
DECLARE
    user_record RECORD;
    role_user_id INTEGER;
    role_manager_id INTEGER;
    role_admin_id INTEGER;
BEGIN
    SELECT id INTO role_user_id FROM roles WHERE name = 'User';
    SELECT id INTO role_manager_id FROM roles WHERE name = 'Manager';
    SELECT id INTO role_admin_id FROM roles WHERE name = 'Admin';
    FOR user_record IN SELECT id, email FROM users WHERE email LIKE '%@email.com' LOOP
        INSERT INTO user_roles (user_id, role_id, assigned_at) VALUES (user_record.id, role_user_id, NOW());
        IF user_record.email IN ('maria.sidorova@email.com', 'dmitry.kozlov@email.com', 'elena.volkova@email.com') THEN
            INSERT INTO user_roles (user_id, role_id, assigned_at) VALUES (user_record.id, role_manager_id, NOW());
        END IF;
        IF user_record.email = 'aleksey.petrov@email.com' THEN
            INSERT INTO user_roles (user_id, role_id, assigned_at) VALUES (user_record.id, role_admin_id, NOW());
        END IF;
    END LOOP;
END $$;

-- Тестовые бронирования
-- Тестовые бронирования
INSERT INTO bookings (user_id, seat_id, tariff_id, date, start_time, end_time, total_price, status) VALUES
(11, 1, 1, '2025-07-22', '10:00', '12:00', 1600.00, 'активно'),
(12, 2, 2, '2025-07-22', '12:00', '14:00', 3000.00, 'активно'),
(13, 3, 3, '2025-07-21', '15:00', '17:00', 1120.00, 'активно'),
(14, 4, 4, '2025-07-21', '18:00', '20:00', 1800.00, 'активно'),
(15, 1, 5, '2025-07-20', '09:00', '11:00', 1300.00, 'активно'),
(11, 2, 1, '2025-07-19', '13:00', '15:00', 1600.00, 'активно'),
(12, 3, 2, '2025-07-18', '16:00', '18:00', 3000.00, 'активно'),
(13, 4, 3, '2025-07-17', '19:00', '21:00', 1120.00, 'активно'),
(14, 1, 4, '2025-07-16', '10:00', '12:00', 1800.00, 'активно'),
(15, 2, 5, '2025-07-15', '12:00', '14:00', 1300.00, 'активно');

-- Уведомления
INSERT INTO notifications (user_id, title, message, is_read) VALUES
( (SELECT id FROM users WHERE email = 'aleksey.petrov@email.com'), 'Добро пожаловать!', 'Спасибо за регистрацию в системе Oyna Gaming!', false ),
( (SELECT id FROM users WHERE email = 'maria.sidorova@email.com'), 'Бронирование подтверждено', 'Ваше бронирование на завтра в 18:00 подтверждено.', true ),
( (SELECT id FROM users WHERE email = 'dmitry.kozlov@email.com'), 'Новый турнир!', 'Регистрация на турнир по CS:GO открыта!', false ),
( (SELECT id FROM users WHERE email = 'anna.novikova@email.com'), 'Скидка 20%', 'Специальная скидка на ночные тарифы!', false );

COMMIT;

-- Информация о созданных данных
SELECT 
    'Клубы' as "Тип данных", COUNT(*) as "Количество" FROM clubs
UNION ALL
SELECT 'Залы', COUNT(*) FROM halls
UNION ALL
SELECT 'Места', COUNT(*) FROM seats
UNION ALL
SELECT 'Тарифы', COUNT(*) FROM tariffs
UNION ALL
SELECT 'Пользователи', COUNT(*) FROM users
UNION ALL
SELECT 'Бронирования', COUNT(*) FROM bookings
UNION ALL
SELECT 'Уведомления', COUNT(*) FROM notifications;