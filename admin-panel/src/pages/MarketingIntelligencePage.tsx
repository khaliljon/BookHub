import React, { useState } from 'react';
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
  ListItemIcon,
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
  Stepper,
  Step,
  StepLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Fab,
} from '@mui/material';
import {
  Campaign,
  TrendingUp,
  TrendingDown,
  Share,
  Email,
  Sms,
  WhatsApp,
  Facebook,
  Instagram,
  YouTube,
  Twitter,
  Telegram,
  Analytics,
  Insights,
  AutoFixHigh,
  Psychology,
  Star,
  Visibility,
  ThumbUp,
  Comment,
  PlayArrow,
  Stop,
  Add,
  ExpandMore,
  CheckCircle,
  Warning,
  Schedule,
  MonetizationOn,
  People,
  Mouse,
  TouchApp,
  Speed,
  Timeline,
  Assessment,
  GpsFixed,
  Launch,
  EmojiEvents,
  LocalOffer,
} from '@mui/icons-material';

const MarketingIntelligencePage: React.FC = () => {
  const [selectedCampaign, setSelectedCampaign] = useState('all');
  const [selectedChannel, setSelectedChannel] = useState('all');

  // Активные кампании
  const activeCampaigns = [
    {
      id: 1,
      name: 'Новогодняя акция 2025',
      status: 'active',
      budget: '₸150,000',
      spent: '₸89,400',
      roi: 340,
      impressions: 45200,
      clicks: 2840,
      conversions: 123,
      ctr: 6.3,
      cpc: '₸31.5',
      channels: ['Facebook', 'Instagram', 'Google Ads'],
      startDate: '2024-12-15',
      endDate: '2025-01-15',
      performance: 'excellent',
      aiScore: 94,
    },
    {
      id: 2,
      name: 'Valorant Championship',
      status: 'active',
      budget: '₸80,000',
      spent: '₸56,200',
      roi: 280,
      impressions: 28900,
      clicks: 1670,
      conversions: 89,
      ctr: 5.8,
      cpc: '₸33.7',
      channels: ['Instagram', 'TikTok', 'Telegram'],
      startDate: '2024-12-01',
      endDate: '2025-01-31',
      performance: 'good',
      aiScore: 87,
    },
    {
      id: 3,
      name: 'Студенческие скидки',
      status: 'paused',
      budget: '₸45,000',
      spent: '₸28,900',
      roi: 150,
      impressions: 18400,
      clicks: 890,
      conversions: 34,
      ctr: 4.8,
      cpc: '₸32.5',
      channels: ['Facebook', 'VK', 'Instagram'],
      startDate: '2024-11-15',
      endDate: '2025-02-28',
      performance: 'moderate',
      aiScore: 71,
    },
    {
      id: 4,
      name: 'Midnight Gaming',
      status: 'planning',
      budget: '₸100,000',
      spent: '₸0',
      roi: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      ctr: 0,
      cpc: '₸0',
      channels: ['Instagram', 'YouTube', 'TikTok'],
      startDate: '2025-01-20',
      endDate: '2025-03-20',
      performance: 'planning',
      aiScore: 85,
    },
  ];

  // Каналы маркетинга
  const marketingChannels = [
    {
      name: 'Instagram',
      icon: <Instagram sx={{ color: '#E4405F' }} />,
      followers: 12500,
      engagement: 8.7,
      reach: 89400,
      impressions: 156000,
      ctr: 6.2,
      conversions: 234,
      roi: 420,
      cost: '₸45,600',
      performance: 'excellent',
      growth: '+23.4%',
    },
    {
      name: 'Facebook',
      icon: <Facebook sx={{ color: '#1877F2' }} />,
      followers: 8900,
      engagement: 5.4,
      reach: 67200,
      impressions: 134000,
      ctr: 4.8,
      conversions: 189,
      roi: 350,
      cost: '₸38,900',
      performance: 'good',
      growth: '+12.7%',
    },
    {
      name: 'TikTok',
      icon: <PlayArrow sx={{ color: '#000000' }} />,
      followers: 15600,
      engagement: 12.3,
      reach: 145000,
      impressions: 890000,
      ctr: 8.9,
      conversions: 156,
      roi: 290,
      cost: '₸32,400',
      performance: 'excellent',
      growth: '+67.8%',
    },
    {
      name: 'Google Ads',
      icon: <Campaign sx={{ color: '#4285F4' }} />,
      followers: 0,
      engagement: 0,
      reach: 34500,
      impressions: 78900,
      ctr: 5.6,
      conversions: 345,
      roi: 380,
      cost: '₸67,800',
      performance: 'good',
      growth: '+18.9%',
    },
    {
      name: 'Telegram',
      icon: <Telegram sx={{ color: '#0088CC' }} />,
      followers: 4500,
      engagement: 15.6,
      reach: 23400,
      impressions: 45600,
      ctr: 7.8,
      conversions: 89,
      roi: 240,
      cost: '₸12,300',
      performance: 'moderate',
      growth: '+34.2%',
    },
  ];

  // AI рекомендации для маркетинга
  const marketingInsights = [
    {
      type: 'opportunity',
      priority: 'high',
      title: 'Увеличить бюджет TikTok',
      description: 'TikTok показывает лучший ROI (290%) и самый высокий рост (+67.8%). Рекомендуется увеличить бюджет на 40%',
      impact: '+₸89,000/мес',
      confidence: 92,
      actions: ['Увеличить бюджет TikTok', 'Создать тренд-контент', 'Запустить челлендж'],
      channels: ['TikTok'],
    },
    {
      type: 'optimization',
      priority: 'medium',
      title: 'Оптимизация времени публикаций',
      description: 'AI выявил оптимальное время: Instagram 18:00-20:00, Facebook 19:00-21:00',
      impact: '+₸34,500/мес',
      confidence: 87,
      actions: ['Автопостинг по расписанию', 'A/B тест времени', 'Анализ активности аудитории'],
      channels: ['Instagram', 'Facebook'],
    },
    {
      type: 'warning',
      priority: 'medium',
      title: 'Снижение CTR Facebook',
      description: 'CTR Facebook снизился на 12% за последние 2 недели. Нужно обновить креативы',
      impact: '-₸23,400/мес',
      confidence: 84,
      actions: ['Обновить креативы', 'A/B тест новых форматов', 'Пересмотреть таргетинг'],
      channels: ['Facebook'],
    },
    {
      type: 'trend',
      priority: 'low',
      title: 'Рост интереса к VR играм',
      description: 'Поисковые запросы по VR играм выросли на 45%. Возможность для новой кампании',
      impact: '+₸56,700/мес',
      confidence: 78,
      actions: ['Создать VR-кампанию', 'Партнерство с VR-разработчиками', 'VR-контент'],
      channels: ['YouTube', 'Instagram'],
    },
  ];

  // Прогнозы кампаний
  const campaignForecasts = [
    {
      campaign: 'Новогодняя акция 2025',
      predictedROI: 450,
      predictedConversions: 189,
      predictedRevenue: '₸285,000',
      confidence: 91,
      timeToOptimal: '3 дня',
      recommendations: ['Увеличить бюджет Instagram', 'Добавить видео-креативы'],
    },
    {
      campaign: 'Valorant Championship',
      predictedROI: 320,
      predictedConversions: 134,
      predictedRevenue: '₸189,000',
      confidence: 86,
      timeToOptimal: '1 неделя',
      recommendations: ['Больше контента с геймерами', 'Добавить стори-формат'],
    },
  ];

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return '#4caf50';
      case 'good': return '#2196f3';
      case 'moderate': return '#ff9800';
      case 'poor': return '#f44336';
      case 'planning': return '#9c27b0';
      default: return '#666';
    }
  };

  const getPerformanceText = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'Отлично';
      case 'good': return 'Хорошо';
      case 'moderate': return 'Средне';
      case 'poor': return 'Плохо';
      case 'planning': return 'Планируется';
      default: return performance;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4caf50';
      case 'paused': return '#ff9800';
      case 'planning': return '#9c27b0';
      case 'completed': return '#2196f3';
      default: return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активна';
      case 'paused': return 'На паузе';
      case 'planning': return 'Планируется';
      case 'completed': return 'Завершена';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#666';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUp sx={{ color: '#4caf50' }} />;
      case 'optimization': return <AutoFixHigh sx={{ color: '#2196f3' }} />;
      case 'warning': return <Warning sx={{ color: '#ff9800' }} />;
      case 'trend': return <Timeline sx={{ color: '#9c27b0' }} />;
      default: return <Insights />;
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
              background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)',
              color: 'white',
            }}
          >
            <Campaign sx={{ fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FF6B6B' }}>
              📢 Marketing Intelligence
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#666' }}>
              AI-анализ маркетинговых кампаний и каналов продвижения
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <TextField
              select
              size="small"
              label="Кампания"
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              sx={{ minWidth: 150, mr: 2 }}
            >
              <MenuItem value="all">Все кампании</MenuItem>
              {activeCampaigns.map((campaign) => (
                <MenuItem key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              size="small"
              label="Канал"
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              sx={{ minWidth: 120, mr: 2 }}
            >
              <MenuItem value="all">Все каналы</MenuItem>
              <MenuItem value="social">Соцсети</MenuItem>
              <MenuItem value="paid">Реклама</MenuItem>
              <MenuItem value="organic">Органика</MenuItem>
            </TextField>
            <Button variant="contained" startIcon={<Add />}>
              Новая кампания
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Активные кампании */}
      <Card sx={{ borderRadius: 3, mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <GpsFixed sx={{ color: '#FF6B6B', fontSize: 32 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              🎯 Активные кампании
            </Typography>
            <Chip label={`${activeCampaigns.length} кампаний`} color="primary" size="small" />
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Кампания</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Статус</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Бюджет</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>ROI</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>CTR</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Конверсии</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>AI Оценка</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Каналы</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activeCampaigns.map((campaign) => (
                  <TableRow key={campaign.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {campaign.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          {campaign.startDate} - {campaign.endDate}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={getStatusText(campaign.status)}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(campaign.status),
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {campaign.budget}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          Потрачено: {campaign.spent}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ 
                        fontWeight: 'bold',
                        color: campaign.roi > 300 ? '#4caf50' : campaign.roi > 200 ? '#ff9800' : '#f44336'
                      }}>
                        {campaign.roi}%
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {campaign.ctr}%
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                        {campaign.conversions}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <CircularProgress
                          variant="determinate"
                          value={campaign.aiScore}
                          size={32}
                          sx={{
                            color: getPerformanceColor(campaign.performance),
                            '& .MuiCircularProgress-circle': {
                              strokeLinecap: 'round',
                            },
                          }}
                        />
                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                          {campaign.aiScore}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                        {campaign.channels.slice(0, 2).map((channel, index) => (
                          <Chip 
                            key={index}
                            label={channel}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        ))}
                        {campaign.channels.length > 2 && (
                          <Chip 
                            label={`+${campaign.channels.length - 2}`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Каналы маркетинга */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Share sx={{ color: '#4ECDC4', fontSize: 32 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  📱 Анализ каналов продвижения
                </Typography>
              </Box>

              <Grid container spacing={3}>
                {marketingChannels.map((channel, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Paper sx={{ 
                      p: 3, 
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${getPerformanceColor(channel.performance)}15 0%, ${getPerformanceColor(channel.performance)}25 100%)`,
                      border: `2px solid ${getPerformanceColor(channel.performance)}30`,
                    }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {channel.icon}
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {channel.name}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TrendingUp sx={{ fontSize: 16, color: '#4caf50' }} />
                          <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                            {channel.growth}
                          </Typography>
                        </Box>
                      </Box>

                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: '#666' }}>ROI</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                            {channel.roi}%
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: '#666' }}>CTR</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {channel.ctr}%
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: '#666' }}>Конверсии</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {channel.conversions}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ color: '#666' }}>Стоимость</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {channel.cost}
                          </Typography>
                        </Grid>
                      </Grid>

                      {channel.followers > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="caption" sx={{ color: '#666' }}>Подписчики / Engagement</Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {channel.followers.toLocaleString()}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                              {channel.engagement}%
                            </Typography>
                          </Box>
                        </Box>
                      )}

                      <Box>
                        <Typography variant="caption" sx={{ color: '#666' }}>Эффективность</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={channel.roi / 5}
                            sx={{
                              flexGrow: 1,
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: `${getPerformanceColor(channel.performance)}20`,
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: getPerformanceColor(channel.performance),
                              }
                            }}
                          />
                          <Chip 
                            label={getPerformanceText(channel.performance)}
                            size="small"
                            sx={{
                              backgroundColor: getPerformanceColor(channel.performance),
                              color: 'white',
                              fontWeight: 'bold',
                            }}
                          />
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* AI Прогнозы кампаний */}
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Psychology sx={{ color: '#9c27b0', fontSize: 32 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  🔮 AI Прогнозы кампаний
                </Typography>
              </Box>

              <Grid container spacing={3}>
                {campaignForecasts.map((forecast, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Paper sx={{ 
                      p: 3, 
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                    }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                        {forecast.campaign}
                      </Typography>
                      
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={4}>
                          <Typography variant="caption" sx={{ opacity: 0.8 }}>Прогноз ROI</Typography>
                          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            {forecast.predictedROI}%
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="caption" sx={{ opacity: 0.8 }}>Конверсии</Typography>
                          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            {forecast.predictedConversions}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="caption" sx={{ opacity: 0.8 }}>Выручка</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {forecast.predictedRevenue}
                          </Typography>
                        </Grid>
                      </Grid>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>Точность прогноза</Typography>
                        <LinearProgress
                          variant="determinate"
                          value={forecast.confidence}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'rgba(255,255,255,0.3)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: 'rgba(255,255,255,0.9)',
                            }
                          }}
                        />
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          {forecast.confidence}% • До оптимума: {forecast.timeToOptimal}
                        </Typography>
                      </Box>

                      <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', mb: 1 }}>
                        AI Рекомендации:
                      </Typography>
                      <List dense sx={{ p: 0 }}>
                        {forecast.recommendations.map((rec, recIndex) => (
                          <ListItem key={recIndex} sx={{ px: 0, py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 20 }}>
                              <CheckCircle sx={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }} />
                            </ListItemIcon>
                            <ListItemText 
                              primary={rec}
                              primaryTypographyProps={{ variant: 'caption', sx: { opacity: 0.9 } }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Marketing Insights */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Insights sx={{ color: '#FF6B6B', fontSize: 32 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  💡 Marketing Insights
                </Typography>
              </Box>

              <List sx={{ p: 0 }}>
                {marketingInsights.map((insight, index) => (
                  <React.Fragment key={index}>
                    <Accordion sx={{ 
                      boxShadow: 'none', 
                      border: `2px solid ${getPriorityColor(insight.priority)}30`, 
                      borderRadius: 2, 
                      mb: 2,
                      background: `linear-gradient(135deg, ${getPriorityColor(insight.priority)}10 0%, ${getPriorityColor(insight.priority)}20 100%)`,
                    }}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                          {getInsightIcon(insight.type)}
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {insight.title}
                            </Typography>
                            <Typography variant="h6" sx={{ 
                              color: insight.impact.startsWith('+') ? '#4caf50' : '#f44336',
                              fontWeight: 'bold',
                            }}>
                              {insight.impact}
                            </Typography>
                          </Box>
                          <Chip 
                            label={`${insight.confidence}%`}
                            size="small"
                            sx={{
                              backgroundColor: getPriorityColor(insight.priority),
                              color: 'white',
                            }}
                          />
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
                          {insight.description}
                        </Typography>
                        
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#666', display: 'block', mb: 1 }}>
                          Каналы:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                          {insight.channels.map((channel, channelIndex) => (
                            <Chip 
                              key={channelIndex}
                              label={channel}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          ))}
                        </Box>

                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#666', display: 'block', mb: 1 }}>
                          Рекомендуемые действия:
                        </Typography>
                        <List dense sx={{ p: 0 }}>
                          {insight.actions.map((action, actionIndex) => (
                            <ListItem key={actionIndex} sx={{ px: 0, py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 24 }}>
                                <CheckCircle sx={{ fontSize: 16, color: getPriorityColor(insight.priority) }} />
                              </ListItemIcon>
                              <ListItemText 
                                primary={action}
                                primaryTypographyProps={{ variant: 'caption' }}
                              />
                            </ListItem>
                          ))}
                        </List>

                        <Button 
                          variant="contained" 
                          size="small" 
                          sx={{ 
                            mt: 2,
                            backgroundColor: getPriorityColor(insight.priority),
                          }}
                          startIcon={<Launch />}
                        >
                          Применить
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

      {/* Floating Action Button */}
      <Fab 
        color="primary" 
        aria-label="add campaign"
        sx={{ 
          position: 'fixed', 
          bottom: 16, 
          right: 16,
          background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)',
        }}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default MarketingIntelligencePage;
