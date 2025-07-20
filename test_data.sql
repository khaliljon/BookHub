-- Скрипт для добавления тестовых данных в систему Oyna

-- Тестовые клубы
INSERT INTO "Clubs" ("Name", "City", "Address", "Description", "Phone", "Email", "OpeningHours", "IsActive") VALUES
('CyberArena Almaty', 'Алматы', 'ул. Абая 150/230', 'Современный игровой клуб с топовыми компьютерами и удобными креслами. Проводим турниры и мастер-классы.', '+7 701 234 5678', 'info@cyberarena-almaty.kz', '10:00-02:00', true),
('GameZone Astana', 'Астана', 'пр. Кабанбай батыра 53', 'Премиальный игровой клуб в центре столицы. VIP-залы, профессиональное оборудование.', '+7 702 345 6789', 'contact@gamezone-astana.kz', '09:00-01:00', true),
('ProGaming Shymkent', 'Шымкент', 'ул. Кунаева 12', 'Клуб для настоящих геймеров. Регулярные турниры по CS:GO, Dota 2, Valorant.', '+7 703 456 7890', 'hello@progaming-shymkent.kz', '11:00-00:00', true),
('NetCafe Pavlodar', 'Павлодар', 'ул. Торайгырова 45', 'Уютный игровой клуб с семейной атмосферой. Отличные цены, дружелюбный персонал.', '+7 704 567 8901', 'netcafe@pavlodar.kz', '12:00-23:00', true),
('Cyber Club Aktobe', 'Актобе', 'пр. Абилкайыр хана 89', 'Новый современный клуб с игровыми автоматами и компьютерными играми.', '+7 705 678 9012', 'info@cyberclub-aktobe.kz', '10:00-01:00', true);

-- Тестовые залы
INSERT INTO "Halls" ("ClubId", "Name", "Description", "Capacity") VALUES
(1, 'VIP Зал', 'Премиальный зал с геймерскими креслами DXRacer', 10),
(1, 'Основной зал', 'Главный игровой зал с мониторами 144Hz', 25),
(1, 'Турнирный зал', 'Специальный зал для проведения турниров', 16),
(2, 'Премиум зона', 'Зал с RTX 4080 и мониторами 240Hz', 12),
(2, 'Стандарт зал', 'Комфортный зал для повседневного гейминга', 20),
(3, 'Pro Gaming Arena', 'Профессиональная арена для киберспорта', 18),
(3, 'Casual Gaming', 'Зал для казуального гейминга', 22),
(4, 'Семейная зона', 'Тихий зал для семейного отдыха', 15),
(5, 'Игровой зал', 'Основной зал с современным оборудованием', 30);

-- Тестовые места
DO $$
DECLARE
    hall_record RECORD;
    seat_num INTEGER;
BEGIN
    FOR hall_record IN SELECT "Id", "Capacity" FROM "Halls" LOOP
        FOR seat_num IN 1..hall_record."Capacity" LOOP
            INSERT INTO "Seats" ("HallId", "SeatNumber", "Status") 
            VALUES (hall_record."Id", seat_num, 'Available');
        END LOOP;
    END LOOP;
END $$;

-- Тестовые тарифы
INSERT INTO "Tariffs" ("ClubId", "Name", "Description", "PricePerHour", "IsActive") VALUES
(1, 'Стандарт', 'Обычный тариф для игры в любое время', 800.00, true),
(1, 'VIP', 'Премиальный тариф с дополнительными услугами', 1500.00, true),
(1, 'Ночной', 'Скидка 30% с 00:00 до 08:00', 560.00, true),
(2, 'Базовый', 'Стандартное время игры', 900.00, true),
(2, 'Премиум', 'Доступ к лучшим компьютерам', 1800.00, true),
(3, 'Турнирный', 'Специальный тариф для участников турниров', 700.00, true),
(3, 'Обычный', 'Стандартный тариф', 750.00, true),
(4, 'Семейный', 'Специальная цена для семей', 600.00, true),
(5, 'Студенческий', 'Скидка для студентов (при предъявлении)', 650.00, true);

-- Тестовые пользователи (дополнительные)
DO $$
DECLARE
    hashed_password TEXT;
BEGIN
    -- Хешируем пароль "123456" с BCrypt
    hashed_password := '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewdBzpzgjWPkLlTm';
    
    INSERT INTO "Users" ("FullName", "PhoneNumber", "Email", "PasswordHash", "Balance", "Points", "IsDeleted", "CreatedAt") VALUES
    ('Алексей Петров', '+77011234567', 'aleksey.petrov@email.com', hashed_password, 15000.00, 250, false, NOW()),
    ('Мария Сидорова', '+77012345678', 'maria.sidorova@email.com', hashed_password, 8500.00, 180, false, NOW()),
    ('Дмитрий Козлов', '+77013456789', 'dmitry.kozlov@email.com', hashed_password, 25000.00, 420, false, NOW()),
    ('Анна Новикова', '+77014567890', 'anna.novikova@email.com', hashed_password, 12000.00, 310, false, NOW()),
    ('Сергей Морозов', '+77015678901', 'sergey.morozov@email.com', hashed_password, 3200.00, 95, false, NOW()),
    ('Елена Волкова', '+77016789012', 'elena.volkova@email.com', hashed_password, 18700.00, 380, false, NOW()),
    ('Иван Соколов', '+77017890123', 'ivan.sokolov@email.com', hashed_password, 7800.00, 160, false, NOW()),
    ('Ольга Лебедева', '+77018901234', 'olga.lebedeva@email.com', hashed_password, 21500.00, 450, false, NOW()),
    ('Максим Орлов', '+77019012345', 'maxim.orlov@email.com', hashed_password, 9300.00, 220, false, NOW()),
    ('Татьяна Зайцева', '+77010123456', 'tatyana.zaytseva@email.com', hashed_password, 14200.00, 290, false, NOW());
END $$;

-- Назначаем роли тестовым пользователям
DO $$
DECLARE
    user_record RECORD;
    role_user_id INTEGER;
    role_manager_id INTEGER;
    role_admin_id INTEGER;
BEGIN
    -- Получаем ID ролей
    SELECT "Id" INTO role_user_id FROM "Roles" WHERE "Name" = 'User';
    SELECT "Id" INTO role_manager_id FROM "Roles" WHERE "Name" = 'Manager';
    SELECT "Id" INTO role_admin_id FROM "Roles" WHERE "Name" = 'Admin';
    
    -- Назначаем роли случайным образом
    FOR user_record IN SELECT "Id", "Email" FROM "Users" WHERE "Email" LIKE '%@email.com' LOOP
        -- Всем даем роль User
        INSERT INTO "UserRoles" ("UserId", "RoleId", "AssignedAt") 
        VALUES (user_record."Id", role_user_id, NOW());
        
        -- Некоторым даем роль Manager
        IF user_record."Email" IN ('maria.sidorova@email.com', 'dmitry.kozlov@email.com', 'elena.volkova@email.com') THEN
            INSERT INTO "UserRoles" ("UserId", "RoleId", "AssignedAt") 
            VALUES (user_record."Id", role_manager_id, NOW());
        END IF;
        
        -- Одному даем роль Admin
        IF user_record."Email" = 'aleksey.petrov@email.com' THEN
            INSERT INTO "UserRoles" ("UserId", "RoleId", "AssignedAt") 
            VALUES (user_record."Id", role_admin_id, NOW());
        END IF;
    END LOOP;
END $$;

-- Тестовые бронирования
DO $$
DECLARE
    user_ids INTEGER[];
    hall_ids INTEGER[];
    tariff_ids INTEGER[];
    i INTEGER;
BEGIN
    -- Получаем массивы ID
    user_ids := ARRAY(SELECT "Id" FROM "Users" WHERE "Email" LIKE '%@email.com' LIMIT 5);
    hall_ids := ARRAY(SELECT "Id" FROM "Halls" LIMIT 5);
    tariff_ids := ARRAY(SELECT "Id" FROM "Tariffs" LIMIT 5);
    
    -- Создаем 20 тестовых бронирований
    FOR i IN 1..20 LOOP
        INSERT INTO "Bookings" ("UserId", "HallId", "TariffId", "StartTime", "EndTime", "TotalAmount", "Status", "CreatedAt") 
        VALUES (
            user_ids[1 + (i % array_length(user_ids, 1))],
            hall_ids[1 + (i % array_length(hall_ids, 1))],
            tariff_ids[1 + (i % array_length(tariff_ids, 1))],
            NOW() + (i || ' hours')::INTERVAL - INTERVAL '10 days',
            NOW() + (i + 2 || ' hours')::INTERVAL - INTERVAL '10 days',
            (500 + (i * 100))::DECIMAL,
            CASE 
                WHEN i % 4 = 0 THEN 'Completed'
                WHEN i % 4 = 1 THEN 'Confirmed'
                WHEN i % 4 = 2 THEN 'Pending'
                ELSE 'Cancelled'
            END,
            NOW() - (i || ' days')::INTERVAL
        );
    END LOOP;
END $$;

-- Уведомления
INSERT INTO "Notifications" ("UserId", "Title", "Message", "IsRead", "CreatedAt") VALUES
((SELECT "Id" FROM "Users" WHERE "Email" = 'aleksey.petrov@email.com'), 'Добро пожаловать!', 'Спасибо за регистрацию в системе Oyna Gaming!', false, NOW() - INTERVAL '2 hours'),
((SELECT "Id" FROM "Users" WHERE "Email" = 'maria.sidorova@email.com'), 'Бронирование подтверждено', 'Ваше бронирование на завтра в 18:00 подтверждено.', true, NOW() - INTERVAL '1 day'),
((SELECT "Id" FROM "Users" WHERE "Email" = 'dmitry.kozlov@email.com'), 'Новый турнир!', 'Регистрация на турнир по CS:GO открыта!', false, NOW() - INTERVAL '3 hours'),
((SELECT "Id" FROM "Users" WHERE "Email" = 'anna.novikova@email.com'), 'Скидка 20%', 'Специальная скидка на ночные тарифы!', false, NOW() - INTERVAL '5 hours');

COMMIT;

-- Информация о созданных данных
SELECT 
    'Клубы' as "Тип данных", COUNT(*) as "Количество" FROM "Clubs"
UNION ALL
SELECT 'Залы', COUNT(*) FROM "Halls"
UNION ALL
SELECT 'Места', COUNT(*) FROM "Seats"
UNION ALL
SELECT 'Тарифы', COUNT(*) FROM "Tariffs"
UNION ALL
SELECT 'Пользователи', COUNT(*) FROM "Users"
UNION ALL
SELECT 'Бронирования', COUNT(*) FROM "Bookings"
UNION ALL
SELECT 'Уведомления', COUNT(*) FROM "Notifications";
