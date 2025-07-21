import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  LinearProgress,
  Paper,
  IconButton,
  Tooltip,
  Alert,
  AlertTitle,
  TextField,
  MenuItem,
  Badge,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Psychology as AIIcon,
  Analytics as AnalyticsIcon,
  AutoGraph as GraphIcon,
  Psychology as PredictIcon,
  Lightbulb as InsightIcon,
  Warning as WarningIcon,
  CheckCircle as SuccessIcon,
  Timeline as TimelineIcon,
  Speed as SpeedIcon,
  Star as StarIcon,
  MonetizationOn,
  People,
  Schedule,
  Visibility,
  Download,
  Refresh,
  AutoFixHigh,
} from '@mui/icons-material';
import { aiAnalyticsService, DashboardSummaryResponse, CustomerSegmentationResponse } from '../services/AiAnalyticsService';

const AdvancedAnalyticsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [aiInsightsLoading, setAiInsightsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardSummaryResponse | null>(null);
  const [customerData, setCustomerData] = useState<CustomerSegmentationResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Загрузка реальных AI данных
  useEffect(() => {
    loadAiData();
  }, []);

  const loadAiData = async () => {
    try {
      setLoading(true);
      const [dashboard, customers] = await Promise.all([
        aiAnalyticsService.getDashboardSummary(),
        aiAnalyticsService.getCustomerSegmentation()
      ]);
      setDashboardData(dashboard);
      setCustomerData(customers);
    } catch (error) {
      console.error('Error loading AI data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAIInsights = async () => {
    setAiInsightsLoading(true);
    try {
      await aiAnalyticsService.refreshAiData();
      await loadAiData();
    } catch (error) {
      console.error('Error refreshing AI data:', error);
    } finally {
      setAiInsightsLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>Загрузка AI аналитики...</Typography>
      </Box>
    );
  }

  // Реальные AI insights на основе данных из API
  const aiInsights = dashboardData ? dashboardData.data.map((metric, index) => ({
    id: index + 1,
    type: metric.alert_level === 'КРИТИЧНО' ? 'warning' : 
          metric.alert_level === 'ВНИМАНИЕ' ? 'warning' :
          metric.trend_direction === 'Рост' ? 'prediction' : 'optimization',
    severity: metric.alert_level === 'КРИТИЧНО' ? 'high' : 
             metric.alert_level === 'ВНИМАНИЕ' ? 'medium' : 'low',
    title: `${metric.metric_category}: ${metric.metric_name}`,
    description: `Текущее значение: ${metric.current_value.toLocaleString()}, Прогноз: ${metric.predicted_value.toLocaleString()}. Тренд: ${metric.trend_direction}`,
    confidence: Math.round(metric.confidence_level),
    impact: metric.trend_direction === 'Рост' ? 
      `+₸${Math.abs(metric.predicted_value - metric.current_value).toLocaleString()}` :
      `-₸${Math.abs(metric.predicted_value - metric.current_value).toLocaleString()}`,
    action: metric.recommendations[0] || 'Мониторинг ситуации',
    icon: metric.alert_level === 'КРИТИЧНО' ? <WarningIcon /> : 
          metric.trend_direction === 'Рост' ? <PredictIcon /> : <AutoFixHigh />,
    color: metric.alert_level === 'КРИТИЧНО' ? '#f44336' :
           metric.alert_level === 'ВНИМАНИЕ' ? '#ff9800' :
           metric.trend_direction === 'Рост' ? '#4caf50' : '#2196f3',
  })) : [];

  // Метрики производительности
  const performanceMetrics = [
    { label: 'Средняя загрузка клубов', value: 73, change: +5.2, color: '#1976d2' },
    { label: 'Время сессии (мин)', value: 127, change: +8.7, color: '#2e7d32' },
    { label: 'Конверсия регистрации', value: 34, change: -2.1, color: '#ed6c02' },
    { label: 'NPS Score', value: 67, change: +12.3, color: '#9c27b0' },
    { label: 'Retention Rate (30д)', value: 56, change: +4.8, color: '#d32f2f' },
    { label: 'ARPU (₸)', value: 1847, change: +15.2, color: '#795548' },
  ];

  // Прогнозы на основе ИИ
  const aiPredictions = [
    {
      metric: 'Выручка (следующий месяц)',
      predicted: '₸2,840,000',
      confidence: 91,
      change: '+18.4%',
      trend: 'up',
      factors: ['Новогодние праздники', 'Новый турнир', 'Реферальная программа'],
    },
    {
      metric: 'Новые клиенты',
      predicted: '234 человека',
      confidence: 85,
      change: '+23.1%',
      trend: 'up',
      factors: ['Социальные сети', 'Сарафанное радио', 'Акции'],
    },
    {
      metric: 'Средний чек',
      predicted: '₸1,950',
      confidence: 78,
      change: '+5.7%',
      trend: 'up',
      factors: ['Премиум услуги', 'Upselling', 'Лояльность'],
    },
    {
      metric: 'Пиковая нагрузка',
      predicted: '18:00-22:00',
      confidence: 96,
      change: 'Без изменений',
      trend: 'stable',
      factors: ['Рабочие часы', 'Учебное время', 'Выходные'],
    },
  ];

  // Топ клубы по ИИ рейтингу
  const aiClubRanking = [
    {
      name: 'CyberArena Almaty',
      aiScore: 94,
      revenue: '₸980,000',
      efficiency: 91,
      prediction: '+₸120,000',
      status: 'optimal',
      improvements: ['Продлить часы работы', 'Добавить VR зону'],
    },
    {
      name: 'GameZone Astana',
      aiScore: 87,
      revenue: '₸750,000',
      efficiency: 83,
      prediction: '+₸89,000',
      status: 'good',
      improvements: ['Обновить ПК', 'Улучшить освещение'],
    },
    {
      name: 'ProGaming Shymkent',
      aiScore: 82,
      revenue: '₸580,000',
      efficiency: 79,
      prediction: '+₸67,000',
      status: 'moderate',
      improvements: ['Расширить меню', 'Добавить стриминг'],
    },
    {
      name: 'EsportsHub Almaty',
      aiScore: 71,
      revenue: '₸320,000',
      efficiency: 65,
      prediction: '+₸45,000',
      status: 'needs_attention',
      improvements: ['Ремонт оборудования', 'Маркетинг'],
    },
  ];

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'prediction': return '#2e7d32';
      case 'warning': return '#ed6c02';
      case 'optimization': return '#1976d2';
      case 'insight': return '#9c27b0';
      default: return '#666';
    }
  };

  const getClubStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return '#2e7d32';
      case 'good': return '#1976d2';
      case 'moderate': return '#ed6c02';
      case 'needs_attention': return '#d32f2f';
      default: return '#666';
    }
  };

  const getClubStatusText = (status: string) => {
    switch (status) {
      case 'optimal': return 'Отлично';
      case 'good': return 'Хорошо';
      case 'moderate': return 'Средне';
      case 'needs_attention': return 'Требует внимания';
      default: return status;
    }
  };

  const generateAIInsightsOld = () => {
    setAiInsightsLoading(true);
    setTimeout(() => {
      setAiInsightsLoading(false);
    }, 2000);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Заголовок с ИИ */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            }}
          >
            <AIIcon sx={{ fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              🤖 AI Analytics Dashboard
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#666' }}>
              Искусственный интеллект для анализа и прогнозирования бизнеса
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <TextField
              select
              size="small"
              label="Период"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              sx={{ minWidth: 120, mr: 2 }}
            >
              <MenuItem value="day">День</MenuItem>
              <MenuItem value="week">Неделя</MenuItem>
              <MenuItem value="month">Месяц</MenuItem>
              <MenuItem value="quarter">Квартал</MenuItem>
              <MenuItem value="year">Год</MenuItem>
            </TextField>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={generateAIInsights}
              disabled={aiInsightsLoading}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                mr: 1,
              }}
            >
              {aiInsightsLoading ? 'Анализирую...' : 'Обновить ИИ'}
            </Button>
            <Button variant="outlined" startIcon={<Download />}>
              Экспорт
            </Button>
          </Box>
        </Box>
      </Box>

      {/* AI Insights Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {aiInsights.map((insight) => (
          <Grid item xs={12} md={6} key={insight.id}>
            <Card sx={{ 
              borderRadius: 3,
              background: `linear-gradient(135deg, ${insight.color}15 0%, ${insight.color}25 100%)`,
              border: `2px solid ${insight.color}30`,
              position: 'relative',
              overflow: 'visible',
            }}>
              <CardContent sx={{ pb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      backgroundColor: insight.color,
                      color: 'white',
                      mt: 1,
                    }}
                  >
                    {insight.icon}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {insight.title}
                      </Typography>
                      <Chip 
                        label={`${insight.confidence}% точность`} 
                        size="small" 
                        sx={{ 
                          backgroundColor: insight.color,
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
                      {insight.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: insight.color }}>
                        {insight.impact}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={insight.confidence}
                        sx={{
                          width: 100,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: `${insight.color}20`,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: insight.color,
                          }
                        }}
                      />
                    </Box>
                    <Alert 
                      severity="info" 
                      icon={<AutoFixHigh />}
                      sx={{ 
                        backgroundColor: `${insight.color}10`,
                        border: `1px solid ${insight.color}30`,
                        '& .MuiAlert-icon': { color: insight.color },
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                        🎯 Рекомендация ИИ: {insight.action}
                      </Typography>
                    </Alert>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Метрики производительности */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <SpeedIcon sx={{ color: '#1976d2', fontSize: 32 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  📈 Ключевые метрики производительности
                </Typography>
                <Chip label="Обновлено в реальном времени" color="success" size="small" />
              </Box>

              <Grid container spacing={3}>
                {performanceMetrics.map((metric, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper sx={{ 
                      p: 2, 
                      textAlign: 'center', 
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${metric.color}10 0%, ${metric.color}20 100%)`,
                      border: `1px solid ${metric.color}30`,
                    }}>
                      <Typography variant="caption" sx={{ color: '#666', fontWeight: 'bold' }}>
                        {metric.label}
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: metric.color, my: 1 }}>
                        {metric.value}{metric.label.includes('₸') ? '' : metric.label.includes('%') ? '%' : ''}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        {metric.change > 0 ? (
                          <TrendingUp sx={{ color: '#2e7d32', fontSize: 16 }} />
                        ) : (
                          <TrendingDown sx={{ color: '#d32f2f', fontSize: 16 }} />
                        )}
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: metric.change > 0 ? '#2e7d32' : '#d32f2f',
                            fontWeight: 'bold'
                          }}
                        >
                          {metric.change > 0 ? '+' : ''}{metric.change}%
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* AI Прогнозы */}
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <PredictIcon sx={{ color: '#9c27b0', fontSize: 32 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  🔮 AI Прогнозы и предсказания
                </Typography>
                <Chip label="Машинное обучение" color="secondary" size="small" />
              </Box>

              <Grid container spacing={2}>
                {aiPredictions.map((prediction, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Paper sx={{ 
                      p: 3, 
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      color: 'white',
                    }}>
                      <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 1 }}>
                        {prediction.metric}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {prediction.predicted}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Chip 
                          label={prediction.change}
                          size="small"
                          sx={{ 
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                        />
                        <Typography variant="caption">
                          {prediction.confidence}% уверенность
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Факторы: {prediction.factors.join(', ')}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Рейтинг клубов */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <StarIcon sx={{ color: '#ff9800', fontSize: 32 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  🏆 AI Рейтинг клубов
                </Typography>
              </Box>

              <List sx={{ p: 0 }}>
                {aiClubRanking.map((club, index) => (
                  <React.Fragment key={club.name}>
                    <ListItem sx={{ px: 0, py: 2 }}>
                      <ListItemAvatar>
                        <Badge
                          badgeContent={index + 1}
                          color="primary"
                          anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                          }}
                        >
                          <Avatar sx={{ 
                            backgroundColor: getClubStatusColor(club.status),
                            width: 48,
                            height: 48,
                          }}>
                            {club.aiScore}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {club.name}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                              <Chip 
                                label={`AI: ${club.aiScore}/100`} 
                                size="small" 
                                color="primary"
                              />
                              <Chip 
                                label={getClubStatusText(club.status)}
                                size="small"
                                sx={{
                                  backgroundColor: getClubStatusColor(club.status),
                                  color: 'white',
                                }}
                              />
                            </Box>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" sx={{ display: 'block' }}>
                              💰 Выручка: {club.revenue}
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'block' }}>
                              📊 Эффективность: {club.efficiency}%
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'block', color: '#2e7d32', fontWeight: 'bold' }}>
                              📈 Прогноз: {club.prediction}
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                              💡 Улучшения: {club.improvements.join(', ')}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < aiClubRanking.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdvancedAnalyticsPage;
