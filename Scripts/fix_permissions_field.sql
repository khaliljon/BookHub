-- Добавление поля permissions_json в таблицу roles
-- Этот скрипт исправляет ошибку 500 при запросе к API платежей

-- Добавляем поле permissions_json если его нет
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'roles' AND column_name = 'permissions_json'
    ) THEN
        ALTER TABLE roles ADD COLUMN permissions_json jsonb;
        RAISE NOTICE 'Поле permissions_json добавлено в таблицу roles';
    ELSE
        RAISE NOTICE 'Поле permissions_json уже существует';
    END IF;
END $$;

-- Проверяем структуру таблицы
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'roles' 
ORDER BY ordinal_position;

-- Показываем текущие роли
SELECT id, name, description, permissions_json FROM roles; 