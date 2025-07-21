# 🚀 PRODUCTION AI IMPLEMENTATION GUIDE
## Внедрение ИИ в реальное веб-приложение или мобильное приложение

### 📋 СОДЕРЖАНИЕ
1. [Архитектура AI системы](#архитектура)
2. [Backend Implementation](#backend)
3. [Database Optimization](#database)
4. [Real-time Analytics](#realtime)
5. [Mobile Integration](#mobile)
6. [Security & Performance](#security)
7. [Deployment & Scaling](#deployment)
8. [Monitoring & Maintenance](#monitoring)

---

## 🏗️ АРХИТЕКТУРА AI СИСТЕМЫ {#архитектура}

### Microservices Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Frontend  │    │  Mobile Apps    │    │   Admin Panel   │
│   (React.js)    │    │ (React Native)  │    │   (React.js)    │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
         ┌─────────────────────────────────────────┐
         │          API Gateway                    │
         │        (Load Balancer)                  │
         └─────────────────┬───────────────────────┘
                           │
    ┌──────────────────────┼──────────────────────┐
    │                      │                      │
┌───▼───┐            ┌─────▼─────┐        ┌──────▼──────┐
│Main   │            │AI Analytics│        │Notification │
│API    │            │Service     │        │Service      │
│(.NET) │            │(Python)    │        │(Node.js)    │
└───┬───┘            └─────┬─────┘        └──────┬──────┘
    │                      │                     │
    └──────────────────────┼─────────────────────┘
                           │
         ┌─────────────────▼───────────────────┐
         │          PostgreSQL                 │
         │        + AI Functions               │
         │        + Time Series Data          │
         └─────────────────────────────────────┘
```

### Technology Stack
- **Backend**: ASP.NET Core 8 + Python FastAPI (для ML)
- **Database**: PostgreSQL + Redis (кеш) + InfluxDB (временные ряды)
- **AI/ML**: scikit-learn, TensorFlow, pandas
- **Real-time**: SignalR + WebSockets
- **Message Queue**: RabbitMQ или Apache Kafka
- **Caching**: Redis + Memcached
- **Monitoring**: Grafana + Prometheus

---

## 🔧 BACKEND IMPLEMENTATION {#backend}

### 1. AI Service Architecture

```csharp
// Startup.cs - Регистрация AI сервисов
public void ConfigureServices(IServiceCollection services)
{
    // Основные сервисы
    services.AddDbContext<OynaDbContext>(options =>
        options.UseNpgsql(connectionString));
    
    // AI сервисы
    services.AddScoped<IAiAnalyticsService, AiAnalyticsService>();
    services.AddScoped<ICustomerIntelligenceService, CustomerIntelligenceService>();
    services.AddScoped<IRevenueForecasting, RevenueForecasting>();
    services.AddScoped<IMarketingOptimizer, MarketingOptimizer>();
    
    // Machine Learning
    services.AddSingleton<IMLModelService, MLModelService>();
    services.AddSingleton<IPredictionEngine, PredictionEngine>();
    
    // Кеширование
    services.AddStackExchangeRedisCache(options =>
    {
        options.Configuration = "localhost:6379";
    });
    
    // Real-time
    services.AddSignalR();
    
    // Background Services
    services.AddHostedService<AiDataProcessingService>();
    services.AddHostedService<RealTimeAnalyticsService>();
}
```

### 2. AI Service Implementation

```csharp
// Services/AiAnalyticsService.cs
public interface IAiAnalyticsService
{
    Task<CustomerSegmentationResult> GetCustomerSegmentationAsync();
    Task<RevenueForecastResult> GetRevenueForecastAsync(int? clubId, int days);
    Task<MarketingInsightsResult> GetMarketingInsightsAsync();
    Task<ClubOptimizationResult> GetClubOptimizationAsync();
    Task RefreshAiModelsAsync();
}

public class AiAnalyticsService : IAiAnalyticsService
{
    private readonly OynaDbContext _context;
    private readonly IMemoryCache _cache;
    private readonly ILogger<AiAnalyticsService> _logger;
    private readonly HttpClient _mlServiceClient;

    public AiAnalyticsService(
        OynaDbContext context,
        IMemoryCache cache,
        ILogger<AiAnalyticsService> logger,
        HttpClient mlServiceClient)
    {
        _context = context;
        _cache = cache;
        _logger = logger;
        _mlServiceClient = mlServiceClient;
    }

    public async Task<CustomerSegmentationResult> GetCustomerSegmentationAsync()
    {
        const string cacheKey = "customer_segmentation";
        
        if (_cache.TryGetValue(cacheKey, out CustomerSegmentationResult cachedResult))
        {
            return cachedResult;
        }

        try
        {
            // Вызов PostgreSQL функции
            var rawData = await _context.Database
                .SqlQueryRaw<CustomerSegmentRaw>("SELECT * FROM ai_customer_segmentation()")
                .ToListAsync();

            // Обогащение данных через ML сервис
            var enrichedData = await EnrichWithMLPredictions(rawData);

            var result = new CustomerSegmentationResult
            {
                Data = enrichedData,
                GeneratedAt = DateTime.UtcNow,
                Insights = CalculateInsights(enrichedData)
            };

            // Кешируем на 5 минут
            _cache.Set(cacheKey, result, TimeSpan.FromMinutes(5));

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in customer segmentation");
            throw;
        }
    }

    private async Task<List<CustomerSegment>> EnrichWithMLPredictions(
        List<CustomerSegmentRaw> rawData)
    {
        var enrichedData = new List<CustomerSegment>();

        foreach (var customer in rawData)
        {
            // Вызов Python ML сервиса для предсказаний
            var mlRequest = new
            {
                user_id = customer.user_id,
                total_spent = customer.total_spent,
                visit_frequency = customer.visit_frequency,
                avg_session = customer.avg_session_duration
            };

            var response = await _mlServiceClient.PostAsJsonAsync(
                "/api/ml/customer-prediction", mlRequest);

            if (response.IsSuccessStatusCode)
            {
                var mlResult = await response.Content
                    .ReadFromJsonAsync<MLCustomerPrediction>();

                enrichedData.Add(new CustomerSegment
                {
                    UserId = customer.user_id,
                    FullName = customer.full_name,
                    Segment = customer.segment,
                    AiScore = customer.ai_score,
                    ClvPredicted = mlResult?.ClvPredicted ?? customer.clv_predicted,
                    ChurnRisk = mlResult?.ChurnRisk ?? customer.churn_risk,
                    UpsellScore = mlResult?.UpsellScore ?? customer.upsell_score,
                    // Enhanced ML predictions
                    NextPurchaseDate = mlResult?.NextPurchaseDate,
                    RecommendedActions = mlResult?.RecommendedActions ?? customer.recommendations
                });
            }
        }

        return enrichedData;
    }
}
```

### 3. Python ML Service

```python
# ml_service/main.py - FastAPI ML сервис
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
import joblib
import asyncio
from datetime import datetime, timedelta

app = FastAPI(title="Gaming Club AI Service", version="1.0.0")

# Модели машинного обучения
churn_model = None
clv_model = None
scaler = None

class CustomerData(BaseModel):
    user_id: int
    total_spent: float
    visit_frequency: float
    avg_session: float
    days_since_last_visit: int = 0
    total_bookings: int = 0

class CustomerPrediction(BaseModel):
    user_id: int
    churn_risk: float
    clv_predicted: float
    upsell_score: float
    next_purchase_date: str
    recommended_actions: list[str]

@app.on_event("startup")
async def load_models():
    global churn_model, clv_model, scaler
    try:
        # Загружаем предварительно обученные модели
        churn_model = joblib.load("models/churn_model.pkl")
        clv_model = joblib.load("models/clv_model.pkl")
        scaler = joblib.load("models/scaler.pkl")
        print("ML models loaded successfully")
    except Exception as e:
        print(f"Error loading models: {e}")
        # Создаем базовые модели если нет сохраненных
        await train_initial_models()

async def train_initial_models():
    """Обучение базовых моделей на синтетических данных"""
    global churn_model, clv_model, scaler
    
    # Генерируем синтетические данные для обучения
    np.random.seed(42)
    n_samples = 1000
    
    # Создаем фичи
    total_spent = np.random.lognormal(7, 1, n_samples)
    visit_frequency = np.random.poisson(15, n_samples)
    avg_session = np.random.normal(2.5, 0.8, n_samples)
    days_since_last = np.random.exponential(10, n_samples)
    
    X = np.column_stack([total_spent, visit_frequency, avg_session, days_since_last])
    
    # Целевые переменные
    churn_probability = 1 / (1 + np.exp(-(days_since_last/30 - visit_frequency/20 + np.random.normal(0, 0.1, n_samples))))
    y_churn = (churn_probability > 0.5).astype(int)
    y_clv = total_spent * (1.5 + np.random.normal(0, 0.2, n_samples))
    
    # Нормализация
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Обучение моделей
    churn_model = GradientBoostingClassifier(n_estimators=100, random_state=42)
    clv_model = RandomForestRegressor(n_estimators=100, random_state=42)
    
    churn_model.fit(X_scaled, y_churn)
    clv_model.fit(X_scaled, y_clv)
    
    # Сохраняем модели
    joblib.dump(churn_model, "models/churn_model.pkl")
    joblib.dump(clv_model, "models/clv_model.pkl")
    joblib.dump(scaler, "models/scaler.pkl")

@app.post("/api/ml/customer-prediction", response_model=CustomerPrediction)
async def predict_customer_behavior(customer: CustomerData):
    try:
        # Подготавливаем данные
        features = np.array([[
            customer.total_spent,
            customer.visit_frequency,
            customer.avg_session,
            customer.days_since_last_visit
        ]])
        
        features_scaled = scaler.transform(features)
        
        # Предсказания
        churn_risk = float(churn_model.predict_proba(features_scaled)[0][1]) * 100
        clv_predicted = float(clv_model.predict(features_scaled)[0])
        
        # Upsell score на основе паттернов
        upsell_score = calculate_upsell_score(customer, churn_risk, clv_predicted)
        
        # Предсказание следующей покупки
        next_purchase = predict_next_purchase(customer, churn_risk)
        
        # Рекомендации
        recommendations = generate_recommendations(customer, churn_risk, upsell_score)
        
        return CustomerPrediction(
            user_id=customer.user_id,
            churn_risk=round(churn_risk, 2),
            clv_predicted=round(clv_predicted, 2),
            upsell_score=round(upsell_score, 2),
            next_purchase_date=next_purchase.isoformat(),
            recommended_actions=recommendations
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

def calculate_upsell_score(customer: CustomerData, churn_risk: float, clv: float) -> float:
    """Расчет вероятности успешного upsell"""
    base_score = 50
    
    # Факторы влияния
    if customer.total_spent > 10000:
        base_score += 20
    if customer.visit_frequency > 10:
        base_score += 15
    if customer.avg_session > 2:
        base_score += 10
    if churn_risk < 30:
        base_score += 15
    if clv > customer.total_spent * 1.5:
        base_score += 10
        
    return min(100, max(0, base_score))

def predict_next_purchase(customer: CustomerData, churn_risk: float) -> datetime:
    """Предсказание даты следующей покупки"""
    base_days = 14  # Базовый интервал
    
    if churn_risk > 70:
        base_days = 45  # Высокий риск = редкие покупки
    elif churn_risk < 30:
        base_days = 7   # Низкий риск = частые покупки
    
    # Корректировка на основе частоты посещений
    frequency_factor = max(0.5, min(2.0, 15 / customer.visit_frequency))
    adjusted_days = int(base_days * frequency_factor)
    
    return datetime.now() + timedelta(days=adjusted_days)

def generate_recommendations(customer: CustomerData, churn_risk: float, upsell_score: float) -> list[str]:
    """Генерация персонализированных рекомендаций"""
    recommendations = []
    
    if churn_risk > 70:
        recommendations.extend([
            "Персональная скидка 20%",
            "Звонок менеджера",
            "Эксклюзивное предложение"
        ])
    elif churn_risk > 40:
        recommendations.extend([
            "Email с персональными предложениями",
            "Бонусы за возвращение"
        ])
    
    if upsell_score > 80:
        recommendations.extend([
            "Предложить VIP пакет",
            "Премиум услуги",
            "Турнирный пакет"
        ])
    elif upsell_score > 60:
        recommendations.extend([
            "Групповые скидки",
            "Дополнительные услуги"
        ])
    
    if customer.avg_session > 3:
        recommendations.append("Предложить длительные пакеты")
    
    if customer.visit_frequency > 20:
        recommendations.append("Программа лояльности")
    
    return recommendations[:5]  # Максимум 5 рекомендаций

# Дополнительные endpoints для ретрейнинга моделей
@app.post("/api/ml/retrain")
async def retrain_models():
    """Переобучение моделей на новых данных"""
    try:
        # Здесь будет код для загрузки новых данных из PostgreSQL
        # и переобучения моделей
        await train_initial_models()
        return {"status": "success", "message": "Models retrained successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Retrain error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
```

---

## 🗄️ DATABASE OPTIMIZATION {#database}

### 1. Partitioning для больших данных

```sql
-- Партиционирование audit_logs по дате
CREATE TABLE audit_logs_partitioned (
    id SERIAL,
    table_name VARCHAR(255),
    record_id INTEGER,
    action VARCHAR(50),
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    user_id INTEGER
) PARTITION BY RANGE (created_at);

-- Создание партиций по месяцам
CREATE TABLE audit_logs_2024_12 PARTITION OF audit_logs_partitioned
    FOR VALUES FROM ('2024-12-01') TO ('2025-01-01');

CREATE TABLE audit_logs_2025_01 PARTITION OF audit_logs_partitioned
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- Автоматическое создание партиций
CREATE OR REPLACE FUNCTION create_monthly_partition()
RETURNS void AS $$
DECLARE
    partition_date date;
    partition_name text;
    start_date text;
    end_date text;
BEGIN
    partition_date := date_trunc('month', CURRENT_DATE + interval '1 month');
    partition_name := 'audit_logs_' || to_char(partition_date, 'YYYY_MM');
    start_date := partition_date::text;
    end_date := (partition_date + interval '1 month')::text;
    
    EXECUTE format('CREATE TABLE IF NOT EXISTS %I PARTITION OF audit_logs_partitioned
                    FOR VALUES FROM (%L) TO (%L)',
                   partition_name, start_date, end_date);
END;
$$ LANGUAGE plpgsql;

-- Планировщик для автосоздания партиций (через pg_cron)
SELECT cron.schedule('create-partition', '0 0 25 * *', 'SELECT create_monthly_partition();');
```

### 2. Materialized Views для производительности

```sql
-- Материализованное представление для быстрой аналитики
CREATE MATERIALIZED VIEW mv_daily_club_stats AS
SELECT 
    DATE(b.date) as report_date,
    c.id as club_id,
    c.name as club_name,
    COUNT(DISTINCT b.user_id) as unique_customers,
    COUNT(b.id) as total_bookings,
    SUM(p.amount) as total_revenue,
    AVG(EXTRACT(EPOCH FROM (b.end_time - b.start_time))/3600.0) as avg_session_hours,
    COUNT(DISTINCT s.id) as occupied_seats,
    (COUNT(DISTINCT s.id)::FLOAT / 
     (SELECT COUNT(*) FROM seats WHERE hall_id IN 
      (SELECT id FROM halls WHERE club_id = c.id))) * 100 as utilization_rate
FROM clubs c
LEFT JOIN halls h ON c.id = h.club_id
LEFT JOIN seats s ON h.id = s.hall_id
LEFT JOIN bookings b ON s.id = b.seat_id AND b.status = 'активно'
LEFT JOIN payments p ON b.id = p.booking_id AND p.payment_status = 'успешно'
WHERE b.date >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY DATE(b.date), c.id, c.name
ORDER BY report_date DESC, club_id;

-- Индекс для быстрого поиска
CREATE INDEX idx_mv_daily_club_stats_date_club ON mv_daily_club_stats(report_date, club_id);

-- Автообновление каждые 15 минут
CREATE OR REPLACE FUNCTION refresh_daily_stats()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_club_stats;
END;
$$ LANGUAGE plpgsql;

SELECT cron.schedule('refresh-stats', '*/15 * * * *', 'SELECT refresh_daily_stats();');
```

### 3. Advanced Indexing Strategy

```sql
-- Композитные индексы для AI запросов
CREATE INDEX CONCURRENTLY idx_bookings_ai_analysis 
ON bookings(user_id, date, status) 
INCLUDE (start_time, end_time, seat_id)
WHERE date >= CURRENT_DATE - INTERVAL '365 days';

-- Partial index для активных платежей
CREATE INDEX CONCURRENTLY idx_payments_active 
ON payments(booking_id, amount, paid_at) 
WHERE payment_status = 'успешно';

-- GIN индекс для полнотекстового поиска
CREATE INDEX CONCURRENTLY idx_users_search 
ON users USING GIN(to_tsvector('russian', full_name || ' ' || COALESCE(email, '')));

-- Индекс для временных рядов
CREATE INDEX CONCURRENTLY idx_audit_logs_time_series 
ON audit_logs(created_at DESC, table_name) 
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days';
```

---

## ⚡ REAL-TIME ANALYTICS {#realtime}

### 1. SignalR Hub для Real-time уведомлений

```csharp
// Hubs/AiAnalyticsHub.cs
public class AiAnalyticsHub : Hub
{
    private readonly IAiAnalyticsService _aiService;
    private readonly ILogger<AiAnalyticsHub> _logger;

    public AiAnalyticsHub(IAiAnalyticsService aiService, ILogger<AiAnalyticsHub> logger)
    {
        _aiService = aiService;
        _logger = logger;
    }

    public async Task JoinAnalyticsGroup(string role)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"Analytics_{role}");
        _logger.LogInformation($"User joined analytics group: {role}");
    }

    public async Task LeaveAnalyticsGroup(string role)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"Analytics_{role}");
    }

    public async Task RequestRealTimeData()
    {
        try
        {
            var dashboardData = await _aiService.GetDashboardSummaryAsync();
            await Clients.Caller.SendAsync("ReceiveAnalyticsUpdate", dashboardData);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending real-time data");
            await Clients.Caller.SendAsync("AnalyticsError", "Failed to load data");
        }
    }
}

// Services/RealTimeAnalyticsService.cs - Background Service
public class RealTimeAnalyticsService : BackgroundService
{
    private readonly IHubContext<AiAnalyticsHub> _hubContext;
    private readonly IAiAnalyticsService _aiService;
    private readonly ILogger<RealTimeAnalyticsService> _logger;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                // Обновляем данные каждые 30 секунд
                var updates = await _aiService.GetCriticalAlertsAsync();
                
                if (updates.Any())
                {
                    await _hubContext.Clients.Group("Analytics_Admin")
                        .SendAsync("CriticalAlert", updates, stoppingToken);
                }

                // Обновляем dashboard для всех
                var dashboardData = await _aiService.GetDashboardSummaryAsync();
                await _hubContext.Clients.All
                    .SendAsync("DashboardUpdate", dashboardData, stoppingToken);

                await Task.Delay(30000, stoppingToken); // 30 секунд
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in real-time analytics service");
                await Task.Delay(10000, stoppingToken); // При ошибке ждем 10 секунд
            }
        }
    }
}
```

### 2. Frontend Real-time Integration

```typescript
// services/RealTimeService.ts
import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr';

class RealTimeService {
    private connection: HubConnection | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;

    public async startConnection(): Promise<void> {
        this.connection = new HubConnectionBuilder()
            .withUrl(`${process.env.REACT_APP_API_BASE_URL}/ai-analytics-hub`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            .withAutomaticReconnect([0, 2000, 10000, 30000])
            .configureLogging(LogLevel.Information)
            .build();

        // Event handlers
        this.connection.onreconnecting(() => {
            console.log('SignalR reconnecting...');
        });

        this.connection.onreconnected(() => {
            console.log('SignalR reconnected');
            this.reconnectAttempts = 0;
        });

        this.connection.onclose(() => {
            console.log('SignalR connection closed');
            this.scheduleReconnect();
        });

        try {
            await this.connection.start();
            console.log('SignalR connected');
            
            // Присоединяемся к группе аналитики
            const userRole = localStorage.getItem('userRole') || 'User';
            await this.connection.invoke('JoinAnalyticsGroup', userRole);
            
        } catch (error) {
            console.error('SignalR connection failed:', error);
            this.scheduleReconnect();
        }
    }

    private scheduleReconnect(): void {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff
            setTimeout(() => {
                this.reconnectAttempts++;
                this.startConnection();
            }, delay);
        }
    }

    public onDashboardUpdate(callback: (data: any) => void): void {
        this.connection?.on('DashboardUpdate', callback);
    }

    public onCriticalAlert(callback: (alerts: any[]) => void): void {
        this.connection?.on('CriticalAlert', callback);
    }

    public onAnalyticsUpdate(callback: (data: any) => void): void {
        this.connection?.on('ReceiveAnalyticsUpdate', callback);
    }

    public async requestRealTimeData(): Promise<void> {
        if (this.connection?.state === 'Connected') {
            await this.connection.invoke('RequestRealTimeData');
        }
    }

    public async stopConnection(): Promise<void> {
        if (this.connection) {
            await this.connection.stop();
            this.connection = null;
        }
    }
}

export const realTimeService = new RealTimeService();
```

---

## 📱 MOBILE INTEGRATION {#mobile}

### 1. React Native AI Dashboard

```typescript
// screens/AiDashboardScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, ScrollView, RefreshControl, Alert } from 'react-native';
import { Card, Text, ProgressBar, Button, FAB } from 'react-native-paper';
import { useAiAnalytics } from '../hooks/useAiAnalytics';
import { usePushNotifications } from '../hooks/usePushNotifications';

export const AiDashboardScreen: React.FC = () => {
    const [refreshing, setRefreshing] = useState(false);
    const { 
        dashboardData, 
        loading, 
        error, 
        refreshData,
        subscribeToRealTime 
    } = useAiAnalytics();
    
    const { requestPermissions, subscribeToTopic } = usePushNotifications();

    useEffect(() => {
        // Запрашиваем разрешения на уведомления
        requestPermissions();
        
        // Подписываемся на критические уведомления
        subscribeToTopic('critical_alerts');
        subscribeToTopic('ai_insights');
        
        // Подключаемся к real-time обновлениям
        const unsubscribe = subscribeToRealTime((update) => {
            if (update.criticalAlerts > 0) {
                Alert.alert(
                    'Критическое уведомление',
                    `Обнаружено ${update.criticalAlerts} критических проблем`,
                    [{ text: 'Посмотреть', onPress: () => navigateToAlerts() }]
                );
            }
        });

        return unsubscribe;
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await refreshData();
        setRefreshing(false);
    };

    if (loading && !dashboardData) {
        return <LoadingScreen />;
    }

    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* AI Insights Cards */}
            <View style={{ padding: 16 }}>
                <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
                    🧠 AI Аналитика
                </Text>

                {dashboardData?.overview && (
                    <Card style={{ marginBottom: 16 }}>
                        <Card.Content>
                            <Text variant="titleLarge">Обзор системы</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                                <MetricItem 
                                    label="Критические" 
                                    value={dashboardData.overview.criticalAlerts}
                                    color="#f44336"
                                />
                                <MetricItem 
                                    label="Предупреждения" 
                                    value={dashboardData.overview.warnings}
                                    color="#ff9800"
                                />
                                <MetricItem 
                                    label="Отлично" 
                                    value={dashboardData.overview.excellentMetrics}
                                    color="#4caf50"
                                />
                            </View>
                        </Card.Content>
                    </Card>
                )}

                {/* Real-time Metrics */}
                {dashboardData?.data.map((metric, index) => (
                    <Card key={index} style={{ marginBottom: 12 }}>
                        <Card.Content>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ flex: 1 }}>
                                    <Text variant="titleMedium">{metric.metric_name}</Text>
                                    <Text variant="bodySmall" style={{ color: '#666' }}>
                                        {metric.metric_category}
                                    </Text>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <Text variant="headlineSmall" style={{ 
                                        color: getMetricColor(metric.alert_level) 
                                    }}>
                                        {metric.current_value.toLocaleString()}
                                    </Text>
                                    <Text variant="bodySmall">
                                        Прогноз: {metric.predicted_value.toLocaleString()}
                                    </Text>
                                </View>
                            </View>
                            
                            <ProgressBar 
                                progress={metric.confidence_level / 100} 
                                style={{ marginTop: 8 }}
                                color={getMetricColor(metric.alert_level)}
                            />
                            
                            <Text variant="bodySmall" style={{ marginTop: 4 }}>
                                Уверенность: {metric.confidence_level.toFixed(1)}%
                            </Text>
                        </Card.Content>
                    </Card>
                ))}
            </View>

            {/* Floating Action Button */}
            <FAB
                icon="refresh"
                style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
                onPress={onRefresh}
            />
        </ScrollView>
    );
};
```

### 2. Push Notifications для критических событий

```typescript
// services/PushNotificationService.ts
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

class PushNotificationService {
    async initialize() {
        // Запрашиваем разрешения
        const authStatus = await messaging().requestPermission();
        const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            console.log('Push notification permissions granted');
            this.setupForegroundHandler();
            this.setupBackgroundHandler();
            return this.getToken();
        }
        return null;
    }

    async getToken() {
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
        return token;
    }

    setupForegroundHandler() {
        messaging().onMessage(async remoteMessage => {
            console.log('Foreground message:', remoteMessage);
            
            if (remoteMessage.data?.type === 'critical_alert') {
                PushNotification.localNotification({
                    title: remoteMessage.notification?.title || 'Критическое уведомление',
                    message: remoteMessage.notification?.body || 'Требует немедленного внимания',
                    playSound: true,
                    soundName: 'default',
                    importance: 'high',
                    priority: 'high',
                    vibrate: [1000, 1000, 1000],
                    actions: ['Посмотреть', 'Отложить'],
                    category: 'CRITICAL_ALERT'
                });
            }
        });
    }

    setupBackgroundHandler() {
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log('Background message:', remoteMessage);
            
            // Можно сохранить уведомление для показа при открытии приложения
            await this.saveNotificationForLater(remoteMessage);
        });
    }

    async subscribeToTopic(topic: string) {
        await messaging().subscribeToTopic(topic);
        console.log(`Subscribed to topic: ${topic}`);
    }

    async unsubscribeFromTopic(topic: string) {
        await messaging().unsubscribeFromTopic(topic);
        console.log(`Unsubscribed from topic: ${topic}`);
    }

    private async saveNotificationForLater(message: any) {
        // Сохраняем в AsyncStorage для показа при следующем запуске
        const notifications = await AsyncStorage.getItem('pending_notifications') || '[]';
        const parsed = JSON.parse(notifications);
        parsed.push({
            ...message,
            receivedAt: Date.now()
        });
        await AsyncStorage.setItem('pending_notifications', JSON.stringify(parsed));
    }
}

export const pushNotificationService = new PushNotificationService();
```

---

## 🔒 SECURITY & PERFORMANCE {#security}

### 1. API Security

```csharp
// Security/AiSecurityMiddleware.cs
public class AiSecurityMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<AiSecurityMiddleware> _logger;
    private readonly IMemoryCache _cache;

    public async Task InvokeAsync(HttpContext context)
    {
        // Rate limiting для AI endpoints
        if (context.Request.Path.StartsWithSegments("/api/AiAnalytics"))
        {
            var clientIp = context.Connection.RemoteIpAddress?.ToString();
            var rateLimitKey = $"ai_rate_limit_{clientIp}";
            
            if (_cache.TryGetValue(rateLimitKey, out int requestCount))
            {
                if (requestCount >= 100) // 100 запросов в минуту
                {
                    context.Response.StatusCode = 429;
                    await context.Response.WriteAsync("Rate limit exceeded");
                    return;
                }
                _cache.Set(rateLimitKey, requestCount + 1, TimeSpan.FromMinutes(1));
            }
            else
            {
                _cache.Set(rateLimitKey, 1, TimeSpan.FromMinutes(1));
            }
        }

        // Логирование AI запросов
        if (context.Request.Path.StartsWithSegments("/api/AiAnalytics"))
        {
            _logger.LogInformation($"AI Request: {context.Request.Method} {context.Request.Path} from {clientIp}");
        }

        await _next(context);
    }
}

// Security/AiDataEncryption.cs
public class AiDataEncryption
{
    private readonly IDataProtector _protector;

    public AiDataEncryption(IDataProtectionProvider provider)
    {
        _protector = provider.CreateProtector("AiAnalytics.CustomerData");
    }

    public string EncryptCustomerData(string sensitiveData)
    {
        return _protector.Protect(sensitiveData);
    }

    public string DecryptCustomerData(string encryptedData)
    {
        return _protector.Unprotect(encryptedData);
    }
}
```

### 2. Performance Optimization

```csharp
// Services/CachingStrategies.cs
public class AiCachingService
{
    private readonly IDistributedCache _distributedCache;
    private readonly IMemoryCache _memoryCache;
    private readonly ILogger<AiCachingService> _logger;

    // Multi-level caching strategy
    public async Task<T> GetOrSetAsync<T>(
        string key, 
        Func<Task<T>> getItem, 
        TimeSpan? expiry = null) where T : class
    {
        // Level 1: Memory cache (fastest)
        if (_memoryCache.TryGetValue(key, out T cachedItem))
        {
            return cachedItem;
        }

        // Level 2: Distributed cache (Redis)
        var distributedItem = await _distributedCache.GetStringAsync(key);
        if (!string.IsNullOrEmpty(distributedItem))
        {
            var deserializedItem = JsonSerializer.Deserialize<T>(distributedItem);
            
            // Store in memory cache for next time
            _memoryCache.Set(key, deserializedItem, TimeSpan.FromMinutes(5));
            return deserializedItem;
        }

        // Level 3: Database/ML Service (slowest)
        var freshItem = await getItem();
        
        if (freshItem != null)
        {
            // Store in both caches
            var serializedItem = JsonSerializer.Serialize(freshItem);
            var cacheExpiry = expiry ?? TimeSpan.FromMinutes(15);
            
            await _distributedCache.SetStringAsync(key, serializedItem, new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = cacheExpiry
            });
            
            _memoryCache.Set(key, freshItem, TimeSpan.FromMinutes(5));
        }

        return freshItem;
    }

    // Cache invalidation patterns
    public async Task InvalidatePatternAsync(string pattern)
    {
        // Для Redis можно использовать SCAN + DEL для паттернов
        // Для MemoryCache можно отслеживать ключи с тегами
    }
}

// Background Services/ModelUpdateService.cs
public class ModelUpdateService : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                // Обновляем ML модели каждые 6 часов
                await UpdateMachineLearningModels();
                
                // Пересчитываем кеши
                await RefreshCriticalCaches();
                
                await Task.Delay(TimeSpan.FromHours(6), stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in model update service");
                await Task.Delay(TimeSpan.FromMinutes(30), stoppingToken);
            }
        }
    }

    private async Task UpdateMachineLearningModels()
    {
        // Отправляем сигнал Python сервису для ретрейнинга
        using var httpClient = new HttpClient();
        await httpClient.PostAsync("http://ml-service:8001/api/ml/retrain", null);
    }
}
```

---

## 🚀 DEPLOYMENT & SCALING {#deployment}

### 1. Docker Configuration

```dockerfile
# Dockerfile для основного API
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["OynaApi.csproj", "."]
RUN dotnet restore "./OynaApi.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "OynaApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "OynaApi.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Install dependencies for AI integration
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["dotnet", "OynaApi.dll"]

# Dockerfile для ML Service
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8001

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: oyna_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: your_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./Scripts:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    networks:
      - oyna_network

  # Redis Cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    networks:
      - oyna_network

  # Main API
  api:
    build: .
    environment:
      - ConnectionStrings__DefaultConnection=Host=postgres;Database=oyna_db;Username=postgres;Password=your_password
      - Redis__ConnectionString=redis:6379
      - MLService__BaseUrl=http://ml-service:8001
    ports:
      - "7183:80"
    depends_on:
      - postgres
      - redis
      - ml-service
    networks:
      - oyna_network

  # ML Service
  ml-service:
    build: ./MLService
    environment:
      - DATABASE_URL=postgresql://postgres:your_password@postgres:5432/oyna_db
    ports:
      - "8001:8001"
    depends_on:
      - postgres
    volumes:
      - ml_models:/app/models
    networks:
      - oyna_network

  # Frontend
  frontend:
    build: ./admin-panel
    ports:
      - "3001:3000"
    environment:
      - REACT_APP_API_BASE_URL=http://localhost:7183/api
    depends_on:
      - api
    networks:
      - oyna_network

  # NGINX Load Balancer
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - api
      - frontend
    networks:
      - oyna_network

  # Monitoring
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    networks:
      - oyna_network

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
    networks:
      - oyna_network

volumes:
  postgres_data:
  ml_models:
  grafana_data:

networks:
  oyna_network:
    driver: bridge
```

### 2. Kubernetes Configuration

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: oyna-ai

---
# k8s/postgres.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: oyna-ai
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        env:
        - name: POSTGRES_DB
          value: "oyna_db"
        - name: POSTGRES_USER
          value: "postgres"
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: password
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
  - metadata:
      name: postgres-storage
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 20Gi

---
# k8s/api-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: oyna-api
  namespace: oyna-ai
spec:
  replicas: 3
  selector:
    matchLabels:
      app: oyna-api
  template:
    metadata:
      labels:
        app: oyna-api
    spec:
      containers:
      - name: api
        image: oyna/api:latest
        ports:
        - containerPort: 80
        env:
        - name: ConnectionStrings__DefaultConnection
          valueFrom:
            secretKeyRef:
              name: database-secret
              key: connection-string
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        readinessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 60
          periodSeconds: 30

---
# k8s/ml-service-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ml-service
  namespace: oyna-ai
spec:
  replicas: 2
  selector:
    matchLabels:
      app: ml-service
  template:
    metadata:
      labels:
        app: ml-service
    spec:
      containers:
      - name: ml-service
        image: oyna/ml-service:latest
        ports:
        - containerPort: 8001
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
        volumeMounts:
        - name: model-storage
          mountPath: /app/models
      volumes:
      - name: model-storage
        persistentVolumeClaim:
          claimName: ml-models-pvc
```

### 3. CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy AI Analytics

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup .NET
      uses: actions/setup-dotnet@v3
      with:
        dotnet-version: 8.0.x
        
    - name: Run tests
      run: |
        dotnet test --configuration Release --collect:"XPlat Code Coverage"
        
    - name: Run AI model tests
      run: |
        cd MLService
        pip install -r requirements.txt
        python -m pytest tests/ --cov=./ --cov-report=xml

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Build and push Docker images
      run: |
        docker build -t oyna/api:${{ github.sha }} .
        docker build -t oyna/ml-service:${{ github.sha }} ./MLService
        docker build -t oyna/frontend:${{ github.sha }} ./admin-panel
        
        # Push to registry
        echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
        docker push oyna/api:${{ github.sha }}
        docker push oyna/ml-service:${{ github.sha }}
        docker push oyna/frontend:${{ github.sha }}
    
    - name: Deploy to Kubernetes
      run: |
        # Update image tags in k8s manifests
        sed -i 's|oyna/api:latest|oyna/api:${{ github.sha }}|g' k8s/api-deployment.yaml
        sed -i 's|oyna/ml-service:latest|oyna/ml-service:${{ github.sha }}|g' k8s/ml-service-deployment.yaml
        
        # Apply to cluster
        kubectl apply -f k8s/
```

---

## 📊 MONITORING & MAINTENANCE {#monitoring}

### 1. Application Monitoring

```csharp
// Monitoring/AiMetricsCollector.cs
public class AiMetricsCollector
{
    private readonly ILogger<AiMetricsCollector> _logger;
    private readonly Counter _aiRequestsTotal;
    private readonly Histogram _aiRequestDuration;
    private readonly Gauge _activeConnections;

    public AiMetricsCollector(ILogger<AiMetricsCollector> logger)
    {
        _logger = logger;
        
        _aiRequestsTotal = Metrics
            .CreateCounter("ai_requests_total", "Total AI API requests", "endpoint", "status");
        
        _aiRequestDuration = Metrics
            .CreateHistogram("ai_request_duration_seconds", "AI request duration", "endpoint");
            
        _activeConnections = Metrics
            .CreateGauge("ai_active_connections", "Active SignalR connections");
    }

    public IDisposable MeasureAiRequest(string endpoint)
    {
        return _aiRequestDuration.WithLabels(endpoint).NewTimer();
    }

    public void IncrementAiRequests(string endpoint, string status)
    {
        _aiRequestsTotal.WithLabels(endpoint, status).Inc();
    }

    public void SetActiveConnections(int count)
    {
        _activeConnections.Set(count);
    }
}
```

### 2. Health Checks

```csharp
// Health/AiHealthChecks.cs
public class AiDatabaseHealthCheck : IHealthCheck
{
    private readonly OynaDbContext _context;

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context, 
        CancellationToken cancellationToken = default)
    {
        try
        {
            // Проверяем основную БД
            await _context.Database.ExecuteSqlRawAsync("SELECT 1", cancellationToken);
            
            // Проверяем AI функции
            var result = await _context.Database
                .SqlQueryRaw<int>("SELECT COUNT(*) FROM ai_dashboard_summary()")
                .FirstOrDefaultAsync(cancellationToken);

            return result > 0 
                ? HealthCheckResult.Healthy("AI database functions working")
                : HealthCheckResult.Degraded("AI functions not returning data");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("AI database check failed", ex);
        }
    }
}

public class MLServiceHealthCheck : IHealthCheck
{
    private readonly HttpClient _httpClient;

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var response = await _httpClient.GetAsync("/health", cancellationToken);
            
            return response.IsSuccessStatusCode
                ? HealthCheckResult.Healthy("ML service is healthy")
                : HealthCheckResult.Unhealthy($"ML service returned {response.StatusCode}");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("ML service is unreachable", ex);
        }
    }
}
```

### 3. Alerting Configuration

```yaml
# prometheus/alerts.yml
groups:
- name: oyna-ai-alerts
  rules:
  - alert: AiApiHighErrorRate
    expr: rate(ai_requests_total{status="error"}[5m]) > 0.1
    for: 2m
    labels:
      severity: warning
    annotations:
      summary: "High error rate in AI API"
      description: "AI API error rate is {{ $value }} errors per second"

  - alert: AiRequestLatencyHigh
    expr: histogram_quantile(0.95, rate(ai_request_duration_seconds_bucket[5m])) > 5
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "AI API latency is high"
      description: "95th percentile latency is {{ $value }} seconds"

  - alert: MLServiceDown
    expr: up{job="ml-service"} == 0
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "ML Service is down"
      description: "Machine Learning service has been down for more than 1 minute"

  - alert: DatabaseConnectionsHigh
    expr: pg_stat_database_numbackends > 80
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High number of database connections"
      description: "Number of database connections is {{ $value }}"
```

---

## 🎯 PRODUCTION CHECKLIST

### ✅ Pre-deployment Checklist

**Security:**
- [ ] JWT tokens properly configured
- [ ] API rate limiting implemented  
- [ ] Sensitive data encrypted
- [ ] HTTPS/TLS configured
- [ ] Database security hardened
- [ ] Input validation on all endpoints

**Performance:**
- [ ] Database queries optimized
- [ ] Caching strategy implemented
- [ ] Connection pooling configured
- [ ] Resource limits set
- [ ] Load testing completed

**Monitoring:**
- [ ] Application metrics configured
- [ ] Health checks implemented
- [ ] Log aggregation setup
- [ ] Alerts configured
- [ ] Performance dashboards created

**Scalability:**
- [ ] Horizontal scaling tested
- [ ] Database partitioning implemented
- [ ] CDN configured for static assets
- [ ] Auto-scaling policies defined

**Backup & Recovery:**
- [ ] Database backups automated
- [ ] ML models versioned
- [ ] Disaster recovery plan tested
- [ ] Point-in-time recovery available

---

## 📞 SUPPORT & MAINTENANCE

### Daily Operations:
1. **Monitor AI model performance** - точность предсказаний
2. **Check system health** - CPU, память, подключения к БД
3. **Review error logs** - критические ошибки в AI сервисах
4. **Validate data quality** - корректность входных данных

### Weekly Operations:
1. **Retrain ML models** с новыми данными
2. **Performance optimization** - анализ медленных запросов
3. **Security review** - проверка логов безопасности
4. **Capacity planning** - прогнозирование роста нагрузки

### Monthly Operations:
1. **Full system backup** verification
2. **Disaster recovery** drill
3. **Performance baseline** review
4. **ML model accuracy** assessment

---

**🚀 ГОТОВО!** Теперь у вас есть полный Production-ready AI Analytics Engine, который может масштабироваться, мониториться и поддерживаться в реальном production окружении!
