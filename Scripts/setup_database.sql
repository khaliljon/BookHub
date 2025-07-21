-- =====================================================
-- SETUP DATABASE SCRIPT FOR OYNA API
-- =====================================================

-- =====================================================
-- 1. CLEANUP - Удаление старых объектов
-- =====================================================

-- Удаление таблиц (в правильном порядке - сначала зависимые)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS club_photos CASCADE;
DROP TABLE IF EXISTS computer_specs CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS tariffs CASCADE;
DROP TABLE IF EXISTS seats CASCADE;
DROP TABLE IF EXISTS halls CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;      -- users зависит от clubs (managed_club_id)
DROP TABLE IF EXISTS clubs CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- Удаление функций
DROP FUNCTION IF EXISTS log_audit() CASCADE;
DROP FUNCTION IF EXISTS set_paid_at() CASCADE;
DROP FUNCTION IF EXISTS delete_old_canceled_bookings(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS get_booking_count(INTEGER, DATE, DATE) CASCADE;
DROP FUNCTION IF EXISTS get_daily_income(INTEGER, DATE) CASCADE;
DROP FUNCTION IF EXISTS is_seat_available(INTEGER, DATE, TIME, TIME) CASCADE;
DROP FUNCTION IF EXISTS get_payment_stats() CASCADE;
DROP FUNCTION IF EXISTS cleanup_old_audit_logs() CASCADE;
DROP FUNCTION IF EXISTS get_club_stats(DATE, DATE) CASCADE;
DROP FUNCTION IF EXISTS get_hall_load_by_date(DATE) CASCADE;
DROP FUNCTION IF EXISTS get_club_monthly_income(DATE, DATE) CASCADE;
DROP FUNCTION IF EXISTS get_top_active_users(DATE, DATE, INTEGER) CASCADE;

-- Удаление представлений
DROP VIEW IF EXISTS view_active_users CASCADE;
DROP VIEW IF EXISTS view_active_clubs CASCADE;
DROP VIEW IF EXISTS view_active_halls CASCADE;
DROP VIEW IF EXISTS view_active_seats CASCADE;
DROP VIEW IF EXISTS view_active_bookings CASCADE;
DROP VIEW IF EXISTS view_payments_summary CASCADE;

-- Удаление хранимых процедур
DROP PROCEDURE IF EXISTS complete_booking(INTEGER) CASCADE;
DROP PROCEDURE IF EXISTS cancel_booking(INTEGER) CASCADE;
DROP PROCEDURE IF EXISTS process_booking_batch(INTEGER[]) CASCADE;

-- Удаление ролей (если существуют)
DROP ROLE IF EXISTS app_user;
DROP ROLE IF EXISTS admin_user;

-- =====================================================
-- 2. TABLE CREATION - Создание таблиц
-- =====================================================

-- Таблица ролей (создаем первой, так как на неё ссылается user_roles)
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица клубов (создаем перед users, так как на неё будет ссылаться managed_club_id)
CREATE TABLE clubs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL DEFAULT 'Караганда',
    address VARCHAR(255) NOT NULL,
    description TEXT,
    phone_number VARCHAR(20),
    email VARCHAR(255),
    opening_hours VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE    -- Soft delete
);

-- Таблица пользователей (создаем после clubs для внешнего ключа managed_club_id)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    balance NUMERIC(10, 2) DEFAULT 0,
    points INTEGER DEFAULT 0,            -- Бонусные баллы
    is_deleted BOOLEAN DEFAULT FALSE,    -- Soft delete
    managed_club_id INTEGER REFERENCES clubs(id) ON DELETE SET NULL  -- Внешний ключ сразу при создании
);

-- Связь пользователей и ролей (многие ко многим)
CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, role_id)
);

-- Залы внутри клуба
CREATE TABLE halls (
    id SERIAL PRIMARY KEY,
    club_id INTEGER REFERENCES clubs(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE    -- Soft delete
);

-- Места (компьютеры)
CREATE TABLE seats (
    id SERIAL PRIMARY KEY,
    hall_id INTEGER REFERENCES halls(id) ON DELETE CASCADE,
    seat_number VARCHAR(50) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'работает',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE,   -- Soft delete
    CONSTRAINT unique_seat_per_hall UNIQUE (hall_id, seat_number)
);

-- Тарифы
CREATE TABLE tariffs (
    id SERIAL PRIMARY KEY,
    club_id INTEGER REFERENCES clubs(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price_per_hour NUMERIC(10, 2) NOT NULL,
    is_night_tariff BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Бронирования
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    seat_id INTEGER REFERENCES seats(id) ON DELETE CASCADE,
    tariff_id INTEGER REFERENCES tariffs(id),
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'активно',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT chk_time_range CHECK (end_time > start_time)
);

-- Платежи
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'Kaspi',
    payment_status VARCHAR(50) DEFAULT 'ожидает',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    paid_at TIMESTAMP,
    CONSTRAINT chk_positive_amount CHECK (amount >= 0)
);

-- Логи аудита
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,           
    action TEXT NOT NULL,      
    table_name TEXT NOT NULL,  
    record_id INTEGER,         
    created_at TIMESTAMP DEFAULT NOW() 
);

-- Описание компьютеров
CREATE TABLE computer_specs (
    id SERIAL PRIMARY KEY,
    seat_id INTEGER REFERENCES seats(id) ON DELETE CASCADE,
    cpu VARCHAR(100),
    gpu VARCHAR(100),
    ram VARCHAR(50),
    monitor VARCHAR(100),
    peripherals TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Фото клубов
CREATE TABLE club_photos (
    id SERIAL PRIMARY KEY,
    club_id INTEGER REFERENCES clubs(id) ON DELETE CASCADE,
    photo_url VARCHAR(255) NOT NULL,
    description TEXT,
    uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Уведомления
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 3. CORE FUNCTIONS - Основные функции
-- =====================================================

-- Функция аудита (исправленная версия)
CREATE OR REPLACE FUNCTION log_audit()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, created_at)
    VALUES (
        NULL,
        TG_OP || ' в таблице ' || TG_TABLE_NAME,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id), -- Исправлено: учитываем DELETE операции
        NOW() -- Исправлено: добавили created_at
    );
    RETURN COALESCE(NEW, OLD); -- Исправлено: возвращаем правильное значение
END;
$$ LANGUAGE plpgsql;

-- Функция автоматической установки paid_at
CREATE OR REPLACE FUNCTION set_paid_at()
RETURNS TRIGGER AS $$
BEGIN
    -- Возможные статусы: 'ожидает', 'успешно', 'отклонено', 'возврат'
    IF (NEW.payment_status = 'успешно' OR NEW.payment_status = 'Успешно') 
       AND NEW.paid_at IS NULL THEN
        NEW.paid_at := NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 3. CORE FUNCTIONS - Основные функции
-- =====================================================

-- Проверка доступности места (исправленная версия)
CREATE OR REPLACE FUNCTION is_seat_available(
    p_seat_id INTEGER, 
    p_date DATE, 
    p_start TIME, 
    p_end TIME
)
RETURNS BOOLEAN AS $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM bookings
        WHERE seat_id = p_seat_id
          AND date = p_date
          AND status = 'активно'
          AND (
              (p_start >= start_time AND p_start < end_time) OR
              (p_end > start_time AND p_end <= end_time) OR
              (p_start <= start_time AND p_end >= end_time)
          )
    ) THEN
        RETURN FALSE;
    ELSE
        RETURN TRUE;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Получение количества бронирований
CREATE OR REPLACE FUNCTION get_booking_count(
    p_club_id INTEGER, 
    p_start_date DATE, 
    p_end_date DATE
)
RETURNS INTEGER AS $$
DECLARE
    cnt INTEGER := 0;
BEGIN
    SELECT COUNT(*)
    INTO cnt
    FROM bookings b
    JOIN seats s ON b.seat_id = s.id
    JOIN halls h ON s.hall_id = h.id
    WHERE h.club_id = p_club_id
      AND b.date BETWEEN p_start_date AND p_end_date
      AND b.status = 'активно';
    RETURN cnt;
END;
$$ LANGUAGE plpgsql;

-- Получение дневного дохода клуба
CREATE OR REPLACE FUNCTION get_daily_income(
    p_club_id INTEGER, 
    p_date DATE
)
RETURNS NUMERIC AS $$
DECLARE
    total NUMERIC := 0;
BEGIN
    SELECT COALESCE(SUM(p.amount), 0)
    INTO total
    FROM payments p
    JOIN bookings b ON p.booking_id = b.id
    JOIN seats s ON b.seat_id = s.id
    JOIN halls h ON s.hall_id = h.id
    JOIN clubs c ON h.club_id = c.id
    WHERE c.id = p_club_id
      AND b.date = p_date
      AND p.payment_status = 'успешно';
    RETURN total;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 4. BUSINESS FUNCTIONS - Бизнес-логика
-- =====================================================

-- Удаление старых отмененных бронирований
CREATE OR REPLACE FUNCTION delete_old_canceled_bookings(p_days INTEGER)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM bookings
    WHERE status = 'отменено'
      AND created_at < NOW() - INTERVAL '1 day' * p_days; -- Исправлено: используем created_at
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count; -- Возвращаем количество удаленных записей
END;
$$ LANGUAGE plpgsql;

-- Очистка старых записей аудита
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs(p_days INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM audit_logs 
    WHERE created_at < NOW() - INTERVAL '1 day' * p_days;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 5. MAINTENANCE FUNCTIONS - Функции обслуживания
-- =====================================================

-- Статистика платежей
CREATE OR REPLACE FUNCTION get_payment_stats()
RETURNS TABLE (
    status TEXT,
    count BIGINT,
    total_amount NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.payment_status,
        COUNT(*),
        COALESCE(SUM(p.amount), 0)
    FROM payments p
    GROUP BY p.payment_status
    ORDER BY COUNT(*) DESC;
END;
$$ LANGUAGE plpgsql;

-- Статистика по клубам
CREATE OR REPLACE FUNCTION get_club_stats(p_start_date DATE, p_end_date DATE)
RETURNS TABLE (
    club_name TEXT,
    total_bookings BIGINT,
    total_income NUMERIC,
    avg_booking_value NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.name,
        COUNT(b.id),
        COALESCE(SUM(p.amount), 0),
        COALESCE(AVG(p.amount), 0)
    FROM clubs c
    LEFT JOIN halls h ON c.id = h.club_id
    LEFT JOIN seats s ON h.id = s.hall_id
    LEFT JOIN bookings b ON s.id = b.seat_id 
        AND b.date BETWEEN p_start_date AND p_end_date
        AND b.status = 'активно'
    LEFT JOIN payments p ON b.id = p.booking_id 
        AND p.payment_status = 'успешно'
    GROUP BY c.id, c.name
    ORDER BY total_income DESC;
END;
$$ LANGUAGE plpgsql;

-- Загрузка по залам за конкретный день
CREATE OR REPLACE FUNCTION get_hall_load_by_date(p_date DATE)
RETURNS TABLE (
    hall_id INTEGER,
    hall_name TEXT,
    active_bookings_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        h.id,
        h.name,
        COUNT(b.id)
    FROM halls h
    LEFT JOIN seats s ON s.hall_id = h.id
    LEFT JOIN bookings b ON b.seat_id = s.id 
        AND b.date = p_date
        AND b.status = 'активно'
    GROUP BY h.id, h.name
    ORDER BY COUNT(b.id) DESC;
END;
$$ LANGUAGE plpgsql;

-- Доходы клубов за месяц
CREATE OR REPLACE FUNCTION get_club_monthly_income(p_start_date DATE, p_end_date DATE)
RETURNS TABLE (
    club_id INTEGER,
    club_name TEXT,
    total_income NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.name,
        COALESCE(SUM(p.amount), 0)
    FROM clubs c
    JOIN halls h ON h.club_id = c.id
    JOIN seats s ON s.hall_id = h.id
    JOIN bookings b ON b.seat_id = s.id
    JOIN payments p ON p.booking_id = b.id
    WHERE p.payment_status = 'успешно'
      AND b.date BETWEEN p_start_date AND p_end_date
    GROUP BY c.id, c.name
    ORDER BY COALESCE(SUM(p.amount), 0) DESC;
END;
$$ LANGUAGE plpgsql;

-- Топ активных пользователей за период
CREATE OR REPLACE FUNCTION get_top_active_users(
    p_start_date DATE, 
    p_end_date DATE, 
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    user_id INTEGER,
    full_name TEXT,
    bookings_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.full_name,
        COUNT(b.id)
    FROM users u
    JOIN bookings b ON b.user_id = u.id
    WHERE b.date BETWEEN p_start_date AND p_end_date
      AND b.status = 'активно'
    GROUP BY u.id, u.full_name
    ORDER BY COUNT(b.id) DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- ===============================
-- AI ANALYTICS ENGINE (ВСТРОЕННЫЕ ФУНКЦИИ)
-- ===============================

-- AI функция сегментации клиентов
CREATE OR REPLACE FUNCTION ai_customer_segmentation()
RETURNS TABLE (
    user_id INTEGER,
    full_name TEXT,
    segment TEXT,
    ai_score NUMERIC(5,2),
    clv_predicted NUMERIC(10,2),
    churn_risk NUMERIC(5,2),
    upsell_score NUMERIC(5,2),
    total_spent NUMERIC(10,2),
    visit_frequency NUMERIC(5,2),
    avg_session_duration NUMERIC(5,2),
    favorite_game TEXT,
    recommendations TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    WITH user_stats AS (
        SELECT 
            u.id as user_id,
            u.full_name,
            COUNT(DISTINCT b.id) as total_bookings,
            COALESCE(SUM(p.amount), 0) as total_spent,
            AVG(EXTRACT(EPOCH FROM (b.end_time - b.start_time))/3600.0) as avg_session_hours,
            COUNT(DISTINCT DATE(b.date)) as unique_visit_days,
            MAX(b.date) as last_visit,
            AVG(p.amount) as avg_spending
        FROM users u
        LEFT JOIN bookings b ON u.id = b.user_id AND b.status = 'активно'
        LEFT JOIN payments p ON b.id = p.booking_id AND p.payment_status = 'успешно'
        WHERE u.is_deleted = false
        GROUP BY u.id, u.full_name
    ),
    ai_scores AS (
        SELECT 
            user_id,
            full_name,
            total_spent,
            -- AI Сегментация на основе поведения
            CASE 
                WHEN total_spent > 20000 AND avg_session_hours > 3 THEN 'VIP Геймер'
                WHEN total_bookings > 15 AND unique_visit_days > 10 THEN 'Активный Игрок'
                WHEN total_bookings BETWEEN 5 AND 15 THEN 'Случайный Посетитель'
                WHEN CURRENT_DATE - last_visit > 30 OR total_bookings < 3 THEN 'Группа Риска'
                ELSE 'Новичок'
            END as segment,
            -- AI Score (0-100)
            LEAST(100, GREATEST(0, 
                (total_spent / 1000.0 * 30) + 
                (total_bookings * 2) + 
                (unique_visit_days * 1.5) + 
                (avg_session_hours * 5) +
                (CASE WHEN CURRENT_DATE - last_visit <= 7 THEN 20 ELSE 0 END)
            ))::NUMERIC(5,2) as ai_score,
            -- CLV Prediction (Customer Lifetime Value)
            (total_spent * 1.5 + avg_spending * 12)::NUMERIC(10,2) as clv_predicted,
            -- Churn Risk (0-100)
            LEAST(100, GREATEST(0,
                (EXTRACT(DAY FROM CURRENT_DATE - last_visit) * 2) +
                (CASE WHEN total_bookings < 3 THEN 30 ELSE 0 END) +
                (CASE WHEN avg_spending < 1000 THEN 20 ELSE 0 END)
            ))::NUMERIC(5,2) as churn_risk,
            -- Upsell Score (0-100)
            LEAST(100, GREATEST(0,
                (avg_session_hours * 15) +
                (unique_visit_days * 2) +
                (CASE WHEN total_spent > 5000 THEN 25 ELSE 0 END) +
                (CASE WHEN CURRENT_DATE - last_visit <= 3 THEN 20 ELSE 0 END)
            ))::NUMERIC(5,2) as upsell_score,
            avg_session_hours,
            unique_visit_days,
            total_bookings
        FROM user_stats
    )
    SELECT 
        a.user_id,
        a.full_name,
        a.segment,
        a.ai_score,
        a.clv_predicted,
        a.churn_risk,
        a.upsell_score,
        a.total_spent,
        a.unique_visit_days::NUMERIC(5,2) as visit_frequency,
        a.avg_session_hours::NUMERIC(5,2) as avg_session_duration,
        NULL::TEXT as favorite_game,
        ARRAY['Персональная скидка', 'Турнир', 'VIP предложение']::TEXT[] as recommendations
    FROM ai_scores a;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 6. REPORTING FUNCTIONS - Функции отчетности
-- =====================================================

-- Процедура завершения бронирования
CREATE OR REPLACE PROCEDURE complete_booking(p_booking_id INTEGER)
LANGUAGE plpgsql
AS $$
DECLARE
    booking_exists BOOLEAN := FALSE;
BEGIN
    -- Проверяем существование бронирования
    SELECT EXISTS(
        SELECT 1 FROM bookings 
        WHERE id = p_booking_id AND status = 'активно'
    ) INTO booking_exists;
    
    IF NOT booking_exists THEN
        RAISE EXCEPTION 'Бронирование с ID % не найдено или уже завершено', p_booking_id;
    END IF;
    
    -- Обновляем статус бронирования
    UPDATE bookings
    SET status = 'завершено',
        updated_at = NOW()
    WHERE id = p_booking_id;
    
    RAISE NOTICE 'Бронирование % успешно завершено', p_booking_id;
END;
$$;

-- Процедура отмены бронирования с возвратом платежа
CREATE OR REPLACE PROCEDURE cancel_booking(p_booking_id INTEGER)
LANGUAGE plpgsql
AS $$
DECLARE
    booking_exists BOOLEAN := FALSE;
    payment_count INTEGER := 0;
BEGIN
    -- Проверяем существование активного бронирования
    SELECT EXISTS(
        SELECT 1 FROM bookings 
        WHERE id = p_booking_id AND status = 'активно'
    ) INTO booking_exists;
    
    IF NOT booking_exists THEN
        RAISE EXCEPTION 'Активное бронирование с ID % не найдено', p_booking_id;
    END IF;
    
    -- Отменяем бронирование
    UPDATE bookings
    SET status = 'отменено',
        updated_at = NOW()
    WHERE id = p_booking_id;
    
    -- Возвращаем платежи
    UPDATE payments
    SET payment_status = 'возврат',
        updated_at = NOW()
    WHERE booking_id = p_booking_id
      AND payment_status = 'успешно';
    
    GET DIAGNOSTICS payment_count = ROW_COUNT;
    
    RAISE NOTICE 'Бронирование % отменено, возвращено платежей: %', p_booking_id, payment_count;
END;
$$;

-- Процедура массовой обработки бронирований
CREATE OR REPLACE PROCEDURE process_booking_batch(
    p_booking_ids INTEGER[],
    p_action TEXT -- 'complete' или 'cancel'
)
LANGUAGE plpgsql
AS $$
DECLARE
    booking_id INTEGER;
    processed_count INTEGER := 0;
    error_count INTEGER := 0;
BEGIN
    -- Проверяем корректность действия
    IF p_action NOT IN ('complete', 'cancel') THEN
        RAISE EXCEPTION 'Недопустимое действие: %. Используйте "complete" или "cancel"', p_action;
    END IF;
    
    -- Обрабатываем каждое бронирование
    FOREACH booking_id IN ARRAY p_booking_ids
    LOOP
        BEGIN
            IF p_action = 'complete' THEN
                CALL complete_booking(booking_id);
            ELSIF p_action = 'cancel' THEN
                CALL cancel_booking(booking_id);
            END IF;
            
            processed_count := processed_count + 1;
            
        EXCEPTION WHEN OTHERS THEN
            error_count := error_count + 1;
            RAISE WARNING 'Ошибка при обработке бронирования %: %', booking_id, SQLERRM;
        END;
    END LOOP;
    
    RAISE NOTICE 'Обработано: %, ошибок: %', processed_count, error_count;
END;
$$;

-- =====================================================
-- 7. STORED PROCEDURES - Хранимые процедуры
-- =====================================================

-- Представление активных пользователей
CREATE OR REPLACE VIEW view_active_users AS
SELECT 
    id,
    full_name,
    email,
    phone_number,
    created_at,
    updated_at
FROM users
WHERE is_deleted = FALSE;

-- Представление активных клубов
CREATE OR REPLACE VIEW view_active_clubs AS
SELECT 
    id,
    name,
    address,
    phone_number,
    email,
    created_at,
    updated_at
FROM clubs
WHERE is_deleted = FALSE;

-- Представление активных залов
CREATE OR REPLACE VIEW view_active_halls AS
SELECT 
    id,
    name,
    club_id,
    created_at,
    updated_at
FROM halls
WHERE is_deleted = FALSE;

-- Представление активных мест
CREATE OR REPLACE VIEW view_active_seats AS
SELECT 
    id,
    seat_number,
    hall_id,
    created_at,
    updated_at
FROM seats
WHERE is_deleted = FALSE;

-- Представление активных бронирований с детальной информацией
CREATE OR REPLACE VIEW view_active_bookings AS
SELECT 
    b.id AS booking_id,
    u.full_name AS user_name,
    u.email AS user_email,
    c.name AS club_name,
    h.name AS hall_name,
    s.seat_number,
    b.date,
    b.start_time,
    b.end_time,
    b.status,
    b.created_at AS booking_created_at
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN seats s ON b.seat_id = s.id
JOIN halls h ON s.hall_id = h.id
JOIN clubs c ON h.club_id = c.id
WHERE b.status = 'активно';

-- Представление сводки по платежам
CREATE OR REPLACE VIEW view_payments_summary AS
SELECT
    p.id AS payment_id,
    u.full_name AS user_name,
    u.email AS user_email,
    c.name AS club_name,
    h.name AS hall_name,
    s.seat_number,
    b.date AS booking_date,
    p.amount,
    p.payment_status,
    p.payment_method,
    p.created_at AS payment_created_at,
    p.paid_at
FROM payments p
JOIN bookings b ON p.booking_id = b.id
JOIN users u ON b.user_id = u.id
JOIN seats s ON b.seat_id = s.id
JOIN halls h ON s.hall_id = h.id
JOIN clubs c ON h.club_id = c.id;

-- =====================================================
-- 8. VIEWS - Представления
-- =====================================================

-- Триггеры аудита
CREATE OR REPLACE TRIGGER tr_audit_bookings
    AFTER UPDATE OR DELETE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION log_audit();

CREATE OR REPLACE TRIGGER tr_audit_users
    AFTER UPDATE OR DELETE ON users
    FOR EACH ROW
    EXECUTE FUNCTION log_audit();

CREATE OR REPLACE TRIGGER tr_audit_clubs
    AFTER UPDATE OR DELETE ON clubs
    FOR EACH ROW
    EXECUTE FUNCTION log_audit();

CREATE OR REPLACE TRIGGER tr_audit_halls
    AFTER UPDATE OR DELETE ON halls
    FOR EACH ROW
    EXECUTE FUNCTION log_audit();

CREATE OR REPLACE TRIGGER tr_audit_seats
    AFTER UPDATE OR DELETE ON seats
    FOR EACH ROW
    EXECUTE FUNCTION log_audit();

-- Триггер автоматической установки paid_at
CREATE OR REPLACE TRIGGER tr_set_paid_at
    BEFORE INSERT OR UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION set_paid_at();

-- =====================================================
-- 9. TRIGGERS - Триггеры
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_payments_paid_at ON payments(paid_at);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_bookings_date_status ON bookings(date, status);
CREATE INDEX IF NOT EXISTS idx_bookings_seat_date ON bookings(seat_id, date);

-- =====================================================
-- 10. INDEXES - Индексы для оптимизации
-- =====================================================

-- Создание ролей пользователей
CREATE ROLE IF NOT EXISTS app_user LOGIN PASSWORD 'StrongAppPassHere';
CREATE ROLE IF NOT EXISTS admin_user LOGIN PASSWORD 'StrongAdminPassHere';

-- Отзыв всех существующих прав (очистка)
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM app_user, admin_user;
REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM app_user, admin_user;
REVOKE ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public FROM app_user, admin_user;
REVOKE ALL PRIVILEGES ON ALL PROCEDURES IN SCHEMA public FROM app_user, admin_user;
REVOKE USAGE ON SCHEMA public FROM app_user, admin_user;

-- Предоставление доступа к схеме public
GRANT USAGE ON SCHEMA public TO app_user, admin_user;

-- Права для администратора (полный доступ)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO admin_user;
GRANT ALL PRIVILEGES ON ALL PROCEDURES IN SCHEMA public TO admin_user;

-- Права для приложения (ограниченный доступ)

-- Пользователи: регистрация, обновление профиля
GRANT SELECT, INSERT, UPDATE ON users TO app_user;

-- Роли: только просмотр
GRANT SELECT ON roles TO app_user;

-- Связь пользователей и ролей: просмотр и изменение
GRANT SELECT, INSERT, UPDATE, DELETE ON user_roles TO app_user;

-- Бронирования: создание, просмотр, обновление
GRANT SELECT, INSERT, UPDATE ON bookings TO app_user;

-- Платежи: создание, просмотр, обновление
GRANT SELECT, INSERT, UPDATE ON payments TO app_user;

-- Места: только просмотр
GRANT SELECT ON seats TO app_user;

-- Залы: только просмотр  
GRANT SELECT ON halls TO app_user;

-- Клубы: только просмотр
GRANT SELECT ON clubs TO app_user;

-- Тарифы: только просмотр
GRANT SELECT ON tariffs TO app_user;

-- Уведомления: создание, просмотр, обновление
GRANT SELECT, INSERT, UPDATE ON notifications TO app_user;

-- Логи аудита: только просмотр (для отладки)
GRANT SELECT ON audit_logs TO app_user;

-- Представления: только просмотр
GRANT SELECT ON view_active_users TO app_user;
GRANT SELECT ON view_active_clubs TO app_user;
GRANT SELECT ON view_active_halls TO app_user;
GRANT SELECT ON view_active_seats TO app_user;
GRANT SELECT ON view_active_bookings TO app_user;
GRANT SELECT ON view_payments_summary TO app_user;

-- Функции: выполнение разрешенных функций
GRANT EXECUTE ON FUNCTION is_seat_available(INTEGER, DATE, TIME, TIME) TO app_user;
GRANT EXECUTE ON FUNCTION get_booking_count(INTEGER, DATE, DATE) TO app_user;
GRANT EXECUTE ON FUNCTION get_daily_income(INTEGER, DATE) TO app_user;

-- Функции отчетности (для менеджеров)
GRANT EXECUTE ON FUNCTION get_payment_stats() TO app_user;
GRANT EXECUTE ON FUNCTION get_hall_load_by_date(DATE) TO app_user;
GRANT EXECUTE ON FUNCTION get_club_monthly_income(DATE, DATE) TO app_user;
GRANT EXECUTE ON FUNCTION get_top_active_users(DATE, DATE, INTEGER) TO app_user;
GRANT EXECUTE ON FUNCTION get_club_stats(DATE, DATE) TO app_user;

-- Хранимые процедуры: выполнение бизнес-операций
GRANT EXECUTE ON PROCEDURE complete_booking(INTEGER) TO app_user;
GRANT EXECUTE ON PROCEDURE cancel_booking(INTEGER) TO app_user;

-- Последовательности (для автоинкремента)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;

-- Явный запрет на удаление для app_user (для безопасности)
REVOKE DELETE ON ALL TABLES IN SCHEMA public FROM app_user;

-- Комментарии к ролям
COMMENT ON ROLE app_user IS 'Роль для приложения - ограниченные права доступа';
COMMENT ON ROLE admin_user IS 'Роль администратора - полные права доступа';

/*
АРХИТЕКТУРА БЕЗОПАСНОСТИ:

=== УРОВЕНЬ 1: РОЛИ POSTGRESQL (Доступ к БД) ===
app_user    - Подключение приложения к базе (ограниченные права)
admin_user  - Подключение DBA/DevOps для администрирования

=== УРОВЕНЬ 2: РОЛИ ПРИЛОЖЕНИЯ (Бизнес-логика) ===
Admin       - Полный доступ к функциям приложения
Manager     - Управление клубом, отчеты, модерация
User        - Бронирование, платежи, профиль

=== КАК ЭТО РАБОТАЕТ ===
1. Приложение подключается к БД через app_user
2. Внутри приложения проверяются роли из таблицы roles
3. AuthController проверяет [Authorize(Roles = "Admin,Manager")]
4. Бизнес-логика основана на roles, а не на PostgreSQL ролях

=== ПРЕИМУЩЕСТВА ===
- Безопасность: разделение доступа к БД и бизнес-логики
- Гибкость: можно легко добавлять новые роли приложения
- Масштабируемость: одна роль БД для всего приложения
- Совместимость: работает с любой ORM (Entity Framework, etc.)
*/

-- =====================================================
-- 11. SECURITY & PERMISSIONS - Безопасность и права доступа
-- =====================================================

-- Создание ролей приложения (бизнес-логика)
INSERT INTO roles (name, description, is_active) 
VALUES 
    ('SuperAdmin', 'Суперадминистратор - полный доступ ко всем функциям системы, управление пользователями и ролями', true),
    ('Admin', 'Администратор - управление клубами, залами, местами, тарифами и отчеты', true),
    ('Manager', 'Менеджер клуба - управление бронированиями, платежами и отчеты по своему клубу', true),
    ('User', 'Обычный пользователь - бронирование мест, просмотр своего профиля и платежей', true)
ON CONFLICT (name) DO NOTHING;

-- Создание нового суперадминистратора системы
INSERT INTO users (full_name, phone_number, email, password_hash, created_at, updated_at, is_deleted) 
VALUES (
    'Суперадмин Khalych',                      -- Имя администратора
    '87003004050',                             -- Телефон
    'khalych.kz@gmail.com',                    -- Email администратора
    '$2a$12$.VN3Zfr1RPvvWiR8nKrOp.Wr9X3yLS/MoFRe0/T8K4eM4PMjO8F8.', -- BCrypt хеш для "Burbik27092004"
    NOW(),
    NOW(),
    false
) ON CONFLICT (phone_number) DO NOTHING;

-- Назначение роли SuperAdmin новому пользователю
DO $$
DECLARE
    khalych_user_id INTEGER;
    superadmin_role_id INTEGER;
BEGIN
    -- Получаем ID нового суперадмина
    SELECT id INTO khalych_user_id FROM users WHERE email = 'khalych.kz@gmail.com';
    
    -- Получаем ID роли SuperAdmin
    SELECT id INTO superadmin_role_id FROM roles WHERE name = 'SuperAdmin';
    
    -- Назначаем роль, если все найдено
    IF khalych_user_id IS NOT NULL AND superadmin_role_id IS NOT NULL THEN
        INSERT INTO user_roles (user_id, role_id, assigned_at)
        VALUES (khalych_user_id, superadmin_role_id, NOW())
        ON CONFLICT (user_id, role_id) DO NOTHING;
        
        RAISE NOTICE 'SuperAdmin роль назначена пользователю khalych.kz@gmail.com (ID: %)', khalych_user_id;
    END IF;
END
$$;

-- =====================================================
-- 12. INITIAL DATA - Начальные данные
-- =====================================================

COMMENT ON TABLE audit_logs IS 'Логи изменений в системе';
COMMENT ON TABLE roles IS 'Роли пользователей';
COMMENT ON TABLE users IS 'Пользователи системы';
COMMENT ON TABLE payments IS 'Платежи за бронирования';
COMMENT ON TABLE bookings IS 'Бронирования мест';
COMMENT ON TABLE clubs IS 'Игровые клубы';
COMMENT ON TABLE halls IS 'Залы в клубах';
COMMENT ON TABLE seats IS 'Места в залах';

-- Комментарии к функциям отчетности
COMMENT ON FUNCTION get_hall_load_by_date(DATE) IS 'Получение загрузки залов за конкретный день';
COMMENT ON FUNCTION get_club_monthly_income(DATE, DATE) IS 'Получение доходов клубов за период';
COMMENT ON FUNCTION get_top_active_users(DATE, DATE, INTEGER) IS 'Получение топа активных пользователей';
COMMENT ON FUNCTION get_club_stats(DATE, DATE) IS 'Получение общей статистики по клубам';

-- Комментарии к представлениям
COMMENT ON VIEW view_active_users IS 'Активные (не удаленные) пользователи';
COMMENT ON VIEW view_active_clubs IS 'Активные (не удаленные) клубы';
COMMENT ON VIEW view_active_halls IS 'Активные (не удаленные) залы';
COMMENT ON VIEW view_active_seats IS 'Активные (не удаленные) места';
COMMENT ON VIEW view_active_bookings IS 'Детальная информация по активным бронированиям';
COMMENT ON VIEW view_payments_summary IS 'Сводная информация по всем платежам с деталями';

-- Комментарии к хранимым процедурам
COMMENT ON PROCEDURE complete_booking(INTEGER) IS 'Завершение активного бронирования';
COMMENT ON PROCEDURE cancel_booking(INTEGER) IS 'Отмена бронирования с возвратом платежа';
COMMENT ON PROCEDURE process_booking_batch(INTEGER[], TEXT) IS 'Массовая обработка бронирований';

/*
ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ ФУНКЦИЙ, ПРЕДСТАВЛЕНИЙ И ПРОЦЕДУР:

=== ОТЧЕТНЫЕ ФУНКЦИИ ===
1. Загрузка залов на сегодня:
   SELECT * FROM get_hall_load_by_date('2025-07-19');

2. Доходы клубов за июль:
   SELECT * FROM get_club_monthly_income('2025-07-01', '2025-07-31');

3. Топ-10 активных пользователей за месяц:
   SELECT * FROM get_top_active_users('2025-07-01', '2025-07-31', 10);

4. Общая статистика клубов за неделю:
   SELECT * FROM get_club_stats('2025-07-13', '2025-07-19');

5. Статистика платежей:
   SELECT * FROM get_payment_stats();

6. Очистка старых логов (старше 30 дней):
   SELECT cleanup_old_audit_logs(30);

=== ПРЕДСТАВЛЕНИЯ ===
7. Просмотр всех активных пользователей:
   SELECT * FROM view_active_users;

8. Активные бронирования с деталями:
   SELECT * FROM view_active_bookings WHERE club_name = 'Название клуба';

9. Сводка по платежам за сегодня:
   SELECT * FROM view_payments_summary WHERE DATE(payment_created_at) = CURRENT_DATE;

10. Поиск бронирований по пользователю:
    SELECT * FROM view_active_bookings WHERE user_name ILIKE '%Иван%';

=== ХРАНИМЫЕ ПРОЦЕДУРЫ ===
11. Завершение бронирования:
    CALL complete_booking(123);

12. Отмена бронирования с возвратом:
    CALL cancel_booking(456);

13. Массовое завершение бронирований:
    CALL process_booking_batch(ARRAY[123, 456, 789], 'complete');

14. Массовая отмена бронирований:
    CALL process_booking_batch(ARRAY[111, 222], 'cancel');

=== БЕЗОПАСНОСТЬ И ДОСТУП ===
15. Подключение от имени приложения:
    psql -h localhost -d oyna_db -U app_user

16. Подключение от имени администратора:
    psql -h localhost -d oyna_db -U admin_user

17. Проверка прав пользователя:
    SELECT grantee, privilege_type, table_name 
    FROM information_schema.role_table_grants 
    WHERE grantee = 'app_user';

18. Смена пароля пользователя:
    ALTER ROLE app_user PASSWORD 'NewSecurePassword';
*/

-- =====================================================
-- 13. DOCUMENTATION - Комментарии
-- =====================================================

-- =====================================================
-- 14. COMPLETION MESSAGE
-- =====================================================

SELECT 'База данных OynaApi успешно настроена!' AS status,
       'Функции: ' || 
       (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public' AND routine_type = 'FUNCTION') ||
       ', Процедуры: ' ||
       (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public' AND routine_type = 'PROCEDURE') ||
       ', Представления: ' ||
       (SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'public') ||
       ', Роли: app_user, admin_user созданы' AS objects_count;
