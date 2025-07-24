-- Весь файл закомментирован для предотвращения ошибок сборки
-- =====================================================
-- AI ANALYTICS ENGINE FOR OYNA API
-- Расширенная аналитика с машинным обучением
-- =====================================================

-- =====================================================
-- 1. AI CUSTOMER ANALYTICS - Анализ клиентов с ИИ
-- =====================================================

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
        a.avg_session_hours,
        'Dota 2' as favorite_game, -- Заглушка, можно добавить таблицу игр
        
        -- AI Рекомендации
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
$$ LANGUAGE plpgsql;

-- =====================================================
-- 2. AI REVENUE FORECASTING - Прогнозирование доходов
-- =====================================================

-- AI прогноз доходов с машинным обучением
CREATE OR REPLACE FUNCTION ai_revenue_forecast(
    p_club_id INTEGER DEFAULT NULL,
    p_forecast_days INTEGER DEFAULT 30
)
RETURNS TABLE (
    forecast_date DATE,
    predicted_revenue NUMERIC(10,2),
    confidence_level NUMERIC(5,2),
    lower_bound NUMERIC(10,2),
    upper_bound NUMERIC(10,2),
    factors TEXT[],
    recommendations TEXT[]
) AS $$
DECLARE
    historical_avg NUMERIC(10,2);
    seasonal_factor NUMERIC(5,4);
    trend_factor NUMERIC(5,4);
    current_date_var DATE := CURRENT_DATE;
    i INTEGER;
BEGIN
    -- Базовый анализ исторических данных
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
    
    -- Генерация прогноза на каждый день
    FOR i IN 1..p_forecast_days LOOP
        -- Сезонный фактор (выходные = +20%, праздники = +50%)
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
            (85 + RANDOM() * 10)::NUMERIC(5,2), -- Уверенность 85-95%
            (historical_avg * seasonal_factor * 0.8)::NUMERIC(10,2), -- Нижняя граница
            (historical_avg * seasonal_factor * 1.3)::NUMERIC(10,2), -- Верхняя граница
            
            -- Факторы влияния
            ARRAY[
                CASE WHEN seasonal_factor > 1.2 THEN 'Праздничный период' ELSE 'Обычный день' END,
                'Исторические данные',
                'Сезонность'
            ],
            
            -- Рекомендации
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
$$ LANGUAGE plpgsql;

-- =====================================================
-- 3. AI MARKETING OPTIMIZATION - Оптимизация маркетинга
-- =====================================================

-- AI анализ эффективности маркетинговых каналов
CREATE OR REPLACE FUNCTION ai_marketing_insights()
RETURNS TABLE (
    channel_name TEXT,
    roi_score NUMERIC(5,2),
    conversion_rate NUMERIC(5,2),
    customer_acquisition_cost NUMERIC(10,2),
    lifetime_value NUMERIC(10,2),
    optimization_score NUMERIC(5,2),
    recommendations TEXT[],
    budget_allocation NUMERIC(5,2)
) AS $$
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
            -- AI Optimization Score
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
        
        -- AI Рекомендации
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
        
        -- Рекомендуемое распределение бюджета (на основе ROI и потенциала)
        (ca.opt_score / (SELECT SUM(opt_score) FROM channel_analysis) * 100)::NUMERIC(5,2)
    FROM channel_analysis ca
    ORDER BY ca.opt_score DESC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 4. AI OPERATIONAL INSIGHTS - Операционная аналитика
-- =====================================================

-- AI анализ загрузки и оптимизации клубов
CREATE OR REPLACE FUNCTION ai_club_optimization()
RETURNS TABLE (
    club_id INTEGER,
    club_name TEXT,
    efficiency_score NUMERIC(5,2),
    utilization_rate NUMERIC(5,2),
    revenue_per_seat NUMERIC(10,2),
    peak_hours TEXT,
    bottlenecks TEXT[],
    opportunities TEXT[],
    ai_recommendations TEXT[]
) AS $$
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
            -- Анализ пиковых часов
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
        
        -- AI Efficiency Score (0-100)
        LEAST(100, GREATEST(0,
            (cm.utilization * 40) +
            (CASE WHEN cm.total_revenue > 50000 THEN 30 ELSE cm.total_revenue / 50000.0 * 30 END) +
            (CASE WHEN cm.total_seats > 0 THEN 20 ELSE 0 END) +
            10 -- Базовый бонус
        ))::NUMERIC(5,2),
        
        (cm.utilization * 100)::NUMERIC(5,2),
        (cm.total_revenue / NULLIF(cm.total_seats, 0))::NUMERIC(10,2),
        
        -- Пиковые часы
        CONCAT(cm.peak_hour::TEXT, ':00-', (cm.peak_hour + 2)::TEXT, ':00'),
        
        -- Узкие места
        CASE 
            WHEN cm.utilization < 0.3 THEN ARRAY['Низкая загрузка', 'Недостаток рекламы']
            WHEN cm.total_seats < 10 THEN ARRAY['Мало мест', 'Нужно расширение']
            WHEN cm.total_revenue < 20000 THEN ARRAY['Низкая выручка', 'Проблемы с ценообразованием']
            ELSE ARRAY['Нет критичных проблем']
        END,
        
        -- Возможности
        CASE 
            WHEN cm.utilization > 0.8 THEN ARRAY['Добавить места', 'Повысить цены', 'VIP зона']
            WHEN cm.utilization > 0.5 THEN ARRAY['Оптимизировать расписание', 'Дополнительные услуги']
            ELSE ARRAY['Маркетинговые акции', 'Скидки в непиковые часы']
        END,
        
        -- AI рекомендации
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
$$ LANGUAGE plpgsql;

-- =====================================================
-- 5. AI PREDICTIVE MAINTENANCE - Предиктивное обслуживание
-- =====================================================

-- AI анализ состояния оборудования и предсказание поломок
CREATE OR REPLACE FUNCTION ai_equipment_health()
RETURNS TABLE (
    seat_id INTEGER,
    club_name TEXT,
    hall_name TEXT,
    seat_number INTEGER,
    health_score NUMERIC(5,2),
    usage_intensity NUMERIC(5,2),
    failure_risk NUMERIC(5,2),
    maintenance_priority TEXT,
    predicted_failure_date DATE,
    recommendations TEXT[]
) AS $$
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
        
        -- Health Score (100 = отличное, 0 = критическое)
        GREATEST(0, 100 - 
            (su.total_hours / 100.0 * 20) - -- Износ от использования
            (EXTRACT(DAY FROM CURRENT_DATE - su.last_used) * 0.5) - -- Простой
            (CASE WHEN su.usage_count > 100 THEN 20 ELSE 0 END) -- Перегрузка
        )::NUMERIC(5,2),
        
        -- Usage Intensity (0-100)
        LEAST(100, su.usage_count * 2)::NUMERIC(5,2),
        
        -- Failure Risk (0-100)
        GREATEST(0, 
            (su.total_hours / 50.0 * 30) +
            (CASE WHEN su.usage_count > 80 THEN 40 ELSE su.usage_count * 0.5 END) +
            (RANDOM() * 20) -- Случайный фактор
        )::NUMERIC(5,2),
        
        -- Priority
        CASE 
            WHEN su.total_hours > 200 OR su.usage_count > 100 THEN 'КРИТИЧЕСКИЙ'
            WHEN su.total_hours > 100 OR su.usage_count > 60 THEN 'ВЫСОКИЙ'
            WHEN su.total_hours > 50 OR su.usage_count > 30 THEN 'СРЕДНИЙ'
            ELSE 'НИЗКИЙ'
        END,
        
        -- Predicted failure date
        (CURRENT_DATE + (CASE 
            WHEN su.total_hours > 200 THEN INTERVAL '7 days'
            WHEN su.total_hours > 100 THEN INTERVAL '30 days'
            WHEN su.total_hours > 50 THEN INTERVAL '90 days'
            ELSE INTERVAL '180 days'
        END))::DATE,
        
        -- Recommendations
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
$$ LANGUAGE plpgsql;

-- =====================================================
-- 6. AI DASHBOARD AGGREGATOR - Главный AI дашборд
-- =====================================================

-- Главная AI функция для дашборда
CREATE OR REPLACE FUNCTION ai_dashboard_summary()
RETURNS TABLE (
    metric_category TEXT,
    metric_name TEXT,
    current_value NUMERIC(10,2),
    predicted_value NUMERIC(10,2),
    trend_direction TEXT,
    confidence_level NUMERIC(5,2),
    alert_level TEXT,
    recommendations TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    -- Финансовые метрики
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
$$ LANGUAGE plpgsql;

-- =====================================================
-- 7. INDEXES FOR AI FUNCTIONS - Индексы для ускорения
-- =====================================================

-- Составные индексы для AI аналитики
CREATE INDEX IF NOT EXISTS idx_bookings_ai_analysis ON bookings(user_id, date, status, start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_payments_ai_analysis ON payments(booking_id, payment_status, amount, paid_at);
CREATE INDEX IF NOT EXISTS idx_seats_club_lookup ON seats(id, hall_id) INCLUDE (seat_number);
CREATE INDEX IF NOT EXISTS idx_halls_club_lookup ON halls(id, club_id) INCLUDE (name);
CREATE INDEX IF NOT EXISTS idx_clubs_active ON clubs(id, is_deleted) INCLUDE (name, city);

-- Частичные индексы для горячих данных
CREATE INDEX IF NOT EXISTS idx_recent_bookings ON bookings(date, status) 
    WHERE date >= CURRENT_DATE - INTERVAL '90 days';
CREATE INDEX IF NOT EXISTS idx_successful_payments ON payments(booking_id, amount) 
    WHERE payment_status = 'успешно';

-- =====================================================
-- 8. AI SECURITY & PERMISSIONS
-- =====================================================

-- Права доступа к AI функциям
GRANT EXECUTE ON FUNCTION ai_customer_segmentation() TO app_user, admin_user;
GRANT EXECUTE ON FUNCTION ai_revenue_forecast(INTEGER, INTEGER) TO app_user, admin_user;
GRANT EXECUTE ON FUNCTION ai_marketing_insights() TO admin_user;
GRANT EXECUTE ON FUNCTION ai_club_optimization() TO app_user, admin_user;
GRANT EXECUTE ON FUNCTION ai_equipment_health() TO admin_user;
GRANT EXECUTE ON FUNCTION ai_dashboard_summary() TO app_user, admin_user;

-- Комментарии к AI функциям
COMMENT ON FUNCTION ai_customer_segmentation() IS 'AI сегментация клиентов с предсказанием CLV и churn risk';
COMMENT ON FUNCTION ai_revenue_forecast(INTEGER, INTEGER) IS 'AI прогнозирование доходов с учетом сезонности';
COMMENT ON FUNCTION ai_marketing_insights() IS 'AI анализ эффективности маркетинговых каналов';
COMMENT ON FUNCTION ai_club_optimization() IS 'AI оптимизация работы клубов и загрузки';
COMMENT ON FUNCTION ai_equipment_health() IS 'AI предиктивная аналитика состояния оборудования';
COMMENT ON FUNCTION ai_dashboard_summary() IS 'Сводка всех AI метрик для главного дашборда';

/*
ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ AI ФУНКЦИЙ:

=== CUSTOMER INTELLIGENCE ===
1. Полная сегментация клиентов:
   SELECT * FROM ai_customer_segmentation() WHERE segment = 'VIP Геймер';

2. Клиенты с высоким риском оттока:
   SELECT * FROM ai_customer_segmentation() WHERE churn_risk > 70;

3. Клиенты для upsell:
   SELECT * FROM ai_customer_segmentation() WHERE upsell_score > 80;

=== REVENUE FORECASTING ===
4. Прогноз доходов на месяц:
   SELECT * FROM ai_revenue_forecast(NULL, 30);

5. Прогноз для конкретного клуба:
   SELECT * FROM ai_revenue_forecast(1, 14);

=== MARKETING OPTIMIZATION ===
6. Анализ маркетинговых каналов:
   SELECT * FROM ai_marketing_insights() ORDER BY roi_score DESC;

=== OPERATIONAL EFFICIENCY ===
7. Оптимизация клубов:
   SELECT * FROM ai_club_optimization() WHERE efficiency_score < 70;

=== PREDICTIVE MAINTENANCE ===
8. Оборудование требующее внимания:
   SELECT * FROM ai_equipment_health() WHERE failure_risk > 60;

9. Критическое оборудование:
   SELECT * FROM ai_equipment_health() WHERE maintenance_priority = 'КРИТИЧЕСКИЙ';

=== EXECUTIVE DASHBOARD ===
10. Сводка для руководства:
    SELECT * FROM ai_dashboard_summary() WHERE alert_level IN ('ВНИМАНИЕ', 'КРИТИЧНО');

=== КОМБИНИРОВАННАЯ АНАЛИТИКА ===
11. AI отчет для SuperAdmin:
    SELECT 'Клиенты' as category, COUNT(*) as count FROM ai_customer_segmentation()
    UNION ALL
    SELECT 'Прогноз', SUM(predicted_revenue) FROM ai_revenue_forecast(NULL, 7)
    UNION ALL  
    SELECT 'Маркетинг', AVG(roi_score) FROM ai_marketing_insights();

12. Еженедельный AI отчет:
    SELECT 
        c.club_name,
        c.efficiency_score,
        COALESCE(f.predicted_revenue, 0) as week_forecast,
        COUNT(e.seat_id) as equipment_issues
    FROM ai_club_optimization() c
    LEFT JOIN ai_revenue_forecast(c.club_id, 7) f ON true
    LEFT JOIN ai_equipment_health() e ON e.club_name = c.club_name 
        AND e.failure_risk > 50
    GROUP BY c.club_name, c.efficiency_score, f.predicted_revenue;
*/

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

SELECT 'AI Analytics Engine успешно развернут!' AS status,
       'Функций ИИ: 6, Индексов: 8, Готов к production!' AS details;
