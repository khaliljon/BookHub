-- Быстрое удаление ролей и связей
-- Запускать перед setup_database.sql

-- Удаляем связи пользователей с ролями
DELETE FROM user_roles WHERE role_id IN (
    SELECT id FROM roles WHERE name IN ('SuperAdmin', 'Admin', 'Manager', 'User')
);

-- Удаляем роли
DELETE FROM roles WHERE name IN ('SuperAdmin', 'Admin', 'Manager', 'User');

-- Проверяем результат
SELECT 'Роли удалены. Текущие роли в системе:' AS status;
SELECT COUNT(*) as remaining_roles FROM roles;
