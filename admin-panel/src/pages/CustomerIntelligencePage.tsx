import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { EmojiEvents, TrendingUp, Warning, AutoFixHigh } from '@mui/icons-material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const segments = [
  { name: 'VIP-геймеры', value: 89, color: '#ffd700' },
  { name: 'Активные', value: 342, color: '#4caf50' },
  { name: 'Случайные', value: 534, color: '#ff9800' },
  { name: 'Группа риска', value: 147, color: '#f44336' },
  { name: 'Новички', value: 127, color: '#9c27b0' },
];

const recommendations = [
  { icon: <TrendingUp sx={{ color: '#4caf50' }} />, title: 'Удержание VIP', desc: 'Запустить VIP-программу с эксклюзивными турнирами и бонусами.' },
  { icon: <Warning sx={{ color: '#f44336' }} />, title: 'Снижение оттока', desc: 'Персональные скидки и звонки менеджера для группы риска.' },
  { icon: <AutoFixHigh sx={{ color: '#1976d2' }} />, title: 'Рост лояльности', desc: 'Внедрить реферальную систему и бонусы для новичков.' },
];

const CustomerIntelligencePage: React.FC = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>
        👥 AI Клиентская аналитика
      </Typography>
      <Typography variant="subtitle1" sx={{ color: '#666', mb: 4 }}>
        Сегментация клиентов, прогноз оттока и рекомендации по удержанию.
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>Сегменты клиентов</Typography>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={segments} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {segments.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>AI Рекомендации</Typography>
              <List>
                {recommendations.map((rec, i) => (
                  <React.Fragment key={i}>
                    <ListItem alignItems="flex-start">
                      <ListItemIcon>{rec.icon}</ListItemIcon>
                      <ListItemText
                        primary={<Typography sx={{ fontWeight: 'bold' }}>{rec.title}</Typography>}
                        secondary={rec.desc}
                      />
                    </ListItem>
                    {i < recommendations.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Card sx={{ borderRadius: 3, maxWidth: 700, mx: 'auto' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>🏆 Топ клиенты</Typography>
          <List>
            <ListItem>
              <ListItemIcon><EmojiEvents sx={{ color: '#ffd700' }} /></ListItemIcon>
              <ListItemText primary="Алексей Смирнов" secondary="VIP-геймер, 47 визитов, потрачено ₸28,500" />
            </ListItem>
            <ListItem>
              <ListItemIcon><EmojiEvents sx={{ color: '#4caf50' }} /></ListItemIcon>
              <ListItemText primary="Мария Иванова" secondary="Активный, 32 визита, потрачено ₸19,800" />
            </ListItem>
            <ListItem>
              <ListItemIcon><EmojiEvents sx={{ color: '#ff9800' }} /></ListItemIcon>
              <ListItemText primary="Дмитрий Петров" secondary="Случайный, 28 визитов, потрачено ₸15,600" />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CustomerIntelligencePage;
