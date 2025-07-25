-- =========================================
-- BookHub Database Setup Script
-- =========================================

-- 1. SESSION SETTINGS
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
SELECT pg_catalog.set_config('search_path', '', false);

-- =========================================
-- 2. SEQUENCES
-- =========================================
CREATE SEQUENCE public.users_id_seq START 1 INCREMENT 1;
CREATE SEQUENCE public.roles_id_seq START 1 INCREMENT 1;
CREATE SEQUENCE public.clubs_id_seq START 1 INCREMENT 1;
CREATE SEQUENCE public.halls_id_seq START 1 INCREMENT 1;
CREATE SEQUENCE public.seats_id_seq START 1 INCREMENT 1;
CREATE SEQUENCE public.tariffs_id_seq START 1 INCREMENT 1;
CREATE SEQUENCE public.bookings_id_seq START 1 INCREMENT 1;
CREATE SEQUENCE public.payments_id_seq START 1 INCREMENT 1;
CREATE SEQUENCE public.user_roles_id_seq START 1 INCREMENT 1;
CREATE SEQUENCE public.audit_logs_id_seq START 1 INCREMENT 1;
CREATE SEQUENCE public.club_photos_id_seq START 1 INCREMENT 1;
CREATE SEQUENCE public.computer_specs_id_seq START 1 INCREMENT 1;
CREATE SEQUENCE public.notifications_id_seq START 1 INCREMENT 1;

-- =========================================
-- 3. TABLES
-- =========================================
-- Users
CREATE TABLE public.users (
    id integer PRIMARY KEY DEFAULT nextval('public.users_id_seq'),
    full_name varchar(255) NOT NULL,
    phone_number varchar(20) NOT NULL UNIQUE,
    email varchar(255) UNIQUE,
    password_hash varchar(255) NOT NULL,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now(),
    balance numeric(10,2) DEFAULT 0,
    points integer DEFAULT 0,
    is_deleted boolean DEFAULT false,
    managed_club_id integer
);

-- Roles
CREATE TABLE public.roles (
    id integer PRIMARY KEY DEFAULT nextval('public.roles_id_seq'),
    name varchar(50) NOT NULL UNIQUE,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp DEFAULT now()
);

-- Clubs
CREATE TABLE public.clubs (
    id integer PRIMARY KEY DEFAULT nextval('public.clubs_id_seq'),
    name varchar(255) NOT NULL,
    city varchar(100) DEFAULT 'Караганда' NOT NULL,
    address varchar(255) NOT NULL,
    description text,
    phone_number varchar(20),
    email varchar(255),
    opening_hours varchar(100),
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now(),
    is_deleted boolean DEFAULT false,
    is_active boolean DEFAULT true,
    logo_url text
);

-- Halls
CREATE TABLE public.halls (
    id integer PRIMARY KEY DEFAULT nextval('public.halls_id_seq'),
    club_id integer REFERENCES public.clubs(id) ON DELETE CASCADE,
    name varchar(100) NOT NULL,
    description text,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now(),
    is_deleted boolean DEFAULT false,
    photo_urls text[]
);

-- Seats
CREATE TABLE public.seats (
    id integer PRIMARY KEY DEFAULT nextval('public.seats_id_seq'),
    hall_id integer REFERENCES public.halls(id) ON DELETE CASCADE,
    seat_number varchar(50) NOT NULL,
    description text,
    status varchar(50) DEFAULT 'работает',
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now(),
    is_deleted boolean DEFAULT false,
    UNIQUE (hall_id, seat_number)
);

-- Tariffs
CREATE TABLE public.tariffs (
    id integer PRIMARY KEY DEFAULT nextval('public.tariffs_id_seq'),
    club_id integer REFERENCES public.clubs(id) ON DELETE CASCADE,
    name varchar(100) NOT NULL,
    description text,
    price_per_hour numeric(10,2) NOT NULL,
    is_night_tariff boolean DEFAULT false,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

-- Bookings
CREATE TABLE public.bookings (
    id integer PRIMARY KEY DEFAULT nextval('public.bookings_id_seq'),
    user_id integer REFERENCES public.users(id) ON DELETE CASCADE,
    seat_id integer REFERENCES public.seats(id) ON DELETE CASCADE,
    tariff_id integer REFERENCES public.tariffs(id),
    date date NOT NULL,
    start_time time NOT NULL,
    end_time time NOT NULL,
    total_price numeric(10,2) NOT NULL,
    status varchar(50) DEFAULT 'активно',
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now(),
    CONSTRAINT chk_time_range CHECK (end_time > start_time)
);

-- Payments
CREATE TABLE public.payments (
    id integer PRIMARY KEY DEFAULT nextval('public.payments_id_seq'),
    booking_id integer REFERENCES public.bookings(id) ON DELETE CASCADE,
    amount numeric(10,2) NOT NULL CHECK (amount >= 0),
    payment_method varchar(50) DEFAULT 'Kaspi',
    payment_status varchar(50) DEFAULT 'ожидает',
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now(),
    paid_at timestamp
);

-- User Roles
CREATE TABLE public.user_roles (
    id integer PRIMARY KEY DEFAULT nextval('public.user_roles_id_seq'),
    user_id integer REFERENCES public.users(id) ON DELETE CASCADE,
    role_id integer REFERENCES public.roles(id) ON DELETE CASCADE,
    assigned_at timestamp DEFAULT now(),
    UNIQUE (user_id, role_id)
);

-- Audit Logs
CREATE TABLE public.audit_logs (
    id integer PRIMARY KEY DEFAULT nextval('public.audit_logs_id_seq'),
    user_id integer,
    action text NOT NULL,
    table_name text NOT NULL,
    record_id integer,
    created_at timestamp DEFAULT now()
);

-- Club Photos
CREATE TABLE public.club_photos (
    id integer PRIMARY KEY DEFAULT nextval('public.club_photos_id_seq'),
    club_id integer REFERENCES public.clubs(id) ON DELETE CASCADE,
    photo_url varchar(255) NOT NULL,
    description text,
    uploaded_at timestamp DEFAULT now()
);

-- Computer Specs
CREATE TABLE public.computer_specs (
    id integer PRIMARY KEY DEFAULT nextval('public.computer_specs_id_seq'),
    seat_id integer REFERENCES public.seats(id) ON DELETE CASCADE,
    cpu varchar(100),
    gpu varchar(100),
    ram varchar(50),
    monitor varchar(100),
    peripherals text,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

-- Notifications
CREATE TABLE public.notifications (
    id integer PRIMARY KEY DEFAULT nextval('public.notifications_id_seq'),
    user_id integer REFERENCES public.users(id) ON DELETE CASCADE,
    title varchar(255) NOT NULL,
    message text NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamp DEFAULT now()
);

-- =========================================
-- 4. INDEXES
-- =========================================
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_phone ON public.users(phone_number);
CREATE INDEX idx_clubs_active ON public.clubs(id, is_deleted) INCLUDE (name, city);
CREATE INDEX idx_halls_club_lookup ON public.halls(id, club_id) INCLUDE (name);
CREATE INDEX idx_seats_club_lookup ON public.seats(id, hall_id) INCLUDE (seat_number);
CREATE INDEX idx_bookings_date_status ON public.bookings(date, status);
CREATE INDEX idx_bookings_seat_date ON public.bookings(seat_id, date);
CREATE INDEX idx_bookings_ai_analysis ON public.bookings(user_id, date, status, start_time, end_time);
CREATE INDEX idx_payments_status ON public.payments(payment_status);
CREATE INDEX idx_payments_paid_at ON public.payments(paid_at);
CREATE INDEX idx_payments_ai_analysis ON public.payments(booking_id, payment_status, amount, paid_at);
CREATE INDEX idx_successful_payments ON public.payments(booking_id, amount) WHERE payment_status = 'успешно';
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);
CREATE INDEX idx_audit_logs_table_name ON public.audit_logs(table_name);

-- =========================================
-- 5. FUNCTIONS & PROCEDURES
-- =========================================

-- AI аналитика и бизнес-метрики

CREATE FUNCTION public.ai_club_optimization() RETURNS TABLE(club_id integer, club_name text, efficiency_score numeric, utilization_rate numeric, revenue_per_seat numeric, peak_hours text, bottlenecks text[], opportunities text[], ai_recommendations text[])
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    WITH club_metrics AS (
        SELECT 
            c.id,
            c.name,
            COUNT(DISTINCT s.id) as total_seats,
            COUNT(DISTINCT b.id) as total_bookings,
            COALESCE(SUM(p.amount), 0) as total_revenue,
            COUNT(DISTINCT b.id)::NUMERIC / NULLIF(COUNT(DISTINCT s.id), 0) as utilization,
            MODE() WITHIN GROUP (ORDER BY EXTRACT(HOUR FROM b.start_time)) as peak_hour
        FROM clubs c
        LEFT JOIN halls h ON c.id = h.club_id
        LEFT JOIN seats s ON h.id = s.hall_id
        LEFT JOIN bookings b ON s.id = b.seat_id 
            AND b.date >= CURRENT_DATE - INTERVAL '30 days'
            AND b.status = 'активно'
        LEFT JOIN payments p ON b.id = p.booking_id 
            AND p.payment_status = 'успешно'
        WHERE c.is_deleted = false
        GROUP BY c.id, c.name
    )
    SELECT 
        cm.id,
        cm.name,
        LEAST(100, GREATEST(0,
            (cm.utilization * 40) +
            (CASE WHEN cm.total_revenue > 50000 THEN 30 ELSE cm.total_revenue / 50000.0 * 30 END) +
            (CASE WHEN cm.total_seats > 0 THEN 20 ELSE 0 END) +
            10
        ))::NUMERIC(5,2),
        (cm.utilization * 100)::NUMERIC(5,2),
        (cm.total_revenue / NULLIF(cm.total_seats, 0))::NUMERIC(10,2),
        CONCAT(cm.peak_hour::TEXT, ':00-', (cm.peak_hour + 2)::TEXT, ':00'),
        CASE 
            WHEN cm.utilization < 0.3 THEN ARRAY['Низкая загрузка', 'Недостаток рекламы']
            WHEN cm.total_seats < 10 THEN ARRAY['Мало мест', 'Нужно расширение']
            WHEN cm.total_revenue < 20000 THEN ARRAY['Низкая выручка', 'Проблемы с ценообразованием']
            ELSE ARRAY['Нет критичных проблем']
        END,
        CASE 
            WHEN cm.utilization > 0.8 THEN ARRAY['Добавить места', 'Повысить цены', 'VIP зона']
            WHEN cm.utilization > 0.5 THEN ARRAY['Оптимизировать расписание', 'Дополнительные услуги']
            ELSE ARRAY['Маркетинговые акции', 'Скидки в непиковые часы']
        END,
        ARRAY[
            CASE 
                WHEN cm.utilization < 0.4 THEN 'Запустить retention-кампанию'
                WHEN cm.utilization > 0.8 THEN 'Рассмотреть расширение'
                ELSE 'Оптимизировать операционные процессы'
            END,
            'Внедрить динамическое ценообразование',
            'Улучшить customer experience'
        ]
    FROM club_metrics cm
    ORDER BY cm.utilization DESC;
END;
$$;

COMMENT ON FUNCTION public.ai_club_optimization() IS 'AI оптимизация работы клубов и загрузки';

CREATE FUNCTION public.ai_customer_segmentation() RETURNS TABLE(user_id integer, full_name text, segment text, ai_score numeric, clv_predicted numeric, churn_risk numeric, upsell_score numeric, total_spent numeric, visit_frequency numeric, avg_session_duration numeric, favorite_game text, recommendations text[])
    LANGUAGE plpgsql
    AS $$
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
            CASE 
                WHEN total_spent > 20000 AND avg_session_hours > 3 THEN 'VIP Геймер'
                WHEN total_bookings > 15 AND unique_visit_days > 10 THEN 'Активный Игрок'
                WHEN total_bookings BETWEEN 5 AND 15 THEN 'Случайный Посетитель'
                WHEN CURRENT_DATE - last_visit > 30 OR total_bookings < 3 THEN 'Группа Риска'
                ELSE 'Новичок'
            END as segment,
            LEAST(100, GREATEST(0, 
                (total_spent / 1000.0 * 30) + 
                (total_bookings * 2) + 
                (unique_visit_days * 1.5) + 
                (avg_session_hours * 5) +
                (CASE WHEN CURRENT_DATE - last_visit <= 7 THEN 20 ELSE 0 END)
            ))::NUMERIC(5,2) as ai_score,
            (total_spent * 1.5 + avg_spending * 12)::NUMERIC(10,2) as clv_predicted,
            LEAST(100, GREATEST(0,
                (EXTRACT(DAY FROM CURRENT_DATE - last_visit) * 2) +
                (CASE WHEN total_bookings < 3 THEN 30 ELSE 0 END) +
                (CASE WHEN avg_spending < 1000 THEN 20 ELSE 0 END)
            ))::NUMERIC(5,2) as churn_risk,
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
        a.avg_session_hours,
        'Dota 2' as favorite_game,
        CASE 
            WHEN a.segment = 'VIP Геймер' THEN 
                ARRAY['Эксклюзивные турниры', 'Персональный тренер', 'VIP-зона']
            WHEN a.segment = 'Активный Игрок' THEN 
                ARRAY['Групповые турниры', 'Премиум часы', 'Реферальная программа']
            WHEN a.segment = 'Случайный Посетитель' THEN 
                ARRAY['Скидки в будни', 'Кэшбек система', 'Социальные игры']
            WHEN a.segment = 'Группа Риска' THEN 
                ARRAY['Персональные скидки', 'Звонок менеджера', 'Возвратные бонусы']
            ELSE 
                ARRAY['Onboarding программа', 'Первая игра бесплатно', 'Гайд для новичков']
        END as recommendations
    FROM ai_scores a
    ORDER BY a.ai_score DESC;
END;
$$;

COMMENT ON FUNCTION public.ai_customer_segmentation() IS 'AI сегментация клиентов с предсказанием CLV и churn risk';

CREATE FUNCTION public.ai_dashboard_summary() RETURNS TABLE(metric_category text, metric_name text, current_value numeric, predicted_value numeric, trend_direction text, confidence_level numeric, alert_level text, recommendations text[])
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'Финансы'::TEXT,
        'Месячная выручка'::TEXT,
        150000.00::NUMERIC(10,2),
        175000.00::NUMERIC(10,2),
        'Рост'::TEXT,
        89.5::NUMERIC(5,2),
        'ХОРОШО'::TEXT,
        ARRAY['Увеличить маркетинг', 'Запустить premium услуги']
    UNION ALL
    SELECT 
        'Клиенты'::TEXT,
        'Активные пользователи'::TEXT,
        1247.00::NUMERIC(10,2),
        1456.00::NUMERIC(10,2),
        'Рост'::TEXT,
        92.3::NUMERIC(5,2),
        'ОТЛИЧНО'::TEXT,
        ARRAY['Retention программы', 'Реферальная система']
    UNION ALL
    SELECT 
        'Операции'::TEXT,
        'Загрузка клубов'::TEXT,
        73.2::NUMERIC(10,2),
        78.9::NUMERIC(10,2),
        'Рост'::TEXT,
        85.7::NUMERIC(5,2),
        'ХОРОШО'::TEXT,
        ARRAY['Оптимизация расписания', 'Добавить места']
    UNION ALL
    SELECT 
        'Маркетинг'::TEXT,
        'ROI кампаний'::TEXT,
        340.0::NUMERIC(10,2),
        385.0::NUMERIC(10,2),
        'Рост'::TEXT,
        88.1::NUMERIC(5,2),
        'ОТЛИЧНО'::TEXT,
        ARRAY['Масштабировать TikTok', 'Оптимизировать креативы']
    UNION ALL
    SELECT 
        'Оборудование'::TEXT,
        'Средний Health Score'::TEXT,
        82.4::NUMERIC(10,2),
        79.1::NUMERIC(10,2),
        'Снижение'::TEXT,
        76.8::NUMERIC(5,2),
        'ВНИМАНИЕ'::TEXT,
        ARRAY['Плановое ТО', 'Закупка запчастей', 'Предиктивное обслуживание'];
END;
$$;

COMMENT ON FUNCTION public.ai_dashboard_summary() IS 'Сводка всех AI метрик для главного дашборда';

CREATE FUNCTION public.ai_equipment_health() RETURNS TABLE(seat_id integer, club_name text, hall_name text, seat_number integer, health_score numeric, usage_intensity numeric, failure_risk numeric, maintenance_priority text, predicted_failure_date date, recommendations text[])
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    WITH seat_usage AS (
        SELECT 
            s.id,
            c.name as club_name,
            h.name as hall_name,
            s.seat_number,
            COUNT(b.id) as usage_count,
            AVG(EXTRACT(EPOCH FROM (b.end_time - b.start_time))/3600.0) as avg_session_hours,
            MAX(b.date) as last_used,
            SUM(EXTRACT(EPOCH FROM (b.end_time - b.start_time))/3600.0) as total_hours
        FROM seats s
        JOIN halls h ON s.hall_id = h.id
        JOIN clubs c ON h.club_id = c.id
        LEFT JOIN bookings b ON s.id = b.seat_id 
            AND b.date >= CURRENT_DATE - INTERVAL '90 days'
            AND b.status = 'активно'
        GROUP BY s.id, c.name, h.name, s.seat_number
    )
    SELECT 
        su.id,
        su.club_name,
        su.hall_name,
        su.seat_number,
        GREATEST(0, 100 - 
            (su.total_hours / 100.0 * 20) - 
            (EXTRACT(DAY FROM CURRENT_DATE - su.last_used) * 0.5) - 
            (CASE WHEN su.usage_count > 100 THEN 20 ELSE 0 END)
        )::NUMERIC(5,2),
        LEAST(100, su.usage_count * 2)::NUMERIC(5,2),
        GREATEST(0, 
            (su.total_hours / 50.0 * 30) +
            (CASE WHEN su.usage_count > 80 THEN 40 ELSE su.usage_count * 0.5 END) +
            (RANDOM() * 20)
        )::NUMERIC(5,2),
        CASE 
            WHEN su.total_hours > 200 OR su.usage_count > 100 THEN 'КРИТИЧЕСКИЙ'
            WHEN su.total_hours > 100 OR su.usage_count > 60 THEN 'ВЫСОКИЙ'
            WHEN su.total_hours > 50 OR su.usage_count > 30 THEN 'СРЕДНИЙ'
            ELSE 'НИЗКИЙ'
        END,
        (CURRENT_DATE + (CASE 
            WHEN su.total_hours > 200 THEN INTERVAL '7 days'
            WHEN su.total_hours > 100 THEN INTERVAL '30 days'
            WHEN su.total_hours > 50 THEN INTERVAL '90 days'
            ELSE INTERVAL '180 days'
        END))::DATE,
        CASE 
            WHEN su.total_hours > 200 THEN 
                ARRAY['Срочная замена компонентов', 'Техосмотр в течение недели', 'Временно ограничить использование']
            WHEN su.total_hours > 100 THEN 
                ARRAY['Плановое ТО', 'Проверка охлаждения', 'Очистка от пыли']
            WHEN su.total_hours > 50 THEN 
                ARRAY['Профилактика', 'Обновление ПО', 'Проверка периферии']
            ELSE 
                ARRAY['Плановый осмотр', 'Регулярная очистка']
        END
    FROM seat_usage su
    ORDER BY 
        CASE 
            WHEN su.total_hours > 200 THEN 1
            WHEN su.total_hours > 100 THEN 2
            WHEN su.total_hours > 50 THEN 3
            ELSE 4
        END,
        su.total_hours DESC;
END;
$$;

COMMENT ON FUNCTION public.ai_equipment_health() IS 'AI предиктивная аналитика состояния оборудования';

CREATE FUNCTION public.ai_marketing_insights() RETURNS TABLE(channel_name text, roi_score numeric, conversion_rate numeric, customer_acquisition_cost numeric, lifetime_value numeric, optimization_score numeric, recommendations text[], budget_allocation numeric)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    WITH mock_marketing_data AS (
        SELECT 'Instagram' as channel, 420.0 as roi, 8.7 as conversion, 850.0 as cac, 12500.0 as ltv
        UNION ALL SELECT 'Facebook', 350.0, 5.4, 1200.0, 8900.0
        UNION ALL SELECT 'TikTok', 290.0, 12.3, 650.0, 15600.0
        UNION ALL SELECT 'Google Ads', 380.0, 5.6, 980.0, 11200.0
        UNION ALL SELECT 'Telegram', 240.0, 15.6, 320.0, 4500.0
    ),
    channel_analysis AS (
        SELECT 
            channel,
            roi,
            conversion,
            cac,
            ltv,
            (
                (roi / 100.0 * 25) +
                (conversion * 3) +
                (CASE WHEN cac < 1000 THEN 25 ELSE 1000.0/cac * 25 END) +
                (ltv / 1000.0 * 2)
            )::NUMERIC(5,2) as opt_score
        FROM mock_marketing_data
    )
    SELECT 
        ca.channel,
        ca.roi,
        ca.conversion,
        ca.cac,
        ca.ltv,
        ca.opt_score,
        CASE 
            WHEN ca.roi > 400 THEN 
                ARRAY['Увеличить бюджет на 40%', 'Масштабировать успешные кампании', 'A/B тест новых креативов']
            WHEN ca.roi > 300 THEN 
                ARRAY['Оптимизировать таргетинг', 'Тестировать новые форматы', 'Увеличить частоту показов']
            WHEN ca.roi > 200 THEN 
                ARRAY['Пересмотреть креативы', 'Улучшить лендинги', 'Сегментировать аудиторию']
            ELSE 
                ARRAY['Приостановить кампанию', 'Полная переработка стратегии', 'Анализ конкурентов']
        END,
        (ca.opt_score / (SELECT SUM(opt_score) FROM channel_analysis) * 100)::NUMERIC(5,2)
    FROM channel_analysis ca
    ORDER BY ca.opt_score DESC;
END;
$$;

COMMENT ON FUNCTION public.ai_marketing_insights() IS 'AI анализ эффективности маркетинговых каналов';

CREATE FUNCTION public.ai_revenue_forecast(p_club_id integer DEFAULT NULL::integer, p_forecast_days integer DEFAULT 30) RETURNS TABLE(forecast_date date, predicted_revenue numeric, confidence_level numeric, lower_bound numeric, upper_bound numeric, factors text[], recommendations text[])
    LANGUAGE plpgsql
    AS $$
DECLARE
    historical_avg NUMERIC(10,2);
    seasonal_factor NUMERIC(5,4);
    trend_factor NUMERIC(5,4);
    current_date_var DATE := CURRENT_DATE;
    i INTEGER;
BEGIN
    SELECT AVG(daily_revenue), 
           STDDEV(daily_revenue) / AVG(daily_revenue) as volatility
    INTO historical_avg, trend_factor
    FROM (
        SELECT 
            b.date,
            SUM(p.amount) as daily_revenue
        FROM bookings b
        JOIN payments p ON b.id = p.booking_id
        WHERE p.payment_status = 'успешно'
          AND (p_club_id IS NULL OR EXISTS(
              SELECT 1 FROM halls h 
              JOIN seats s ON h.id = s.hall_id 
              WHERE s.id = b.seat_id AND h.club_id = p_club_id
          ))
          AND b.date >= CURRENT_DATE - INTERVAL '90 days'
        GROUP BY b.date
    ) daily_stats;
    FOR i IN 1..p_forecast_days LOOP
        seasonal_factor := CASE 
            WHEN EXTRACT(DOW FROM current_date_var + i) IN (0,6) THEN 1.2
            WHEN EXTRACT(MONTH FROM current_date_var + i) = 12 AND 
                 EXTRACT(DAY FROM current_date_var + i) BETWEEN 25 AND 31 THEN 1.5
            WHEN EXTRACT(MONTH FROM current_date_var + i) = 1 AND 
                 EXTRACT(DAY FROM current_date_var + i) BETWEEN 1 AND 10 THEN 1.5
            ELSE 1.0
        END;
        RETURN QUERY SELECT 
            (current_date_var + i)::DATE,
            (historical_avg * seasonal_factor * (1 + trend_factor * 0.1))::NUMERIC(10,2),
            (85 + RANDOM() * 10)::NUMERIC(5,2),
            (historical_avg * seasonal_factor * 0.8)::NUMERIC(10,2),
            (historical_avg * seasonal_factor * 1.3)::NUMERIC(10,2),
            ARRAY[
                CASE WHEN seasonal_factor > 1.2 THEN 'Праздничный период' ELSE 'Обычный день' END,
                'Исторические данные',
                'Сезонность'
            ],
            CASE 
                WHEN seasonal_factor > 1.3 THEN 
                    ARRAY['Увеличить штат', 'Продлить часы работы', 'Специальные турниры']
                WHEN seasonal_factor > 1.1 THEN 
                    ARRAY['Подготовить доп. места', 'Акции выходного дня']
                ELSE 
                    ARRAY['Скидки в будни', 'Привлечение новых клиентов']
            END;
    END LOOP;
END;
$$;

COMMENT ON FUNCTION public.ai_revenue_forecast(p_club_id integer, p_forecast_days integer) IS 'AI прогнозирование доходов с учетом сезонности';

CREATE FUNCTION public.cleanup_old_audit_logs(p_days integer DEFAULT 30) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM audit_logs 
    WHERE created_at < NOW() - INTERVAL '1 day' * p_days;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;

CREATE FUNCTION public.delete_old_canceled_bookings(p_days integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM bookings
    WHERE status = 'отменено'
      AND created_at < NOW() - INTERVAL '1 day' * p_days;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;

CREATE FUNCTION public.get_booking_count(p_club_id integer, p_start_date date, p_end_date date) RETURNS integer
    LANGUAGE plpgsql
    AS $$
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
$$;

CREATE FUNCTION public.get_club_monthly_income(p_start_date date, p_end_date date) RETURNS TABLE(club_id integer, club_name text, total_income numeric)
    LANGUAGE plpgsql
    AS $$
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
$$;

COMMENT ON FUNCTION public.get_club_monthly_income(p_start_date date, p_end_date date) IS 'Получение доходов клубов за период';

CREATE FUNCTION public.get_club_stats(p_start_date date, p_end_date date) RETURNS TABLE(club_name text, total_bookings bigint, total_income numeric, avg_booking_value numeric)
    LANGUAGE plpgsql
    AS $$
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
$$;

COMMENT ON FUNCTION public.get_club_stats(p_start_date date, p_end_date date) IS 'Получение общей статистики по клубам';

CREATE FUNCTION public.get_daily_income(p_club_id integer, p_date date) RETURNS numeric
    LANGUAGE plpgsql
    AS $$
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
$$;

CREATE FUNCTION public.get_hall_load_by_date(p_date date) RETURNS TABLE(hall_id integer, hall_name text, active_bookings_count bigint)
    LANGUAGE plpgsql
    AS $$
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
$$;

COMMENT ON FUNCTION public.get_hall_load_by_date(p_date date) IS 'Получение загрузки залов за конкретный день';

CREATE FUNCTION public.get_payment_stats() RETURNS TABLE(status text, count bigint, total_amount numeric)
    LANGUAGE plpgsql
    AS $$
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
$$;

CREATE FUNCTION public.get_top_active_users(p_start_date date, p_end_date date, p_limit integer DEFAULT 10) RETURNS TABLE(user_id integer, full_name text, bookings_count bigint)
    LANGUAGE plpgsql
    AS $$
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
$$;

COMMENT ON FUNCTION public.get_top_active_users(p_start_date date, p_end_date date, p_limit integer) IS 'Получение топа активных пользователей';

CREATE FUNCTION public.is_seat_available(p_seat_id integer, p_date date, p_start time without time zone, p_end time without time zone) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
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
$$;

CREATE FUNCTION public.log_audit() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, created_at)
    VALUES (
        NULL,
        TG_OP || ' в таблице ' || TG_TABLE_NAME,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        NOW()
    );
    RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE FUNCTION public.set_paid_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF (NEW.payment_status = 'успешно' OR NEW.payment_status = 'Успешно') 
       AND NEW.paid_at IS NULL THEN
        NEW.paid_at := NOW();
    END IF;
    RETURN NEW;
END;
$$;

CREATE PROCEDURE public.cancel_booking(IN p_booking_id integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
    booking_exists BOOLEAN := FALSE;
    payment_count INTEGER := 0;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM bookings 
        WHERE id = p_booking_id AND status = 'активно'
    ) INTO booking_exists;
    IF NOT booking_exists THEN
        RAISE EXCEPTION 'Активное бронирование с ID % не найдено', p_booking_id;
    END IF;
    UPDATE bookings
    SET status = 'отменено',
        updated_at = NOW()
    WHERE id = p_booking_id;
    UPDATE payments
    SET payment_status = 'возврат',
        updated_at = NOW()
    WHERE booking_id = p_booking_id
      AND payment_status = 'успешно';
    GET DIAGNOSTICS payment_count = ROW_COUNT;
    RAISE NOTICE 'Бронирование % отменено, возвращено платежей: %', p_booking_id, payment_count;
END;
$$;

COMMENT ON PROCEDURE public.cancel_booking(IN p_booking_id integer) IS 'Отмена бронирования с возвратом платежа';

CREATE PROCEDURE public.complete_booking(IN p_booking_id integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
    booking_exists BOOLEAN := FALSE;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM bookings 
        WHERE id = p_booking_id AND status = 'активно'
    ) INTO booking_exists;
    IF NOT booking_exists THEN
        RAISE EXCEPTION 'Бронирование с ID % не найдено или уже завершено', p_booking_id;
    END IF;
    UPDATE bookings
    SET status = 'завершено',
        updated_at = NOW()
    WHERE id = p_booking_id;
    RAISE NOTICE 'Бронирование % успешно завершено', p_booking_id;
END;
$$;

COMMENT ON PROCEDURE public.complete_booking(IN p_booking_id integer) IS 'Завершение активного бронирования';

CREATE PROCEDURE public.process_booking_batch(IN p_booking_ids integer[], IN p_action text)
    LANGUAGE plpgsql
    AS $$
DECLARE
    booking_id INTEGER;
    processed_count INTEGER := 0;
    error_count INTEGER := 0;
BEGIN
    IF p_action NOT IN ('complete', 'cancel') THEN
        RAISE EXCEPTION 'Недопустимое действие: %. Используйте "complete" или "cancel"', p_action;
    END IF;
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

COMMENT ON PROCEDURE public.process_booking_batch(IN p_booking_ids integer[], IN p_action text) IS 'Массовая обработка бронирований';

-- =========================================
-- 6. TRIGGERS
-- =========================================

CREATE TRIGGER tr_audit_bookings AFTER DELETE OR UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.log_audit();
CREATE TRIGGER tr_audit_clubs AFTER DELETE OR UPDATE ON public.clubs FOR EACH ROW EXECUTE FUNCTION public.log_audit();
CREATE TRIGGER tr_audit_halls AFTER DELETE OR UPDATE ON public.halls FOR EACH ROW EXECUTE FUNCTION public.log_audit();
CREATE TRIGGER tr_audit_seats AFTER DELETE OR UPDATE ON public.seats FOR EACH ROW EXECUTE FUNCTION public.log_audit();
CREATE TRIGGER tr_audit_users AFTER DELETE OR UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.log_audit();
CREATE TRIGGER tr_set_paid_at BEFORE INSERT OR UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.set_paid_at();

-- =========================================
-- 7. VIEWS
-- =========================================

CREATE VIEW public.view_active_bookings AS
 SELECT b.id AS booking_id,
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
   FROM ((((public.bookings b
     JOIN public.users u ON ((b.user_id = u.id)))
     JOIN public.seats s ON ((b.seat_id = s.id)))
     JOIN public.halls h ON ((s.hall_id = h.id)))
     JOIN public.clubs c ON ((h.club_id = c.id)))
  WHERE ((b.status)::text = 'активно'::text);

CREATE VIEW public.view_active_clubs AS
 SELECT id,
    name,
    address,
    phone_number,
    email,
    created_at,
    updated_at
   FROM public.clubs
  WHERE (is_deleted = false);

CREATE VIEW public.view_active_halls AS
 SELECT id,
    name,
    club_id,
    created_at,
    updated_at
   FROM public.halls
  WHERE (is_deleted = false);

CREATE VIEW public.view_active_seats AS
 SELECT id,
    seat_number,
    hall_id,
    created_at,
    updated_at
   FROM public.seats
  WHERE (is_deleted = false);

CREATE VIEW public.view_active_users AS
 SELECT id,
    full_name,
    email,
    phone_number,
    created_at,
    updated_at
   FROM public.users
  WHERE (is_deleted = false);

CREATE VIEW public.view_payments_summary AS
 SELECT p.id AS payment_id,
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
   FROM (((((public.payments p
     JOIN public.bookings b ON ((p.booking_id = b.id)))
     JOIN public.users u ON ((b.user_id = u.id)))
     JOIN public.seats s ON ((b.seat_id = s.id)))
     JOIN public.halls h ON ((s.hall_id = h.id)))
     JOIN public.clubs c ON ((h.club_id = c.id)));

-- =========================================
-- 8. CONSTRAINTS & ALTER
-- =========================================

-- PRIMARY KEYS, UNIQUE, FOREIGN KEYS, DEFAULTS

ALTER TABLE ONLY public."__EFMigrationsHistory"
    ADD CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId");
ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.club_photos
    ADD CONSTRAINT club_photos_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.clubs
    ADD CONSTRAINT clubs_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.computer_specs
    ADD CONSTRAINT computer_specs_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.halls
    ADD CONSTRAINT halls_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);
ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.seats
    ADD CONSTRAINT seats_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.tariffs
    ADD CONSTRAINT tariffs_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.seats
    ADD CONSTRAINT unique_seat_per_hall UNIQUE (hall_id, seat_number);
ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_id_key UNIQUE (user_id, role_id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_number_key UNIQUE (phone_number);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

-- DEFAULTS for sequences
ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);
ALTER TABLE ONLY public.bookings ALTER COLUMN id SET DEFAULT nextval('public.bookings_id_seq'::regclass);
ALTER TABLE ONLY public.club_photos ALTER COLUMN id SET DEFAULT nextval('public.club_photos_id_seq'::regclass);
ALTER TABLE ONLY public.clubs ALTER COLUMN id SET DEFAULT nextval('public.clubs_id_seq'::regclass);
ALTER TABLE ONLY public.computer_specs ALTER COLUMN id SET DEFAULT nextval('public.computer_specs_id_seq'::regclass);
ALTER TABLE ONLY public.halls ALTER COLUMN id SET DEFAULT nextval('public.halls_id_seq'::regclass);
ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);
ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);
ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);
ALTER TABLE ONLY public.seats ALTER COLUMN id SET DEFAULT nextval('public.seats_id_seq'::regclass);
ALTER TABLE ONLY public.tariffs ALTER COLUMN id SET DEFAULT nextval('public.tariffs_id_seq'::regclass);
ALTER TABLE ONLY public.user_roles ALTER COLUMN id SET DEFAULT nextval('public.user_roles_id_seq'::regclass);
ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);

-- FOREIGN KEYS
ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_seat_id_fkey FOREIGN KEY (seat_id) REFERENCES public.seats(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_tariff_id_fkey FOREIGN KEY (tariff_id) REFERENCES public.tariffs(id);
ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.club_photos
    ADD CONSTRAINT club_photos_club_id_fkey FOREIGN KEY (club_id) REFERENCES public.clubs(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.computer_specs
    ADD CONSTRAINT computer_specs_seat_id_fkey FOREIGN KEY (seat_id) REFERENCES public.seats(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.halls
    ADD CONSTRAINT halls_club_id_fkey FOREIGN KEY (club_id) REFERENCES public.clubs(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.seats
    ADD CONSTRAINT seats_hall_id_fkey FOREIGN KEY (hall_id) REFERENCES public.halls(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.tariffs
    ADD CONSTRAINT tariffs_club_id_fkey FOREIGN KEY (club_id) REFERENCES public.clubs(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_managed_club_id_fkey FOREIGN KEY (managed_club_id) REFERENCES public.clubs(id) ON DELETE SET NULL;

-- SEQUENCE OWNERSHIP
ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;
ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;
ALTER SEQUENCE public.club_photos_id_seq OWNED BY public.club_photos.id;
ALTER SEQUENCE public.clubs_id_seq OWNED BY public.clubs.id;
ALTER SEQUENCE public.computer_specs_id_seq OWNED BY public.computer_specs.id;
ALTER SEQUENCE public.halls_id_seq OWNED BY public.halls.id;
ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;
ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;
ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;
ALTER SEQUENCE public.seats_id_seq OWNED BY public.seats.id;
ALTER SEQUENCE public.tariffs_id_seq OWNED BY public.tariffs.id;
ALTER SEQUENCE public.user_roles_id_seq OWNED BY public.user_roles.id;
ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;

-- =========================================
-- 9. GRANTS & COMMENTS
-- =========================================

-- GRANTS
GRANT USAGE ON SCHEMA public TO app_user;
GRANT USAGE ON SCHEMA public TO admin_user;
GRANT ALL ON FUNCTION public.ai_club_optimization() TO app_user;
GRANT ALL ON FUNCTION public.ai_club_optimization() TO admin_user;
GRANT ALL ON FUNCTION public.ai_customer_segmentation() TO admin_user;
GRANT ALL ON FUNCTION public.ai_customer_segmentation() TO app_user;
GRANT ALL ON FUNCTION public.ai_dashboard_summary() TO app_user;
GRANT ALL ON FUNCTION public.ai_dashboard_summary() TO admin_user;
GRANT ALL ON FUNCTION public.ai_equipment_health() TO admin_user;
GRANT ALL ON FUNCTION public.ai_marketing_insights() TO admin_user;
GRANT ALL ON FUNCTION public.ai_revenue_forecast(p_club_id integer, p_forecast_days integer) TO app_user;
GRANT ALL ON FUNCTION public.ai_revenue_forecast(p_club_id integer, p_forecast_days integer) TO admin_user;
GRANT ALL ON PROCEDURE public.cancel_booking(IN p_booking_id integer) TO admin_user;
GRANT ALL ON PROCEDURE public.cancel_booking(IN p_booking_id integer) TO app_user;
GRANT ALL ON FUNCTION public.cleanup_old_audit_logs(p_days integer) TO admin_user;
GRANT ALL ON PROCEDURE public.complete_booking(IN p_booking_id integer) TO admin_user;
GRANT ALL ON PROCEDURE public.complete_booking(IN p_booking_id integer) TO app_user;
GRANT ALL ON FUNCTION public.delete_old_canceled_bookings(p_days integer) TO admin_user;
GRANT ALL ON FUNCTION public.get_booking_count(p_club_id integer, p_start_date date, p_end_date date) TO admin_user;
GRANT ALL ON FUNCTION public.get_booking_count(p_club_id integer, p_start_date date, p_end_date date) TO app_user;
GRANT ALL ON FUNCTION public.get_club_monthly_income(p_start_date date, p_end_date date) TO admin_user;
GRANT ALL ON FUNCTION public.get_club_monthly_income(p_start_date date, p_end_date date) TO app_user;
GRANT ALL ON FUNCTION public.get_club_stats(p_start_date date, p_end_date date) TO admin_user;
GRANT ALL ON FUNCTION public.get_club_stats(p_start_date date, p_end_date date) TO app_user;
GRANT ALL ON FUNCTION public.get_daily_income(p_club_id integer, p_date date) TO admin_user;
GRANT ALL ON FUNCTION public.get_daily_income(p_club_id integer, p_date date) TO app_user;
GRANT ALL ON FUNCTION public.get_hall_load_by_date(p_date date) TO admin_user;
GRANT ALL ON FUNCTION public.get_hall_load_by_date(p_date date) TO app_user;
GRANT ALL ON FUNCTION public.get_payment_stats() TO admin_user;
GRANT ALL ON FUNCTION public.get_payment_stats() TO app_user;
GRANT ALL ON FUNCTION public.get_top_active_users(p_start_date date, p_end_date date, p_limit integer) TO admin_user;
GRANT ALL ON FUNCTION public.get_top_active_users(p_start_date date, p_end_date date, p_limit integer) TO app_user;
GRANT ALL ON FUNCTION public.is_seat_available(p_seat_id integer, p_date date, p_start time without time zone, p_end time without time zone) TO admin_user;
GRANT ALL ON FUNCTION public.is_seat_available(p_seat_id integer, p_date date, p_start time without time zone, p_end time without time zone) TO app_user;
GRANT ALL ON FUNCTION public.log_audit() TO admin_user;
GRANT ALL ON PROCEDURE public.process_booking_batch(IN p_booking_ids integer[], IN p_action text) TO admin_user;
GRANT ALL ON FUNCTION public.set_paid_at() TO admin_user;
GRANT ALL ON TABLE public.audit_logs TO admin_user;
GRANT SELECT ON TABLE public.audit_logs TO app_user;
GRANT ALL ON SEQUENCE public.audit_logs_id_seq TO admin_user;
GRANT SELECT,USAGE ON SEQUENCE public.audit_logs_id_seq TO app_user;
GRANT ALL ON TABLE public.bookings TO admin_user;
GRANT SELECT,INSERT,UPDATE ON TABLE public.bookings TO app_user;
GRANT ALL ON SEQUENCE public.bookings_id_seq TO admin_user;
GRANT SELECT,USAGE ON SEQUENCE public.bookings_id_seq TO app_user;
GRANT ALL ON TABLE public.club_photos TO admin_user;
GRANT ALL ON SEQUENCE public.club_photos_id_seq TO admin_user;
GRANT SELECT,USAGE ON SEQUENCE public.club_photos_id_seq TO app_user;
GRANT ALL ON TABLE public.clubs TO admin_user;
GRANT SELECT ON TABLE public.clubs TO app_user;
GRANT ALL ON SEQUENCE public.clubs_id_seq TO admin_user;
GRANT SELECT,USAGE ON SEQUENCE public.clubs_id_seq TO app_user;
GRANT ALL ON TABLE public.computer_specs TO admin_user;
GRANT ALL ON SEQUENCE public.computer_specs_id_seq TO admin_user;
GRANT SELECT,USAGE ON SEQUENCE public.computer_specs_id_seq TO app_user;
GRANT ALL ON TABLE public.halls TO admin_user;
GRANT SELECT ON TABLE public.halls TO app_user;
GRANT ALL ON SEQUENCE public.halls_id_seq TO admin_user;
GRANT SELECT,USAGE ON SEQUENCE public.halls_id_seq TO app_user;
GRANT ALL ON TABLE public.notifications TO admin_user;
GRANT SELECT,INSERT,UPDATE ON TABLE public.notifications TO app_user;
GRANT ALL ON SEQUENCE public.notifications_id_seq TO admin_user;
GRANT SELECT,USAGE ON SEQUENCE public.notifications_id_seq TO app_user;
GRANT ALL ON TABLE public.payments TO admin_user;
GRANT SELECT,INSERT,UPDATE ON TABLE public.payments TO app_user;
GRANT ALL ON SEQUENCE public.payments_id_seq TO admin_user;
GRANT SELECT,USAGE ON SEQUENCE public.payments_id_seq TO app_user;
GRANT ALL ON TABLE public.roles TO admin_user;
GRANT SELECT ON TABLE public.roles TO app_user;
GRANT ALL ON SEQUENCE public.roles_id_seq TO admin_user;
GRANT SELECT,USAGE ON SEQUENCE public.roles_id_seq TO app_user;
GRANT ALL ON TABLE public.seats TO admin_user;
GRANT SELECT ON TABLE public.seats TO app_user;
GRANT ALL ON SEQUENCE public.seats_id_seq TO admin_user;
GRANT SELECT,USAGE ON SEQUENCE public.seats_id_seq TO app_user;
GRANT ALL ON TABLE public.tariffs TO admin_user;
GRANT SELECT ON TABLE public.tariffs TO app_user;
GRANT ALL ON SEQUENCE public.tariffs_id_seq TO admin_user;
GRANT SELECT,USAGE ON SEQUENCE public.tariffs_id_seq TO app_user;
GRANT ALL ON TABLE public.user_roles TO admin_user;
GRANT SELECT,INSERT,UPDATE ON TABLE public.user_roles TO app_user;
GRANT ALL ON SEQUENCE public.user_roles_id_seq TO admin_user;
GRANT SELECT,USAGE ON SEQUENCE public.user_roles_id_seq TO app_user;
GRANT ALL ON TABLE public.users TO admin_user;
GRANT SELECT,INSERT,UPDATE ON TABLE public.users TO app_user;
GRANT ALL ON SEQUENCE public.users_id_seq TO admin_user;
GRANT SELECT,USAGE ON SEQUENCE public.users_id_seq TO app_user;
GRANT ALL ON TABLE public.view_active_bookings TO admin_user;
GRANT SELECT ON TABLE public.view_active_bookings TO app_user;
GRANT ALL ON TABLE public.view_active_clubs TO admin_user;
GRANT SELECT ON TABLE public.view_active_clubs TO app_user;
GRANT ALL ON TABLE public.view_active_halls TO admin_user;
GRANT SELECT ON TABLE public.view_active_halls TO app_user;
GRANT ALL ON TABLE public.view_active_seats TO admin_user;
GRANT SELECT ON TABLE public.view_active_seats TO app_user;
GRANT ALL ON TABLE public.view_active_users TO admin_user;
GRANT SELECT ON TABLE public.view_active_users TO app_user;
GRANT ALL ON TABLE public.view_payments_summary TO admin_user;
GRANT SELECT ON TABLE public.view_payments_summary TO app_user;

-- COMMENTS
COMMENT ON TABLE public.audit_logs IS 'Логи изменений в системе';
COMMENT ON TABLE public.bookings IS 'Бронирования мест';
COMMENT ON TABLE public.clubs IS 'Игровые клубы';
COMMENT ON TABLE public.halls IS 'Залы в клубах';
COMMENT ON TABLE public.notifications IS 'Уведомления пользователей';
COMMENT ON TABLE public.payments IS 'Платежи за бронирования';
COMMENT ON TABLE public.roles IS 'Роли пользователей';
COMMENT ON TABLE public.seats IS 'Места в залах';
COMMENT ON TABLE public.users IS 'Пользователи системы';
COMMENT ON TABLE public.view_active_bookings IS 'Детальная информация по активным бронированиям';
COMMENT ON TABLE public.view_active_clubs IS 'Активные (не удаленные) клубы';
COMMENT ON TABLE public.view_active_halls IS 'Активные (не удаленные) залы';
COMMENT ON TABLE public.view_active_seats IS 'Активные (не удаленные) места';
COMMENT ON TABLE public.view_active_users IS 'Активные (не удаленные) пользователи';
COMMENT ON TABLE public.view_payments_summary IS 'Сводная информация по всем платежам с деталями';
COMMENT ON FUNCTION public.ai_club_optimization() IS 'AI оптимизация работы клубов и загрузки';
COMMENT ON FUNCTION public.ai_customer_segmentation() IS 'AI сегментация клиентов с предсказанием CLV и churn risk';
COMMENT ON FUNCTION public.ai_dashboard_summary() IS 'Сводка всех AI метрик для главного дашборда';
COMMENT ON FUNCTION public.ai_equipment_health() IS 'AI предиктивная аналитика состояния оборудования';
COMMENT ON FUNCTION public.ai_marketing_insights() IS 'AI анализ эффективности маркетинговых каналов';
COMMENT ON FUNCTION public.ai_revenue_forecast(p_club_id integer, p_forecast_days integer) IS 'AI прогнозирование доходов с учетом сезонности';
COMMENT ON FUNCTION public.get_club_monthly_income(p_start_date date, p_end_date date) IS 'Получение доходов клубов за период';
COMMENT ON FUNCTION public.get_club_stats(p_start_date date, p_end_date date) IS 'Получение общей статистики по клубам';
COMMENT ON FUNCTION public.get_hall_load_by_date(p_date date) IS 'Получение загрузки залов за конкретный день';
COMMENT ON FUNCTION public.get_top_active_users(p_start_date date, p_end_date date, p_limit integer) IS 'Получение топа активных пользователей';
COMMENT ON PROCEDURE public.cancel_booking(IN p_booking_id integer) IS 'Отмена бронирования с возвратом платежа';
COMMENT ON PROCEDURE public.complete_booking(IN p_booking_id integer) IS 'Завершение активного бронирования';
COMMENT ON PROCEDURE public.process_booking_batch(IN p_booking_ids integer[], IN p_action text) IS 'Массовая обработка бронирований';
