using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BookHub.Data;
using Microsoft.EntityFrameworkCore;
using System.Data;
using Npgsql;

namespace BookHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "SuperAdmin,Admin,Manager")]
    public class AiAnalyticsController : ControllerBase
    {
        private readonly BookHubDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AiAnalyticsController> _logger;

        public AiAnalyticsController(
            BookHubDbContext context,
            IConfiguration configuration,
            ILogger<AiAnalyticsController> logger)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
        }

        // 🧠 AI Customer Segmentation
        [HttpGet("customer-segmentation")]
        public async Task<IActionResult> GetCustomerSegmentation()
        {
            try
            {
                var results = await _context.Database
                    .SqlQueryRaw<CustomerSegmentationResult>(
                        "SELECT * FROM ai_customer_segmentation()")
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = results,
                    insights = new
                    {
                        totalCustomers = results.Count,
                        vipCustomers = results.Count(r => r.segment == "VIP Геймер"),
                        averageClv = results.Average(r => r.clv_predicted),
                        highChurnRisk = results.Count(r => r.churn_risk > 70),
                        topRecommendations = results
                            .Where(r => r.upsell_score > 80)
                            .Take(5)
                            .Select(r => new { r.full_name, r.upsell_score, r.recommendations })
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetCustomerSegmentation");
                return StatusCode(500, new { success = false, message = "AI analysis failed" });
            }
        }

        // 💰 AI Revenue Forecasting
        [HttpGet("revenue-forecast")]
        public async Task<IActionResult> GetRevenueForecast(
            [FromQuery] int? clubId = null,
            [FromQuery] int days = 30)
        {
            try
            {
                var results = await _context.Database
                    .SqlQueryRaw<RevenueForecastResult>(
                        "SELECT * FROM ai_revenue_forecast({0}, {1})", 
                        clubId ?? (object)DBNull.Value, days)
                    .ToListAsync();

                var totalPredicted = results.Sum(r => r.predicted_revenue);
                var avgConfidence = results.Average(r => r.confidence_level);

                return Ok(new
                {
                    success = true,
                    data = results,
                    summary = new
                    {
                        totalPredictedRevenue = totalPredicted,
                        averageConfidence = Math.Round(avgConfidence, 2),
                        forecastPeriod = days,
                        clubId = clubId,
                        dailyAverage = Math.Round(totalPredicted / days, 2),
                        riskFactors = results
                            .Where(r => r.confidence_level < 80)
                            .Select(r => new { r.forecast_date, r.confidence_level, r.factors })
                    },
                    aiInsights = new
                    {
                        bestDays = results.OrderByDescending(r => r.predicted_revenue).Take(3),
                        worstDays = results.OrderBy(r => r.predicted_revenue).Take(3),
                        recommendedActions = results
                            .SelectMany(r => r.recommendations)
                            .GroupBy(r => r)
                            .OrderByDescending(g => g.Count())
                            .Take(5)
                            .Select(g => new { action = g.Key, frequency = g.Count() })
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetRevenueForecast");
                return StatusCode(500, new { success = false, message = "Revenue forecast failed" });
            }
        }

        // 📢 AI Marketing Insights
        [HttpGet("marketing-insights")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> GetMarketingInsights()
        {
            try
            {
                var results = await _context.Database
                    .SqlQueryRaw<MarketingInsightResult>(
                        "SELECT * FROM ai_marketing_insights()")
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = results,
                    summary = new
                    {
                        totalChannels = results.Count,
                        bestChannel = results.OrderByDescending(r => r.roi_score).FirstOrDefault()?.channel_name,
                        averageRoi = Math.Round(results.Average(r => r.roi_score), 2),
                        totalBudgetNeeded = results.Sum(r => r.budget_allocation),
                        highPerformingChannels = results.Count(r => r.roi_score > 300)
                    },
                    recommendations = new
                    {
                        budgetReallocation = results
                            .OrderByDescending(r => r.optimization_score)
                            .Select(r => new { 
                                channel = r.channel_name, 
                                recommendedBudget = r.budget_allocation,
                                currentRoi = r.roi_score 
                            }),
                        urgentActions = results
                            .Where(r => r.roi_score < 250)
                            .SelectMany(r => r.recommendations)
                            .Distinct()
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetMarketingInsights");
                return StatusCode(500, new { success = false, message = "Marketing analysis failed" });
            }
        }

        // 🏢 AI Club Optimization
        [HttpGet("club-optimization")]
        public async Task<IActionResult> GetClubOptimization()
        {
            try
            {
                var results = await _context.Database
                    .SqlQueryRaw<ClubOptimizationResult>(
                        "SELECT * FROM ai_club_optimization()")
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = results,
                    insights = new
                    {
                        topPerformingClub = results.OrderByDescending(r => r.efficiency_score).FirstOrDefault(),
                        averageUtilization = Math.Round(results.Average(r => r.utilization_rate), 2),
                        clubsNeedingAttention = results.Count(r => r.efficiency_score < 70),
                        totalRevenue = results.Sum(r => r.revenue_per_seat),
                        commonBottlenecks = results
                            .SelectMany(r => r.bottlenecks)
                            .GroupBy(b => b)
                            .OrderByDescending(g => g.Count())
                            .Take(3)
                            .Select(g => new { issue = g.Key, count = g.Count() })
                    },
                    actionPlan = results
                        .Where(r => r.efficiency_score < 80)
                        .Select(r => new {
                            clubName = r.club_name,
                            priority = r.efficiency_score < 50 ? "HIGH" : "MEDIUM",
                            recommendations = r.ai_recommendations,
                            expectedImpact = r.efficiency_score < 50 ? "Значительное улучшение" : "Умеренное улучшение"
                        })
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetClubOptimization");
                return StatusCode(500, new { success = false, message = "Club optimization failed" });
            }
        }

        // 🔧 AI Equipment Health
        [HttpGet("equipment-health")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> GetEquipmentHealth()
        {
            try
            {
                var results = await _context.Database
                    .SqlQueryRaw<EquipmentHealthResult>(
                        "SELECT * FROM ai_equipment_health()")
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = results,
                    alerts = new
                    {
                        criticalEquipment = results.Count(r => r.maintenance_priority == "КРИТИЧЕСКИЙ"),
                        highRiskEquipment = results.Count(r => r.failure_risk > 70),
                        maintenanceNeeded = results.Count(r => r.maintenance_priority != "НИЗКИЙ"),
                        averageHealthScore = Math.Round(results.Average(r => r.health_score), 2)
                    },
                    maintenanceSchedule = results
                        .Where(r => r.maintenance_priority != "НИЗКИЙ")
                        .OrderBy(r => r.predicted_failure_date)
                        .GroupBy(r => r.predicted_failure_date.ToString("yyyy-MM-dd"))
                        .Select(g => new {
                            date = g.Key,
                            equipmentCount = g.Count(),
                            priority = g.Max(x => x.maintenance_priority),
                            clubs = g.Select(x => x.club_name).Distinct()
                        }),
                    recommendations = results
                        .Where(r => r.maintenance_priority == "КРИТИЧЕСКИЙ")
                        .SelectMany(r => r.recommendations)
                        .GroupBy(r => r)
                        .OrderByDescending(g => g.Count())
                        .Take(5)
                        .Select(g => new { action = g.Key, urgency = g.Count() })
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetEquipmentHealth");
                return StatusCode(500, new { success = false, message = "Equipment analysis failed" });
            }
        }

        // 📊 AI Dashboard Summary
        [HttpGet("dashboard-summary")]
        public async Task<IActionResult> GetDashboardSummary()
        {
            try
            {
                var results = await _context.Database
                    .SqlQueryRaw<DashboardSummaryResult>(
                        "SELECT * FROM ai_dashboard_summary()")
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = results,
                    overview = new
                    {
                        totalMetrics = results.Count,
                        criticalAlerts = results.Count(r => r.alert_level == "КРИТИЧНО"),
                        warnings = results.Count(r => r.alert_level == "ВНИМАНИЕ"),
                        goodMetrics = results.Count(r => r.alert_level == "ХОРОШО"),
                        excellentMetrics = results.Count(r => r.alert_level == "ОТЛИЧНО"),
                        averageConfidence = Math.Round(results.Average(r => r.confidence_level), 2)
                    },
                    keyInsights = new
                    {
                        growingMetrics = results.Count(r => r.trend_direction == "Рост"),
                        decliningMetrics = results.Count(r => r.trend_direction == "Снижение"),
                        stableMetrics = results.Count(r => r.trend_direction == "Стабильно"),
                        topRecommendations = results
                            .SelectMany(r => r.recommendations)
                            .GroupBy(r => r)
                            .OrderByDescending(g => g.Count())
                            .Take(5)
                            .Select(g => new { recommendation = g.Key, importance = g.Count() })
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetDashboardSummary");
                return StatusCode(500, new { success = false, message = "Dashboard summary failed" });
            }
        }

        // 🔄 Real-time AI Data Update
        [HttpPost("refresh-ai-data")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> RefreshAiData()
        {
            try
            {
                // Обновляем статистику PostgreSQL для лучшей производительности AI функций
                await _context.Database.ExecuteSqlRawAsync("ANALYZE;");
                
                // Очищаем кеш и пересчитываем индексы
                await _context.Database.ExecuteSqlRawAsync("REINDEX DATABASE CONCURRENTLY;");

                return Ok(new
                {
                    success = true,
                    message = "AI data refreshed successfully",
                    timestamp = DateTime.UtcNow,
                    nextUpdate = DateTime.UtcNow.AddHours(1)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in RefreshAiData");
                return StatusCode(500, new { success = false, message = "AI data refresh failed" });
            }
        }
    }

    // 📋 Data Transfer Objects for AI Results
    public class CustomerSegmentationResult
    {
        public int user_id { get; set; }
        public string full_name { get; set; } = string.Empty;
        public string segment { get; set; } = string.Empty;
        public decimal ai_score { get; set; }
        public decimal clv_predicted { get; set; }
        public decimal churn_risk { get; set; }
        public decimal upsell_score { get; set; }
        public decimal total_spent { get; set; }
        public decimal visit_frequency { get; set; }
        public decimal avg_session_duration { get; set; }
        public string favorite_game { get; set; } = string.Empty;
        public string[] recommendations { get; set; } = Array.Empty<string>();
    }

    public class RevenueForecastResult
    {
        public DateTime forecast_date { get; set; }
        public decimal predicted_revenue { get; set; }
        public decimal confidence_level { get; set; }
        public decimal lower_bound { get; set; }
        public decimal upper_bound { get; set; }
        public string[] factors { get; set; } = Array.Empty<string>();
        public string[] recommendations { get; set; } = Array.Empty<string>();
    }

    public class MarketingInsightResult
    {
        public string channel_name { get; set; } = string.Empty;
        public decimal roi_score { get; set; }
        public decimal conversion_rate { get; set; }
        public decimal customer_acquisition_cost { get; set; }
        public decimal lifetime_value { get; set; }
        public decimal optimization_score { get; set; }
        public string[] recommendations { get; set; } = Array.Empty<string>();
        public decimal budget_allocation { get; set; }
    }

    public class ClubOptimizationResult
    {
        public int club_id { get; set; }
        public string club_name { get; set; } = string.Empty;
        public decimal efficiency_score { get; set; }
        public decimal utilization_rate { get; set; }
        public decimal revenue_per_seat { get; set; }
        public string peak_hours { get; set; } = string.Empty;
        public string[] bottlenecks { get; set; } = Array.Empty<string>();
        public string[] opportunities { get; set; } = Array.Empty<string>();
        public string[] ai_recommendations { get; set; } = Array.Empty<string>();
    }

    public class EquipmentHealthResult
    {
        public int seat_id { get; set; }
        public string club_name { get; set; } = string.Empty;
        public string hall_name { get; set; } = string.Empty;
        public int seat_number { get; set; }
        public decimal health_score { get; set; }
        public decimal usage_intensity { get; set; }
        public decimal failure_risk { get; set; }
        public string maintenance_priority { get; set; } = string.Empty;
        public DateTime predicted_failure_date { get; set; }
        public string[] recommendations { get; set; } = Array.Empty<string>();
    }

    public class DashboardSummaryResult
    {
        public string metric_category { get; set; } = string.Empty;
        public string metric_name { get; set; } = string.Empty;
        public decimal current_value { get; set; }
        public decimal predicted_value { get; set; }
        public string trend_direction { get; set; } = string.Empty;
        public decimal confidence_level { get; set; }
        public string alert_level { get; set; } = string.Empty;
        public string[] recommendations { get; set; } = Array.Empty<string>();
    }
}
