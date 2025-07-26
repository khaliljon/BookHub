-- Исправление таблицы roles
-- Добавляем поле permissions_json если его нет
ALTER TABLE roles ADD COLUMN IF NOT EXISTS permissions_json jsonb;

-- Добавляем поле created_at если его нет
ALTER TABLE roles ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT NOW();

-- Обновляем существующие записи, устанавливая дату создания
UPDATE roles SET created_at = NOW() WHERE created_at IS NULL;

-- Проверяем результат
SELECT id, name, created_at, permissions_json FROM roles; 