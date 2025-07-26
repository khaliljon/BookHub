-- Применение миграции для добавления поля permissions_json в таблицу roles
-- Миграция: 20250726181028_AddPermissionsJsonColumn

-- Добавляем поле permissions_json типа jsonb
ALTER TABLE roles ADD COLUMN IF NOT EXISTS permissions_json jsonb;

-- Проверяем, что поле добавлено
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'roles' AND column_name = 'permissions_json';

-- Обновляем существующие роли, добавляя дату создания если её нет
UPDATE roles 
SET created_at = NOW() 
WHERE created_at IS NULL;

-- Проверяем структуру таблицы roles
\d roles; 