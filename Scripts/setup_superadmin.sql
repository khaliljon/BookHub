-- =====================================================
-- ИНСТРУКЦИЯ ПО СОЗДАНИЮ СУПЕРАДМИНА
-- =====================================================

-- 1. ОБЯЗАТЕЛЬНО измените данные ниже перед запуском!
-- 2. Используйте реальные email и телефон
-- 3. Сгенерируйте надежный пароль и его хэш

-- Пример генерации хэша пароля:
-- Используйте онлайн генератор bcrypt или .NET приложение
-- Пароль: YourSecurePassword123!
-- Хэш: $2a$11$your_generated_hash_here

-- ЗАМЕНИТЕ ДАННЫЕ НИЖЕ:
UPDATE users 
SET 
    full_name = 'Ваше Имя Фамилия',
    phone_number = '+77123456789',  -- Ваш реальный номер
    email = 'youremail@domain.com',  -- Ваш реальный email
    password_hash = '$2a$11$your_bcrypt_hash_here'  -- Хэш вашего пароля
WHERE email = 'admin@oynaapi.com';

-- Проверка успешного создания:
SELECT 
    u.id,
    u.full_name,
    u.email,
    u.phone_number,
    r.name as role_name
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE r.name = 'SuperAdmin';

-- Если суперадмин не создался, выполните:
/*
-- Найти ID роли SuperAdmin
SELECT id FROM roles WHERE name = 'SuperAdmin';

-- Найти ID вашего пользователя
SELECT id FROM users WHERE email = 'youremail@domain.com';

-- Назначить роль вручную (замените ID на реальные)
INSERT INTO user_roles (user_id, role_id, assigned_at)
VALUES (1, 1, NOW());
*/
