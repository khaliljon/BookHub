-- =====================================================
-- ИСПРАВЛЕНИЕ ИМЕН СТОЛБЦОВ В ПРЕДСТАВЛЕНИЯХ И ФУНКЦИЯХ
-- =====================================================

-- Исправляем представление активных бронирований
DROP VIEW IF EXISTS view_active_bookings CASCADE;
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

-- Исправляем функцию проверки доступности места
DROP FUNCTION IF EXISTS is_seat_available(INTEGER, DATE, TIME, TIME) CASCADE;
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

-- Даем права на новое представление
GRANT SELECT ON view_active_bookings TO app_user;
GRANT EXECUTE ON FUNCTION is_seat_available(INTEGER, DATE, TIME, TIME) TO app_user;

SELECT 'Исправление завершено успешно!' AS status;
