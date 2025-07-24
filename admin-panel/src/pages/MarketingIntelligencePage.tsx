import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { TrendingUp, TrendingDown, Insights, AutoFixHigh, Campaign } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const channels = [
  { name: 'Instagram', roi: 420, conversions: 234, color: '#E4405F' },
  { name: 'Facebook', roi: 350, conversions: 189, color: '#1877F2' },
  { name: 'TikTok', roi: 290, conversions: 156, color: '#000000' },
  { name: 'Google Ads', roi: 380, conversions: 345, color: '#4285F4' },
  { name: 'Telegram', roi: 240, conversions: 89, color: '#0088CC' },
];

const aiInsights = [
  { icon: <TrendingUp sx={{ color: '#4caf50' }} />, title: 'Увеличить бюджет TikTok', desc: 'TikTok показывает лучший ROI (290%) и рост (+67.8%). Рекомендуется увеличить бюджет на 40%.' },
  { icon: <AutoFixHigh sx={{ color: '#1976d2' }} />, title: 'Оптимизация времени публикаций', desc: 'AI выявил оптимальное время: Instagram 18:00-20:00, Facebook 19:00-21:00.' },
  { icon: <Insights sx={{ color: '#ff9800' }} />, title: 'Снижение CTR Facebook', desc: 'CTR Facebook снизился на 12%. Нужно обновить креативы.' },
];

const MarketingIntelligencePage: React.FC = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>
        📈 AI Маркетинговая аналитика
      </Typography>
      <Typography variant="subtitle1" sx={{ color: '#666', mb: 4 }}>
        Анализ каналов, ROI, конверсий и AI-рекомендации для маркетинга.
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {channels.map((c, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Card sx={{ borderRadius: 3, background: `${c.color}10` }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Campaign sx={{ color: c.color }} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: c.color }}>{c.roi}%</Typography>
                    <Typography variant="body2">{c.name}</Typography>
                  </Box>
                </Box>
                <Chip label={`Конверсий: ${c.conversions}`} color="success" size="small" sx={{ mt: 2 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Card sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>📊 ROI по каналам</Typography>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={channels} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="roi" fill="#1976d2" name="ROI" />
              <Bar dataKey="conversions" fill="#4caf50" name="Конверсии" />
            </BarChart>
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

export default MarketingIntelligencePage;
