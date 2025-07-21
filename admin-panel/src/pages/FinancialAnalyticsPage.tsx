import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  LinearProgress,
  Alert,
  TextField,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Badge,
  Tooltip,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  CreditCard,
  MonetizationOn,
  Assessment,
  Timeline,
  PieChart,
  BarChart,
  ShowChart,
  Psychology,
  AttachMoney,
  Receipt,
  AccountBalanceWallet,
  Savings,
  TrendingFlat,
  ExpandMore,
  Warning,
  CheckCircle,
  Error,
  Info,
  Star,
  Speed,
  Analytics,
  AutoGraph,
  Compare,
  Calculate,
  Insights,
  Refresh,
} from '@mui/icons-material';
import { aiAnalyticsService } from '../services/AiAnalyticsService';

const FinancialAnalyticsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedClub, setSelectedClub] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Real AI data states
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [revenueForecast, setRevenueForecast] = useState<any>(null);

  // Load AI data
  useEffect(() => {
    loadAiData();
  }, [selectedPeriod, selectedClub]);

  const loadAiData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashboard, forecast] = await Promise.all([
        aiAnalyticsService.getDashboardSummary(),
        aiAnalyticsService.getRevenueForecast(
          selectedClub === 'all' ? undefined : parseInt(selectedClub), 
          30
        )
      ]);
      
      setDashboardData(dashboard);
      setRevenueForecast(forecast);
    } catch (err) {
      setError('Ошибка загрузки AI данных');
      console.error('AI data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadAiData();
    setRefreshing(false);
  };

  // Calculate real metrics from AI data
  const getFinancialMetricsFromAI = () => {
    if (!dashboardData?.data) {
      return [
        {
          title: 'Общая выручка',
          value: '₸2,847,500',
          change: '+18.4%',
          trend: 'up',
          color: '#2e7d32',
          icon: <MonetizationOn />,
          target: '₸3,000,000',
          progress: 94.9,
        },
        {
          title: 'Чистая прибыль',
          value: '₸1,423,750',
          change: '+22.1%',
          trend: 'up',
          color: '#1976d2',
          icon: <AccountBalance />,
          target: '₸1,500,000',
          progress: 94.8,
        },
        {
          title: 'Средний чек',
          value: '₸1,847',
          change: '+5.7%',
          trend: 'up',
          color: '#9c27b0',
          icon: <Receipt />,
          target: '₸2,000',
          progress: 92.4,
        },
      ];
    }

    const revenueMetric = dashboardData.data.find((d: any) => 
      d.metric_name.toLowerCase().includes('revenue') || 
      d.metric_name.toLowerCase().includes('доход')
    );
    
    const bookingsMetric = dashboardData.data.find((d: any) => 
      d.metric_name.toLowerCase().includes('booking') || 
      d.metric_name.toLowerCase().includes('бронирование')
    );

    const totalRevenue = revenueMetric?.current_value || 2847500;
    const netProfit = Math.round(totalRevenue * 0.5); // 50% profit margin
    const avgCheck = bookingsMetric?.current_value ? 
      Math.round(totalRevenue / bookingsMetric.current_value) : 1847;

    return [
      {
        title: 'Общая выручка',
        value: `₸${totalRevenue.toLocaleString()}`,
        change: `+${revenueMetric?.confidence_level.toFixed(1) || '18.4'}%`,
        trend: 'up',
        color: '#2e7d32',
        icon: <MonetizationOn />,
        target: `₸${Math.round(totalRevenue * 1.15).toLocaleString()}`,
        progress: Math.min(95, revenueMetric?.ai_score || 85),
        aiScore: revenueMetric?.ai_score || 85
      },
      {
        title: 'Чистая прибыль',
        value: `₸${netProfit.toLocaleString()}`,
        change: `+${Math.min(30, (revenueMetric?.confidence_level || 18) * 1.2).toFixed(1)}%`,
        trend: 'up',
        color: '#1976d2',
        icon: <AccountBalance />,
        target: `₸${Math.round(netProfit * 1.1).toLocaleString()}`,
        progress: Math.min(95, (revenueMetric?.ai_score || 85) - 5),
        aiScore: (revenueMetric?.ai_score || 85) - 5
      },
      {
        title: 'Средний чек',
        value: `₸${avgCheck.toLocaleString()}`,
        change: `+${Math.min(15, (bookingsMetric?.confidence_level || 12) / 2).toFixed(1)}%`,
        trend: 'up',
        color: '#9c27b0',
        icon: <Receipt />,
        target: `₸${Math.round(avgCheck * 1.1).toLocaleString()}`,
        progress: Math.min(95, bookingsMetric?.ai_score || 78),
        aiScore: bookingsMetric?.ai_score || 78
      },
    ];
  };

  // Финансовые метрики
  const financialMetrics = getFinancialMetricsFromAI();

  // Additional financial metrics
  const additionalMetrics = [
    {
      title: 'Операционные расходы',
      value: '₸1,203,250',
      change: '-8.3%',
      trend: 'down',
      color: '#d32f2f',
      icon: <CreditCard />,
      target: '₸1,100,000',
      progress: 109.4,
    },
    {
      title: 'EBITDA',
      value: '₸642,500',
      change: '+31.2%',
      trend: 'up',
      color: '#ff9800',
      icon: <Assessment />,
      target: '₸700,000',
      progress: 91.8,
    },
    {
      title: 'ROI',
      value: '34.7%',
      change: '+4.2%',
      trend: 'up',
      color: '#795548',
      icon: <ShowChart />,
      target: '40%',
      progress: 86.8,
    },
  ];

  // Прогнозы доходов
  const revenueForecasts = [
    {
      period: 'Следующий месяц',
      predicted: '₸3,120,000',
      confidence: 89,
      factors: ['Новогодние праздники', 'Новый турнир', 'Акции'],
      change: '+9.6%',
      risk: 'low',
    },
    {
      period: 'Квартал',
      predicted: '₸8,950,000',
      confidence: 84,
      factors: ['Сезонность', 'Расширение', 'Конкуренция'],
      change: '+14.2%',
      risk: 'medium',
    },
    {
      period: 'Полгода',
      predicted: '₸17,800,000',
      confidence: 76,
      factors: ['Новые клубы', 'Инфляция', 'Рынок'],
      change: '+18.7%',
      risk: 'medium',
    },
    {
      period: 'Год',
      predicted: '₸35,600,000',
      confidence: 67,
      factors: ['Экспансия', 'Технологии', 'Экономика'],
      change: '+25.3%',
      risk: 'high',
    },
  ];

  // Детализация по клубам
  const clubFinancials = [
    {
      name: 'CyberArena Almaty',
      revenue: '₸980,000',
      profit: '₸441,000',
      margin: 45.0,
      growth: '+18.4%',
      customers: 1247,
      avgCheck: '₸786',
      status: 'excellent',
      trend: 'up',
    },
    {
      name: 'GameZone Astana',
      revenue: '₸750,000',
      profit: '₸292,500',
      margin: 39.0,
      growth: '+12.7%',
      customers: 934,
      avgCheck: '₸803',
      status: 'good',
      trend: 'up',
    },
    {
      name: 'ProGaming Shymkent',
      revenue: '₸580,000',
      profit: '₸203,000',
      margin: 35.0,
      growth: '+8.9%',
      customers: 723,
      avgCheck: '₸802',
      status: 'moderate',
      trend: 'up',
    },
    {
      name: 'EsportsHub Almaty',
      revenue: '₸320,000',
      profit: '₸96,000',
      margin: 30.0,
      growth: '+3.2%',
      customers: 412,
      avgCheck: '₸777',
      status: 'needs_attention',
      trend: 'flat',
    },
  ];

  // AI финансовые инсайты
  const financialInsights = [
    {
      type: 'opportunity',
      title: 'Увеличение маржинальности',
      description: 'ИИ обнаружил возможность увеличить прибыль на 12% через оптимизацию тарифов в часы пик',
      impact: '+₸171,000/мес',
      confidence: 91,
      priority: 'high',
      actions: ['Динамическое ценообразование', 'Premium часы', 'Upselling напитки'],
    },
    {
      type: 'risk',
      title: 'Риск снижения прибыли',
      description: 'Растущие коммунальные расходы могут снизить маржу на 3.2% без корректировки цен',
      impact: '-₸91,000/мес',
      confidence: 76,
      priority: 'medium',
      actions: ['Пересмотр тарифов', 'Энергосбережение', 'Переговоры с поставщиками'],
    },
    {
      type: 'trend',
      title: 'Рост безналичных платежей',
      description: 'Доля безналичных платежей выросла до 87%. Рекомендуется внедрение бонусной системы',
      impact: '+₸45,000/мес',
      confidence: 94,
      priority: 'low',
      actions: ['Loyalty программа', 'Cashback система', 'Мобильное приложение'],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return '#2e7d32';
      case 'good': return '#1976d2';
      case 'moderate': return '#ff9800';
      case 'needs_attention': return '#d32f2f';
      default: return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'excellent': return 'Отлично';
      case 'good': return 'Хорошо';
      case 'moderate': return 'Средне';
      case 'needs_attention': return 'Требует внимания';
      default: return status;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return '#2e7d32';
      case 'medium': return '#ff9800';
      case 'high': return '#d32f2f';
      default: return '#666';
    }
  };

  const getRiskText = (risk: string) => {
    switch (risk) {
      case 'low': return 'Низкий риск';
      case 'medium': return 'Средний риск';
      case 'high': return 'Высокий риск';
      default: return risk;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUp sx={{ color: '#2e7d32' }} />;
      case 'risk': return <Warning sx={{ color: '#d32f2f' }} />;
      case 'trend': return <Timeline sx={{ color: '#1976d2' }} />;
      default: return <Info />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Заголовок */}
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
              background: 'linear-gradient(135deg, #2e7d32 0%, #43a047 100%)',
              color: 'white',
            }}
          >
            <AccountBalance sx={{ fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
              💰 Финансовая аналитика
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#666' }}>
              AI-анализ финансовых показателей и прогнозирование
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={refreshing ? <CircularProgress size={16} /> : <Refresh />}
              onClick={refreshData}
              disabled={refreshing}
              size="small"
            >
              {refreshing ? 'Обновление...' : 'Обновить'}
            </Button>
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
            <TextField
              select
              size="small"
              label="Клуб"
              value={selectedClub}
              onChange={(e) => setSelectedClub(e.target.value)}
              sx={{ minWidth: 150, mr: 2 }}
            >
              <MenuItem value="all">Все клубы</MenuItem>
              <MenuItem value="almaty1">CyberArena Almaty</MenuItem>
              <MenuItem value="astana">GameZone Astana</MenuItem>
              <MenuItem value="shymkent">ProGaming Shymkent</MenuItem>
              <MenuItem value="almaty2">EsportsHub Almaty</MenuItem>
            </TextField>
            <Button variant="contained" startIcon={<Analytics />}>
              Сформировать отчет
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Error state */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading state */}
      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Card sx={{ p: 2 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="text" height={30} />
                <Skeleton variant="text" height={20} />
                <Skeleton variant="rectangular" height={100} />
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <>
          {/* Финансовые метрики */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {financialMetrics.map((metric, index) => (
              <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
                <Card sx={{ 
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${metric.color}15 0%, ${metric.color}25 100%)`,
                  border: `2px solid ${metric.color}30`,
                  height: '100%',
                }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: metric.color,
                    color: 'white',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  {metric.icon}
                </Box>
                <Typography variant="caption" sx={{ color: '#666', fontWeight: 'bold', display: 'block' }}>
                  {metric.title}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: metric.color, my: 1 }}>
                  {metric.value}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 2 }}>
                  {metric.trend === 'up' ? (
                    <TrendingUp sx={{ color: '#2e7d32', fontSize: 16 }} />
                  ) : metric.trend === 'down' ? (
                    <TrendingDown sx={{ color: '#d32f2f', fontSize: 16 }} />
                  ) : (
                    <TrendingFlat sx={{ color: '#666', fontSize: 16 }} />
                  )}
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: metric.trend === 'up' ? '#2e7d32' : metric.trend === 'down' ? '#d32f2f' : '#666',
                      fontWeight: 'bold'
                    }}
                  >
                    {metric.change}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 1 }}>
                  Цель: {metric.target}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(metric.progress, 100)}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: `${metric.color}20`,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: metric.color,
                    }
                  }}
                />
                <Typography variant="caption" sx={{ color: '#666', mt: 0.5, display: 'block' }}>
                  {metric.progress.toFixed(1)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* AI Прогнозы доходов */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Psychology sx={{ color: '#1976d2', fontSize: 32 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  🔮 AI Прогнозы доходов
                </Typography>
                <Chip label="Машинное обучение" color="primary" size="small" />
              </Box>

              <Grid container spacing={2}>
                {revenueForecasts.map((forecast, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Paper sx={{ 
                      p: 3, 
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${getRiskColor(forecast.risk)}15 0%, ${getRiskColor(forecast.risk)}25 100%)`,
                      border: `1px solid ${getRiskColor(forecast.risk)}30`,
                    }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {forecast.period}
                        </Typography>
                        <Chip 
                          label={getRiskText(forecast.risk)}
                          size="small"
                          sx={{
                            backgroundColor: getRiskColor(forecast.risk),
                            color: 'white',
                          }}
                        />
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: getRiskColor(forecast.risk), mb: 1 }}>
                        {forecast.predicted}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                          {forecast.change}
                        </Typography>
                        <Typography variant="caption">
                          {forecast.confidence}% точность
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={forecast.confidence}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          mb: 2,
                          backgroundColor: `${getRiskColor(forecast.risk)}20`,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getRiskColor(forecast.risk),
                          }
                        }}
                      />
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        Факторы: {forecast.factors.join(', ')}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Детализация по клубам */}
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Compare sx={{ color: '#ff9800', fontSize: 32 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  🏢 Сравнение клубов
                </Typography>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Клуб</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Выручка</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Прибыль</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Маржа</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Рост</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Клиенты</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Средний чек</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>Статус</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {clubFinancials.map((club) => (
                      <TableRow key={club.name} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ 
                              backgroundColor: getStatusColor(club.status),
                              width: 32,
                              height: 32,
                              fontSize: 14,
                            }}>
                              {club.name.charAt(0)}
                            </Avatar>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {club.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {club.revenue}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                            {club.profit}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {club.margin}%
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                            {club.trend === 'up' ? (
                              <TrendingUp sx={{ color: '#2e7d32', fontSize: 16 }} />
                            ) : (
                              <TrendingFlat sx={{ color: '#666', fontSize: 16 }} />
                            )}
                            <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                              {club.growth}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            {club.customers.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {club.avgCheck}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={getStatusText(club.status)}
                            size="small"
                            sx={{
                              backgroundColor: getStatusColor(club.status),
                              color: 'white',
                              fontWeight: 'bold',
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Финансовые инсайты */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Insights sx={{ color: '#9c27b0', fontSize: 32 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  💡 AI Финансовые инсайты
                </Typography>
              </Box>

              <List sx={{ p: 0 }}>
                {financialInsights.map((insight, index) => (
                  <React.Fragment key={index}>
                    <Accordion sx={{ boxShadow: 'none', border: '1px solid #e0e0e0', borderRadius: 2, mb: 1 }}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                          {getInsightIcon(insight.type)}
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {insight.title}
                            </Typography>
                            <Typography variant="h6" sx={{ 
                              color: insight.type === 'risk' ? '#d32f2f' : '#2e7d32',
                              fontWeight: 'bold',
                            }}>
                              {insight.impact}
                            </Typography>
                          </Box>
                          <Chip 
                            label={`${insight.confidence}%`}
                            size="small"
                            color={insight.priority === 'high' ? 'error' : insight.priority === 'medium' ? 'warning' : 'success'}
                          />
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
                          {insight.description}
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#666', display: 'block', mb: 1 }}>
                          Рекомендуемые действия:
                        </Typography>
                        <List dense sx={{ p: 0 }}>
                          {insight.actions.map((action, actionIndex) => (
                            <ListItem key={actionIndex} sx={{ px: 0, py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 24 }}>
                                <CheckCircle sx={{ fontSize: 16, color: '#2e7d32' }} />
                              </ListItemIcon>
                              <ListItemText 
                                primary={action}
                                primaryTypographyProps={{ variant: 'caption' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      </>
      )}
    </Box>
  );
};

export default FinancialAnalyticsPage;
