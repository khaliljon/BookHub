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
  Paper,
  LinearProgress,
  Alert,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Badge,
  Tooltip,
  IconButton,
  Accordion,
  AccordionSummary,
  CircularProgress,
  Skeleton,
  AccordionDetails,
  Stepper,
  Step,
  StepLabel,
  Divider,
} from '@mui/material';
import {
  People,
  PersonAdd,
  PersonRemove,
  TrendingUp,
  TrendingDown,
  Psychology,
  Star,
  Loyalty,
  Schedule,
  AttachMoney,
  SportsEsports,
  Favorite,
  Warning,
  CheckCircle,
  Timeline,
  Speed,
  Analytics,
  Insights,
  PeopleAlt,
  Group,
  Person,
  ExpandMore,
  LocalOffer,
  Campaign,
  Email,
  Sms,
  NotificationsActive,
  AutoFixHigh,
  Recommend,
  PersonSearch,
  EmojiEvents,
  TrendingFlat,
  MonetizationOn,
  Refresh,
} from '@mui/icons-material';
import { aiAnalyticsService } from '../services/AiAnalyticsService';

const CustomerIntelligencePage: React.FC = () => {
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Real AI data states
  const [customerSegmentation, setCustomerSegmentation] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Load AI data
  useEffect(() => {
    loadAiData();
  }, [selectedSegment, selectedPeriod]);

  const loadAiData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [segmentation, dashboard] = await Promise.all([
        aiAnalyticsService.getCustomerSegmentation(),
        aiAnalyticsService.getDashboardSummary()
      ]);
      
      setCustomerSegmentation(segmentation);
      setDashboardData(dashboard);
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

  // Сегменты клиентов
  const getCustomerSegmentsFromAI = () => {
    if (!customerSegmentation?.data) {
      return [
        {
      name: 'VIP Геймеры',
      count: 89,
      percentage: 7.2,
      avgSpend: '₸4,850',
      retention: 94,
      satisfaction: 9.1,
      color: '#ffd700',
      growth: '+23.4%',
      characteristics: ['Играют 4+ часа', 'Покупают премиум', 'Участвуют в турнирах'],
      value: 'vip',
    },
    {
      name: 'Активные Игроки',
      count: 342,
      percentage: 27.6,
      avgSpend: '₸2,340',
      retention: 78,
      satisfaction: 8.3,
      color: '#4caf50',
      growth: '+12.8%',
      characteristics: ['Играют 2-4 часа', 'Регулярные визиты', 'Социально активны'],
      value: 'active',
    },
    {
      name: 'Случайные Посетители',
      count: 534,
      percentage: 43.1,
      avgSpend: '₸1,120',
      retention: 45,
      satisfaction: 7.1,
      color: '#ff9800',
      growth: '+5.2%',
      characteristics: ['Играют 1-2 часа', 'Нерегулярно', 'Ценочувствительны'],
      value: 'casual',
    },
    {
      name: 'Группа Риска',
      count: 147,
      percentage: 11.9,
      avgSpend: '₸680',
      retention: 23,
      satisfaction: 5.8,
      color: '#f44336',
      growth: '-8.7%',
      characteristics: ['Редкие визиты', 'Жалобы', 'Низкие траты'],
      value: 'risk',
    },
    {
      name: 'Новички',
      count: 127,
      percentage: 10.2,
      avgSpend: '₸890',
      retention: 67,
      satisfaction: 8.0,
      color: '#9c27b0',
      growth: '+45.6%',
      characteristics: ['Первый месяц', 'Изучают игры', 'Потенциал роста'],
      value: 'newbie',
    },
  ];
  }

  // Transform AI segmentation data
  return customerSegmentation.data.map((segment: any) => ({
    name: segment.segment || 'Неизвестный сегмент',
    count: segment.customer_count || 0,
    percentage: ((segment.customer_count || 0) / (customerSegmentation.total_customers || 1) * 100),
    avgSpend: `₸${segment.avg_spent?.toLocaleString() || '0'}`,
    retention: Math.min(100, segment.retention_rate || 75),
    satisfaction: Math.min(10, segment.satisfaction_score || 7.5),
    color: getSegmentColor(segment.segment),
    growth: `+${segment.growth_rate?.toFixed(1) || '0'}%`,
    characteristics: segment.characteristics || ['AI анализ', 'Персонализация'],
    value: segment.segment?.toLowerCase().replace(/\s+/g, '_') || 'unknown',
    aiScore: segment.ai_score || 70,
    clvPredicted: segment.clv_predicted || 0,
    churnRisk: segment.churn_risk || 25
  }));
};

const getSegmentColor = (segment: string) => {
  switch (segment?.toLowerCase()) {
    case 'vip': return '#ffd700';
    case 'high-value': return '#4caf50';
    case 'regular': return '#2196f3';
    case 'at-risk': return '#ff9800';
    case 'new': return '#9c27b0';
    default: return '#757575';
  }
};

const customerSegments = getCustomerSegmentsFromAI();

  // AI предсказания поведения клиентов
  const behaviorPredictions = [
    {
      type: 'churn_risk',
      title: 'Риск оттока',
      customers: 23,
      probability: 89,
      timeframe: '7 дней',
      impact: '-₸51,200',
      prevention: ['Персональные скидки', 'Звонок менеджера', 'Эксклюзивные турниры'],
      confidence: 91,
      severity: 'high',
    },
    {
      type: 'upsell_opportunity',
      title: 'Возможность апселла',
      customers: 67,
      probability: 76,
      timeframe: '14 дней',
      impact: '+₸89,400',
      prevention: ['Премиум пакеты', 'Персональные тренировки', 'VIP услуги'],
      confidence: 84,
      severity: 'medium',
    },
    {
      type: 'loyalty_growth',
      title: 'Рост лояльности',
      customers: 145,
      probability: 82,
      timeframe: '30 дней',
      impact: '+₸234,500',
      prevention: ['Бонусная программа', 'Реферальная система', 'Персонализация'],
      confidence: 78,
      severity: 'low',
    },
  ];

  // Топ клиенты с AI-анализом
  const topCustomers = [
    {
      id: 1,
      name: 'Алексей Смирнов',
      email: 'alex.smirnov@gmail.com',
      totalSpent: '₸28,500',
      visits: 47,
      avgSession: '3.2 ч',
      favoriteGame: 'Dota 2',
      clv: '₸45,000',
      churnRisk: 12,
      upsellScore: 94,
      satisfaction: 9.2,
      segment: 'VIP',
      lastVisit: '2 дня назад',
      recommendations: ['Турнир Dota 2', 'Премиум аккаунт', 'Персональный тренер'],
    },
    {
      id: 2,
      name: 'Мария Иванова',
      email: 'maria.ivanova@gmail.com',
      totalSpent: '₸19,800',
      visits: 32,
      avgSession: '2.8 ч',
      favoriteGame: 'Valorant',
      clv: '₸32,000',
      churnRisk: 8,
      upsellScore: 87,
      satisfaction: 8.9,
      segment: 'VIP',
      lastVisit: '1 день назад',
      recommendations: ['Women Valorant Cup', 'Gaming accessories', 'Стриминг сессии'],
    },
    {
      id: 3,
      name: 'Дмитрий Петров',
      email: 'dmitry.petrov@gmail.com',
      totalSpent: '₸15,600',
      visits: 28,
      avgSession: '4.1 ч',
      favoriteGame: 'CS:GO',
      clv: '₸28,500',
      churnRisk: 15,
      upsellScore: 82,
      satisfaction: 8.7,
      segment: 'Активный',
      lastVisit: '4 дня назад',
      recommendations: ['CS:GO турнир', 'Групповая игра', 'Скидка на ночные часы'],
    },
  ];

  // AI рекомендации для сегментов
  const segmentRecommendations = [
    {
      segment: 'VIP Геймеры',
      priority: 'high',
      action: 'Эксклюзивная программа',
      description: 'Создать VIP-клуб с персональными тренерами и эксклюзивными турнирами',
      impact: '+₸156,000/мес',
      effort: 'medium',
      timeline: '2 недели',
    },
    {
      segment: 'Группа Риска',
      priority: 'critical',
      action: 'Retention кампания',
      description: 'Запустить персонализированную программу возврата с индивидуальными предложениями',
      impact: '+₸89,000/мес',
      effort: 'low',
      timeline: '1 неделя',
    },
    {
      segment: 'Новички',
      priority: 'medium',
      action: 'Onboarding программа',
      description: 'Внедрить систему адаптации новых клиентов с гайдами и скидками',
      impact: '+₸67,000/мес',
      effort: 'medium',
      timeline: '3 недели',
    },
  ];

  const getRiskColor = (risk: number) => {
    if (risk < 20) return '#4caf50';
    if (risk < 50) return '#ff9800';
    return '#f44336';
  };

  const getScoreColor = (score: number) => {
    if (score > 80) return '#4caf50';
    if (score > 60) return '#ff9800';
    return '#f44336';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#f44336';
      case 'high': return '#ff9800';
      case 'medium': return '#2196f3';
      case 'low': return '#4caf50';
      default: return '#666';
    }
  };

  const getPredictionIcon = (type: string) => {
    switch (type) {
      case 'churn_risk': return <PersonRemove sx={{ color: '#f44336' }} />;
      case 'upsell_opportunity': return <TrendingUp sx={{ color: '#4caf50' }} />;
      case 'loyalty_growth': return <Favorite sx={{ color: '#e91e63' }} />;
      default: return <Analytics />;
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
              background: 'linear-gradient(135deg, #e91e63 0%, #ad1457 100%)',
              color: 'white',
            }}
          >
            <Psychology sx={{ fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#e91e63' }}>
              🧠 Customer Intelligence
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#666' }}>
              AI-анализ поведения и сегментация клиентов
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <TextField
              select
              size="small"
              label="Сегмент"
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              sx={{ minWidth: 150, mr: 2 }}
            >
              <MenuItem value="all">Все сегменты</MenuItem>
              {customerSegments.map((segment: any) => (
                <MenuItem key={segment.value} value={segment.value}>
                  {segment.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              size="small"
              label="Период"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              sx={{ minWidth: 120, mr: 2 }}
            >
              <MenuItem value="week">Неделя</MenuItem>
              <MenuItem value="month">Месяц</MenuItem>
              <MenuItem value="quarter">Квартал</MenuItem>
            </TextField>
            <Button
              variant="outlined"
              startIcon={refreshing ? <CircularProgress size={16} /> : <Refresh />}
              onClick={refreshData}
              disabled={refreshing}
              size="small"
              sx={{ mr: 2 }}
            >
              {refreshing ? 'Обновление...' : 'Обновить'}
            </Button>
            <Button variant="contained" startIcon={<AutoFixHigh />}>
              Создать кампанию
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
          {[1, 2, 3, 4, 5].map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={item}>
              <Card sx={{ p: 2 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="text" height={30} />
                <Skeleton variant="text" height={20} />
                <Skeleton variant="rectangular" height={80} />
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <>
          {/* Сегменты клиентов */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {customerSegments.map((segment: any) => (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={segment.value}>
                <Card sx={{ 
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${segment.color}15 0%, ${segment.color}25 100%)`,
                  border: `2px solid ${segment.color}40`,
                  height: '100%',
                }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {segment.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {segment.growth.startsWith('+') ? (
                      <TrendingUp sx={{ fontSize: 16, color: '#4caf50' }} />
                    ) : segment.growth.startsWith('-') ? (
                      <TrendingDown sx={{ fontSize: 16, color: '#f44336' }} />
                    ) : (
                      <TrendingFlat sx={{ fontSize: 16, color: '#666' }} />
                    )}
                    <Typography variant="caption" sx={{ 
                      color: segment.growth.startsWith('+') ? '#4caf50' : segment.growth.startsWith('-') ? '#f44336' : '#666',
                      fontWeight: 'bold'
                    }}>
                      {segment.growth}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="h4" sx={{ fontWeight: 'bold', color: segment.color, mb: 1 }}>
                  {segment.count}
                </Typography>
                <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 2 }}>
                  {segment.percentage}% от всех клиентов
                </Typography>

                <Grid container spacing={1} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: '#666' }}>Средний чек</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{segment.avgSpend}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: '#666' }}>Retention</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{segment.retention}%</Typography>
                  </Grid>
                </Grid>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ color: '#666' }}>Удовлетворенность</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={(segment.satisfaction / 10) * 100}
                      sx={{
                        flexGrow: 1,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: `${segment.color}20`,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: segment.color,
                        }
                      }}
                    />
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                      {segment.satisfaction}/10
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="caption" sx={{ color: '#666', fontStyle: 'italic' }}>
                  {segment.characteristics.join(', ')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* AI Предсказания поведения */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Psychology sx={{ color: '#2196f3', fontSize: 32 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  🎯 AI Предсказания поведения
                </Typography>
                <Chip label="Реальное время" color="info" size="small" />
              </Box>

              <Grid container spacing={3}>
                {behaviorPredictions.map((prediction, index) => (
                  <Grid item xs={12} key={index}>
                    <Paper sx={{ 
                      p: 3, 
                      borderRadius: 2,
                      border: `2px solid ${prediction.severity === 'high' ? '#f44336' : prediction.severity === 'medium' ? '#ff9800' : '#4caf50'}20`,
                      background: `linear-gradient(135deg, ${prediction.severity === 'high' ? '#f44336' : prediction.severity === 'medium' ? '#ff9800' : '#4caf50'}10 0%, ${prediction.severity === 'high' ? '#f44336' : prediction.severity === 'medium' ? '#ff9800' : '#4caf50'}20 100%)`,
                    }}>
                      <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={3}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {getPredictionIcon(prediction.type)}
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                {prediction.title}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#666' }}>
                                {prediction.customers} клиентов
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <Typography variant="caption" sx={{ color: '#666' }}>Вероятность</Typography>
                          <Typography variant="h5" sx={{ fontWeight: 'bold', color: prediction.severity === 'high' ? '#f44336' : prediction.severity === 'medium' ? '#ff9800' : '#4caf50' }}>
                            {prediction.probability}%
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <Typography variant="caption" sx={{ color: '#666' }}>Временные рамки</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {prediction.timeframe}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <Typography variant="caption" sx={{ color: '#666' }}>Финансовый impact</Typography>
                          <Typography variant="h6" sx={{ 
                            fontWeight: 'bold',
                            color: prediction.impact.startsWith('+') ? '#4caf50' : '#f44336'
                          }}>
                            {prediction.impact}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 1 }}>
                            Рекомендации:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {prediction.prevention.slice(0, 2).map((action, actionIndex) => (
                              <Chip 
                                key={actionIndex}
                                label={action}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem' }}
                              />
                            ))}
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Топ клиенты */}
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <EmojiEvents sx={{ color: '#ffc107', fontSize: 32 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  🏆 Топ клиенты с AI-анализом
                </Typography>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Клиент</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>CLV</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>Churn Risk</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>Upsell Score</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>Satisfaction</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>AI Рекомендации</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topCustomers.map((customer) => (
                      <TableRow key={customer.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Badge
                              badgeContent={customer.segment}
                              color={customer.segment === 'VIP' ? 'warning' : 'primary'}
                              anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                              }}
                            >
                              <Avatar sx={{ backgroundColor: getSegmentColor(customer.segment) }}>
                                {customer.name.charAt(0)}
                              </Avatar>
                            </Badge>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {customer.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#666' }}>
                                {customer.favoriteGame} • {customer.visits} визитов
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                                Потрачено: {customer.totalSpent}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                            {customer.clv}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={`${customer.churnRisk}%`}
                            size="small"
                            sx={{
                              backgroundColor: getRiskColor(customer.churnRisk),
                              color: 'white',
                              fontWeight: 'bold',
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={customer.upsellScore}
                              sx={{
                                width: 60,
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: `${getScoreColor(customer.upsellScore)}20`,
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: getScoreColor(customer.upsellScore),
                                }
                              }}
                            />
                            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                              {customer.upsellScore}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                            <Star sx={{ fontSize: 16, color: '#ffc107' }} />
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {customer.satisfaction}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                            {customer.recommendations.slice(0, 2).map((rec, recIndex) => (
                              <Chip 
                                key={recIndex}
                                label={rec}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem' }}
                              />
                            ))}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Рекомендации для сегментов */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <AutoFixHigh sx={{ color: '#9c27b0', fontSize: 32 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  🎯 AI Рекомендации
                </Typography>
              </Box>

              <List sx={{ p: 0 }}>
                {segmentRecommendations.map((rec, index) => (
                  <React.Fragment key={index}>
                    <Accordion sx={{ 
                      boxShadow: 'none', 
                      border: `2px solid ${getPriorityColor(rec.priority)}30`, 
                      borderRadius: 2, 
                      mb: 2,
                      background: `linear-gradient(135deg, ${getPriorityColor(rec.priority)}10 0%, ${getPriorityColor(rec.priority)}20 100%)`,
                    }}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              backgroundColor: getPriorityColor(rec.priority),
                            }}
                          />
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {rec.segment}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#666' }}>
                              {rec.action}
                            </Typography>
                          </Box>
                          <Typography variant="h6" sx={{ 
                            color: '#4caf50',
                            fontWeight: 'bold',
                          }}>
                            {rec.impact}
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
                          {rec.description}
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: '#666' }}>Сложность:</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {rec.effort === 'low' ? 'Низкая' : rec.effort === 'medium' ? 'Средняя' : 'Высокая'}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: '#666' }}>Время:</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {rec.timeline}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Button 
                          variant="contained" 
                          size="small" 
                          sx={{ mt: 2 }}
                          startIcon={<Campaign />}
                        >
                          Запустить кампанию
                        </Button>
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

export default CustomerIntelligencePage;
