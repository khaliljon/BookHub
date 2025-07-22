-- =====================================================
-- VALIDATION SCRIPT FOR AI ANALYTICS ENGINE
-- Проверка соответствия AI функций с реальной схемой БД
-- =====================================================

-- Этот скрипт проверяет, что все таблицы и поля существуют
-- перед запуском AI функций

DO $$
DECLARE
    validation_errors TEXT := '';
    table_exists BOOLEAN;
    column_exists BOOLEAN;
BEGIN
    -- Проверяем основные таблицы
    RAISE NOTICE 'Checking table existence...';
    
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'users'
    ) INTO table_exists;
    IF NOT table_exists THEN
        validation_errors := validation_errors || 'Table "users" does not exist. ';
    END IF;
    
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'bookings'
    ) INTO table_exists;
    IF NOT table_exists THEN
        validation_errors := validation_errors || 'Table "bookings" does not exist. ';
    END IF;
    
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'payments'
    ) INTO table_exists;
    IF NOT table_exists THEN
        validation_errors := validation_errors || 'Table "payments" does not exist. ';
    END IF;
    
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'clubs'
    ) INTO table_exists;
    IF NOT table_exists THEN
        validation_errors := validation_errors || 'Table "clubs" does not exist. ';
    END IF;
    
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'halls'
    ) INTO table_exists;
    IF NOT table_exists THEN
        validation_errors := validation_errors || 'Table "halls" does not exist. ';
    END IF;
    
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'seats'
    ) INTO table_exists;
    IF NOT table_exists THEN
        validation_errors := validation_errors || 'Table "seats" does not exist. ';
    END IF;

    -- Проверяем ключевые поля в таблице users
    RAISE NOTICE 'Checking users table columns...';
    
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'id'
    ) INTO column_exists;
    IF NOT column_exists THEN
        validation_errors := validation_errors || 'Column "users.id" does not exist. ';
    END IF;
    
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'full_name'
    ) INTO column_exists;
    IF NOT column_exists THEN
        validation_errors := validation_errors || 'Column "users.full_name" does not exist. ';
    END IF;
    
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'is_deleted'
    ) INTO column_exists;
    IF NOT column_exists THEN
        validation_errors := validation_errors || 'Column "users.is_deleted" does not exist. ';
    END IF;

    -- Проверяем ключевые поля в таблице bookings
    RAISE NOTICE 'Checking bookings table columns...';
    
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'start_time'
    ) INTO column_exists;
    IF NOT column_exists THEN
        validation_errors := validation_errors || 'Column "bookings.start_time" does not exist. ';
    END IF;
    
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'end_time'
    ) INTO column_exists;
    IF NOT column_exists THEN
        validation_errors := validation_errors || 'Column "bookings.end_time" does not exist. ';
    END IF;
    
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'user_id'
    ) INTO column_exists;
    IF NOT column_exists THEN
        validation_errors := validation_errors || 'Column "bookings.user_id" does not exist. ';
    END IF;
    
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'status'
    ) INTO column_exists;
    IF NOT column_exists THEN
        validation_errors := validation_errors || 'Column "bookings.status" does not exist. ';
    END IF;
    
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'date'
    ) INTO column_exists;
    IF NOT column_exists THEN
        validation_errors := validation_errors || 'Column "bookings.date" does not exist. ';
    END IF;

    -- Проверяем ключевые поля в таблице payments
    RAISE NOTICE 'Checking payments table columns...';
    
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'payments' AND column_name = 'booking_id'
    ) INTO column_exists;
    IF NOT column_exists THEN
        validation_errors := validation_errors || 'Column "payments.booking_id" does not exist. ';
    END IF;
    
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'payments' AND column_name = 'amount'
    ) INTO column_exists;
    IF NOT column_exists THEN
        validation_errors := validation_errors || 'Column "payments.amount" does not exist. ';
    END IF;
    
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'payments' AND column_name = 'payment_status'
    ) INTO column_exists;
    IF NOT column_exists THEN
        validation_errors := validation_errors || 'Column "payments.payment_status" does not exist. ';
    END IF;

    -- Проверяем связи между таблицами
    RAISE NOTICE 'Checking foreign key relationships...';
    
    SELECT EXISTS (
        SELECT FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_name = 'bookings' 
        AND kcu.column_name = 'user_id'
    ) INTO column_exists;
    IF NOT column_exists THEN
        validation_errors := validation_errors || 'Foreign key "bookings.user_id -> users.id" does not exist. ';
    END IF;
    
    SELECT EXISTS (
        SELECT FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_name = 'payments' 
        AND kcu.column_name = 'booking_id'
    ) INTO column_exists;
    IF NOT column_exists THEN
        validation_errors := validation_errors || 'Foreign key "payments.booking_id -> bookings.id" does not exist. ';
    END IF;

    -- Результат проверки
    IF validation_errors = '' THEN
        RAISE NOTICE '✅ VALIDATION PASSED: All required tables and columns exist!';
        RAISE NOTICE 'AI Analytics Engine is ready to be deployed.';
    ELSE
        RAISE EXCEPTION '❌ VALIDATION FAILED: %', validation_errors;
    END IF;
END $$;

-- =====================================================
-- TEST AI FUNCTIONS WITH SAMPLE DATA
-- =====================================================

-- Проверяем, что AI функции работают (безопасный тест)
DO $$
BEGIN
    RAISE NOTICE 'Testing AI functions...';
    
    -- Тест функции ai_dashboard_summary
    PERFORM ai_dashboard_summary();
    RAISE NOTICE '✅ ai_dashboard_summary() - OK';
    
    -- Тест функции ai_customer_segmentation
    PERFORM ai_customer_segmentation();
    RAISE NOTICE '✅ ai_customer_segmentation() - OK';
    
    -- Тест функции ai_revenue_forecast
    PERFORM ai_revenue_forecast(NULL, 30);
    RAISE NOTICE '✅ ai_revenue_forecast() - OK';
    
    RAISE NOTICE '🎯 All AI functions are working correctly!';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION '❌ AI Function test failed: %', SQLERRM;
END $$;

-- =====================================================
-- PERFORMANCE CHECK
-- =====================================================

-- Проверяем производительность основных запросов
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM ai_dashboard_summary() LIMIT 5;

EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM ai_customer_segmentation() LIMIT 10;

-- Показываем статистику
SELECT 
    schemaname,
    tablename,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes,
    n_live_tup as live_rows,
    n_dead_tup as dead_rows
FROM pg_stat_user_tables 
WHERE tablename IN ('users', 'bookings', 'payments', 'clubs')
ORDER BY tablename;

RAISE NOTICE '🚀 AI Analytics Engine validation completed successfully!';
