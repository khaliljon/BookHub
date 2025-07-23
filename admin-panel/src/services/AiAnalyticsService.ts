// 🧠 AI Analytics Service for Real-time Data
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7183/api';

// Axios instance with auth
const aiApi = axios.create({
  baseURL: `${API_BASE_URL}/AiAnalytics`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
aiApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    if (!config.headers) config.headers = {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
aiApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('AI API Error:', error);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 🧠 Customer Intelligence Types
export interface CustomerSegment {
  user_id: number;
  full_name: string;
  segment: string;
  ai_score: number;
  clv_predicted: number;
  churn_risk: number;
  upsell_score: number;
  total_spent: number;
  visit_frequency: number;
  avg_session_duration: number;
  favorite_game: string;
  recommendations: string[];
}

export interface CustomerSegmentationResponse {
  success: boolean;
  data: CustomerSegment[];
  insights: {
    totalCustomers: number;
    vipCustomers: number;
    averageClv: number;
    highChurnRisk: number;
    topRecommendations: Array<{
      full_name: string;
      upsell_score: number;
      recommendations: string[];
    }>;
  };
}

// 💰 Revenue Forecasting Types
export interface RevenueForecast {
  forecast_date: string;
  predicted_revenue: number;
  confidence_level: number;
  lower_bound: number;
  upper_bound: number;
  factors: string[];
  recommendations: string[];
}

export interface RevenueForecastResponse {
  success: boolean;
  data: RevenueForecast[];
  summary: {
    totalPredictedRevenue: number;
    averageConfidence: number;
    forecastPeriod: number;
    clubId?: number;
    dailyAverage: number;
    riskFactors: Array<{
      forecast_date: string;
      confidence_level: number;
      factors: string[];
    }>;
  };
  aiInsights: {
    bestDays: RevenueForecast[];
    worstDays: RevenueForecast[];
    recommendedActions: Array<{
      action: string;
      frequency: number;
    }>;
  };
}

// 📢 Marketing Intelligence Types
export interface MarketingInsight {
  channel_name: string;
  roi_score: number;
  conversion_rate: number;
  customer_acquisition_cost: number;
  lifetime_value: number;
  optimization_score: number;
  recommendations: string[];
  budget_allocation: number;
}

export interface MarketingInsightResponse {
  success: boolean;
  data: MarketingInsight[];
  summary: {
    totalChannels: number;
    bestChannel: string;
    averageRoi: number;
    totalBudgetNeeded: number;
    highPerformingChannels: number;
  };
  recommendations: {
    budgetReallocation: Array<{
      channel: string;
      recommendedBudget: number;
      currentRoi: number;
    }>;
    urgentActions: string[];
  };
}

// 🏢 Club Optimization Types
export interface ClubOptimization {
  club_id: number;
  club_name: string;
  efficiency_score: number;
  utilization_rate: number;
  revenue_per_seat: number;
  peak_hours: string;
  bottlenecks: string[];
  opportunities: string[];
  ai_recommendations: string[];
}

export interface ClubOptimizationResponse {
  success: boolean;
  data: ClubOptimization[];
  insights: {
    topPerformingClub: ClubOptimization;
    averageUtilization: number;
    clubsNeedingAttention: number;
    totalRevenue: number;
    commonBottlenecks: Array<{
      issue: string;
      count: number;
    }>;
  };
  actionPlan: Array<{
    clubName: string;
    priority: string;
    recommendations: string[];
    expectedImpact: string;
  }>;
}

// 🔧 Equipment Health Types
export interface EquipmentHealth {
  seat_id: number;
  club_name: string;
  hall_name: string;
  seat_number: number;
  health_score: number;
  usage_intensity: number;
  failure_risk: number;
  maintenance_priority: string;
  predicted_failure_date: string;
  recommendations: string[];
}

export interface EquipmentHealthResponse {
  success: boolean;
  data: EquipmentHealth[];
  alerts: {
    criticalEquipment: number;
    highRiskEquipment: number;
    maintenanceNeeded: number;
    averageHealthScore: number;
  };
  maintenanceSchedule: Array<{
    date: string;
    equipmentCount: number;
    priority: string;
    clubs: string[];
  }>;
  recommendations: Array<{
    action: string;
    urgency: number;
  }>;
}

// 📊 Dashboard Summary Types
export interface DashboardMetric {
  metric_category: string;
  metric_name: string;
  current_value: number;
  predicted_value: number;
  trend_direction: string;
  confidence_level: number;
  alert_level: string;
  recommendations: string[];
}

export interface DashboardSummaryResponse {
  success: boolean;
  data: DashboardMetric[];
  overview: {
    totalMetrics: number;
    criticalAlerts: number;
    warnings: number;
    goodMetrics: number;
    excellentMetrics: number;
    averageConfidence: number;
  };
  keyInsights: {
    growingMetrics: number;
    decliningMetrics: number;
    stableMetrics: number;
    topRecommendations: Array<{
      recommendation: string;
      importance: number;
    }>;
  };
}

// 🚀 AI Analytics Service Class
class AiAnalyticsService {
  // 🧠 Customer Intelligence
  async getCustomerSegmentation(): Promise<CustomerSegmentationResponse> {
    const response = await aiApi.get<CustomerSegmentationResponse>('/customer-segmentation');
    return response.data;
  }

  async getHighChurnRiskCustomers(): Promise<CustomerSegment[]> {
    const data = await this.getCustomerSegmentation();
    return data.data.filter(customer => customer.churn_risk > 70);
  }

  async getVipCustomers(): Promise<CustomerSegment[]> {
    const data = await this.getCustomerSegmentation();
    return data.data.filter(customer => customer.segment === 'VIP Геймер');
  }

  async getUpsellOpportunities(): Promise<CustomerSegment[]> {
    const data = await this.getCustomerSegmentation();
    return data.data.filter(customer => customer.upsell_score > 80);
  }

  // 💰 Revenue Intelligence
  async getRevenueForecast(clubId?: number, days: number = 30): Promise<RevenueForecastResponse> {
    const params = new URLSearchParams();
    if (clubId) params.append('clubId', clubId.toString());
    params.append('days', days.toString());
    
    const response = await aiApi.get<RevenueForecastResponse>(`/revenue-forecast?${params}`);
    return response.data;
  }

  async getWeeklyForecast(clubId?: number): Promise<RevenueForecastResponse> {
    return this.getRevenueForecast(clubId, 7);
  }

  async getMonthlyForecast(clubId?: number): Promise<RevenueForecastResponse> {
    return this.getRevenueForecast(clubId, 30);
  }

  // 📢 Marketing Intelligence
  async getMarketingInsights(): Promise<MarketingInsightResponse> {
    const response = await aiApi.get<MarketingInsightResponse>('/marketing-insights');
    return response.data;
  }

  async getBestPerformingChannels(): Promise<MarketingInsight[]> {
    const data = await this.getMarketingInsights();
    return data.data.filter(channel => channel.roi_score > 300);
  }

  async getUnderperformingChannels(): Promise<MarketingInsight[]> {
    const data = await this.getMarketingInsights();
    return data.data.filter(channel => channel.roi_score < 250);
  }

  // 🏢 Operational Intelligence
  async getClubOptimization(): Promise<ClubOptimizationResponse> {
    const response = await aiApi.get<ClubOptimizationResponse>('/club-optimization');
    return response.data;
  }

  async getUnderperformingClubs(): Promise<ClubOptimization[]> {
    const data = await this.getClubOptimization();
    return data.data.filter(club => club.efficiency_score < 70);
  }

  async getTopPerformingClubs(): Promise<ClubOptimization[]> {
    const data = await this.getClubOptimization();
    return data.data.filter(club => club.efficiency_score > 85);
  }

  // 🔧 Equipment Intelligence
  async getEquipmentHealth(): Promise<EquipmentHealthResponse> {
    const response = await aiApi.get<EquipmentHealthResponse>('/equipment-health');
    return response.data;
  }

  async getCriticalEquipment(): Promise<EquipmentHealth[]> {
    const data = await this.getEquipmentHealth();
    return data.data.filter(equipment => equipment.maintenance_priority === 'КРИТИЧЕСКИЙ');
  }

  async getHighRiskEquipment(): Promise<EquipmentHealth[]> {
    const data = await this.getEquipmentHealth();
    return data.data.filter(equipment => equipment.failure_risk > 70);
  }

  // 📊 Executive Dashboard
  async getDashboardSummary(): Promise<DashboardSummaryResponse> {
    const response = await aiApi.get<DashboardSummaryResponse>('/dashboard-summary');
    return response.data;
  }

  async getCriticalAlerts(): Promise<DashboardMetric[]> {
    const data = await this.getDashboardSummary();
    return data.data.filter(metric => metric.alert_level === 'КРИТИЧНО');
  }

  async getGrowingMetrics(): Promise<DashboardMetric[]> {
    const data = await this.getDashboardSummary();
    return data.data.filter(metric => metric.trend_direction === 'Рост');
  }

  // 🔄 Data Management
  async refreshAiData(): Promise<{ success: boolean; message: string; timestamp: string }> {
    const response = await aiApi.post<{ success: boolean; message: string; timestamp: string }>(
      '/refresh-ai-data'
    );
    return response.data;
  }

  // 📈 Real-time Monitoring
  async startRealTimeMonitoring(callback: (data: any) => void, interval: number = 30000): Promise<NodeJS.Timeout> {
    const fetchData = async () => {
      try {
        const [dashboard, customers, revenue] = await Promise.all([
          this.getDashboardSummary(),
          this.getCustomerSegmentation(),
          this.getRevenueForecast()
        ]);

        callback({
          dashboard,
          customers,
          revenue,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Real-time monitoring error:', error);
      }
    };

    // Initial fetch
    await fetchData();

    // Set up interval
    return setInterval(fetchData, interval);
  }

  stopRealTimeMonitoring(intervalId: NodeJS.Timeout): void {
    clearInterval(intervalId);
  }

  // 🎯 AI Insights Aggregator
  async getAiInsightsSummary(): Promise<{
    customerInsights: CustomerSegmentationResponse;
    revenueInsights: RevenueForecastResponse;
    marketingInsights: MarketingInsightResponse;
    operationalInsights: ClubOptimizationResponse;
    equipmentInsights: EquipmentHealthResponse;
    dashboardSummary: DashboardSummaryResponse;
  }> {
    const [
      customerInsights,
      revenueInsights,
      marketingInsights,
      operationalInsights,
      equipmentInsights,
      dashboardSummary
    ] = await Promise.all([
      this.getCustomerSegmentation(),
      this.getRevenueForecast(),
      this.getMarketingInsights(),
      this.getClubOptimization(),
      this.getEquipmentHealth(),
      this.getDashboardSummary()
    ]);

    return {
      customerInsights,
      revenueInsights,
      marketingInsights,
      operationalInsights,
      equipmentInsights,
      dashboardSummary
    };
  }

  // 📊 Data Export
  async exportAiReport(format: 'json' | 'csv' = 'json'): Promise<Blob> {
    const data = await this.getAiInsightsSummary();
    
    if (format === 'json') {
      return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    } else {
      // Convert to CSV format
      const csvData = this.convertToCSV(data);
      return new Blob([csvData], { type: 'text/csv' });
    }
  }

  private convertToCSV(data: any): string {
    // Simple CSV conversion - can be enhanced
    const headers = Object.keys(data);
    const csvHeaders = headers.join(',');
    const csvRows = headers.map(header => JSON.stringify(data[header])).join(',');
    return `${csvHeaders}\n${csvRows}`;
  }
}

// 🚀 Export singleton instance
export const aiAnalyticsService = new AiAnalyticsService();

// 🎯 Utility hooks for React components
export const useAiAnalytics = () => {
  return {
    service: aiAnalyticsService,
    
    // Helper methods for common operations
    async getQuickInsights() {
      const [critical, opportunities, forecasts] = await Promise.all([
        aiAnalyticsService.getCriticalAlerts(),
        aiAnalyticsService.getUpsellOpportunities(),
        aiAnalyticsService.getWeeklyForecast()
      ]);

      return { critical, opportunities, forecasts };
    },

    async getExecutiveSummary() {
      const data = await aiAnalyticsService.getAiInsightsSummary();
      
      return {
        totalRevenueForecast: data.revenueInsights.summary.totalPredictedRevenue,
        criticalAlerts: data.dashboardSummary.overview.criticalAlerts,
        vipCustomers: data.customerInsights.insights.vipCustomers,
        bestMarketingChannel: data.marketingInsights.summary.bestChannel,
        topClub: data.operationalInsights.insights.topPerformingClub?.club_name,
        equipmentIssues: data.equipmentInsights.alerts.criticalEquipment
      };
    }
  };
};

export default AiAnalyticsService;
