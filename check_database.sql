-- Проверка состояния базы данных BookHub

-- Проверяем существование таблицы roles
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'roles'
) as roles_table_exists;

-- Проверяем структуру таблицы roles
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'roles' 
ORDER BY ordinal_position;

-- Проверяем данные в таблице roles
SELECT id, name, description, is_active, created_at, permissions_json
FROM roles;

-- Проверяем количество записей
SELECT COUNT(*) as total_roles FROM roles; 