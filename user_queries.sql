-- =====================================================
-- ЗАПРОСЫ ДЛЯ РАБОТЫ С ПОЛЬЗОВАТЕЛЯМИ
-- =====================================================

-- Просмотр всех пользователей
SELECT 
    id,
    full_name,
    phone_number,
    email,
    created_at,
    updated_at,
    balance,
    points,
    is_deleted,
    managed_club_id
FROM users
ORDER BY created_at DESC;

-- Просмотр только активных пользователей
SELECT 
    id,
    full_name,
    phone_number,
    email,
    created_at,
    balance,
    points,
    managed_club_id
FROM users
WHERE is_deleted = FALSE
ORDER BY created_at DESC;

-- Просмотр пользователей с их ролями
SELECT 
    u.id,
    u.full_name,
    u.phone_number,
    u.email,
    u.created_at,
    u.balance,
    u.points,
    u.managed_club_id,
    STRING_AGG(r.name, ', ') AS roles
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
WHERE u.is_deleted = FALSE
GROUP BY u.id, u.full_name, u.phone_number, u.email, u.created_at, u.balance, u.points, u.managed_club_id
ORDER BY u.created_at DESC;

-- Поиск пользователя по email или телефону
SELECT 
    id,
    full_name,
    phone_number,
    email,
    created_at,
    balance,
    points,
    managed_club_id
FROM users
WHERE (email = 'khalil_jon@mail.ru' OR phone_number = '87021531092')
  AND is_deleted = FALSE;

-- Проверка суперадмина
SELECT 
    u.id,
    u.full_name,
    u.phone_number,
    u.email,
    u.created_at,
    r.name AS role_name,
    ur.assigned_at
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE r.name = 'SuperAdmin'
  AND u.is_deleted = FALSE;

-- Статистика пользователей по ролям
SELECT 
    r.name AS role_name,
    COUNT(ur.user_id) AS user_count
FROM roles r
LEFT JOIN user_roles ur ON r.id = ur.role_id
LEFT JOIN users u ON ur.user_id = u.id AND u.is_deleted = FALSE
GROUP BY r.id, r.name
ORDER BY user_count DESC;

-- Пользователи без ролей
SELECT 
    u.id,
    u.full_name,
    u.phone_number,
    u.email,
    u.created_at
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE ur.user_id IS NULL
  AND u.is_deleted = FALSE;

-- Менеджеры клубов
SELECT 
    u.id,
    u.full_name,
    u.phone_number,
    u.email,
    c.name AS managed_club_name,
    r.name AS role_name
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
LEFT JOIN clubs c ON u.managed_club_id = c.id
WHERE r.name IN ('Manager', 'Admin')
  AND u.is_deleted = FALSE;
