import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { TrendingUp, TrendingDown, Paid, Savings, Insights, ShowChart } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const metrics = [
  { label: 'Доходы (месяц)', value: '₸2,500,000', change: '+12.3%', color: '#1976d2', icon: <TrendingUp /> },
  { label: 'Расходы (месяц)', value: '₸1,200,000', change: '-4.1%', color: '#d32f2f', icon: <TrendingDown /> },
  { label: 'Прибыль', value: '₸1,300,000', change: '+21.7%', color: '#388e3c', icon: <Paid /> },
  { label: 'Средний чек', value: '₸2,050', change: '+3.2%', color: '#fbc02d', icon: <Savings /> },
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
  { title: 'Рост прибыли на 21%', desc: 'AI прогнозирует дальнейший рост прибыли за счёт оптимизации расходов и увеличения среднего чека.', icon: <Insights sx={{ color: '#388e3c' }} /> },
  { title: 'Снижение расходов', desc: 'AI рекомендует пересмотреть контракты с поставщиками для дальнейшей экономии.', icon: <TrendingDown sx={{ color: '#d32f2f' }} /> },
  { title: 'Потенциал роста', desc: 'Внедрение новых услуг может увеличить доходы на 15% в следующем квартале.', icon: <ShowChart sx={{ color: '#1976d2' }} /> },
];

const FinancialAnalyticsPage: React.FC = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>
        💰 AI Финансовая аналитика
      </Typography>
      <Typography variant="subtitle1" sx={{ color: '#666', mb: 4 }}>
        Ключевые финансовые метрики, динамика доходов и AI-инсайты для управления финансами вашего бизнеса.
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
          <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>📈 Динамика доходов</Typography>
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

export default FinancialAnalyticsPage;
