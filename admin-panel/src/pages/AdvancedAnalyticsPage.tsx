import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { TrendingUp, TrendingDown, Insights, AutoFixHigh, ShowChart } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const metrics = [
  { label: 'Выручка (месяц)', value: '₸2,840,000', change: '+18.4%', color: '#1976d2', icon: <TrendingUp /> },
  { label: 'Клиенты', value: '1,247', change: '+7.2%', color: '#2e7d32', icon: <TrendingUp /> },
  { label: 'Средний чек', value: '₸1,950', change: '+5.7%', color: '#9c27b0', icon: <TrendingUp /> },
  { label: 'Бронирований', value: '3,420', change: '+12.1%', color: '#ed6c02', icon: <TrendingUp /> },
];

const revenueData = [
  { date: '01.07', value: 120000 },
  { date: '05.07', value: 180000 },
  { date: '10.07', value: 240000 },
  { date: '15.07', value: 320000 },
  { date: '20.07', value: 410000 },
  { date: '25.07', value: 520000 },
  { date: '30.07', value: 600000 },
];

const aiInsights = [
  { type: 'insight', title: 'Рост выручки на 18%', desc: 'AI прогнозирует рост выручки в следующем месяце благодаря новому турниру и акциям.', icon: <Insights sx={{ color: '#1976d2' }} /> },
  { type: 'optimization', title: 'Оптимизация расписания', desc: 'AI рекомендует увеличить количество ночных смен для повышения загрузки.', icon: <AutoFixHigh sx={{ color: '#ed6c02' }} /> },
  { type: 'trend', title: 'Популярность VR', desc: 'Запросы на VR-игры выросли на 45%. Рекомендуется добавить VR-зону.', icon: <ShowChart sx={{ color: '#9c27b0' }} /> },
];

const AdvancedAnalyticsPage: React.FC = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>
        🧠 AI Dashboard
      </Typography>
      <Typography variant="subtitle1" sx={{ color: '#666', mb: 4 }}>
        Ключевые метрики, прогнозы и AI-инсайты для вашего бизнеса.
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((m, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card sx={{ borderRadius: 3, background: `${m.color}10` }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {m.icon}
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: m.color }}>{m.value}</Typography>
                    <Typography variant="body2">{m.label}</Typography>
                  </Box>
                </Box>
                <Chip label={m.change} color="success" size="small" sx={{ mt: 2 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Card sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>📈 Динамика выручки</Typography>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#1976d2" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card sx={{ borderRadius: 3, maxWidth: 700, mx: 'auto' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>🤖 AI Инсайты</Typography>
          <List>
            {aiInsights.map((insight, i) => (
              <React.Fragment key={i}>
                <ListItem alignItems="flex-start">
                  <ListItemIcon>{insight.icon}</ListItemIcon>
                  <ListItemText
                    primary={<Typography sx={{ fontWeight: 'bold' }}>{insight.title}</Typography>}
                    secondary={insight.desc}
                  />
                </ListItem>
                {i < aiInsights.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdvancedAnalyticsPage;
