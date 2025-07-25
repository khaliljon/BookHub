import React from 'react';
import { Box, Grid } from '@mui/material';
import StatsChart from '../components/StatsChart';

const mockTrends = [
  { month: 'Янв', users: 120, bookings: 210, revenue: 180000 },
  { month: 'Фев', users: 135, bookings: 230, revenue: 210000 },
  { month: 'Мар', users: 150, bookings: 250, revenue: 250000 },
  { month: 'Апр', users: 160, bookings: 270, revenue: 300000 },
  { month: 'Май', users: 170, bookings: 300, revenue: 350000 },
  { month: 'Июн', users: 180, bookings: 320, revenue: 400000 },
  { month: 'Июл', users: 200, bookings: 340, revenue: 450000 },
];

const mockPie = [
  { name: 'CyberArena', value: 45 },
  { name: 'GameZone', value: 30 },
  { name: 'ProGaming', value: 15 },
  { name: 'EsportsHub', value: 10 },
];

const ChartsBlock: React.FC = () => (
  <Box sx={{ my: 4 }}>
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <StatsChart
          title="Динамика пользователей по месяцам"
          data={mockTrends}
          type="line"
          dataKey="month"
          valueKey="users"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <StatsChart
          title="Динамика бронирований по месяцам"
          data={mockTrends}
          type="bar"
          dataKey="month"
          valueKey="bookings"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <StatsChart
          title="Доля клубов по бронированиям"
          data={mockPie}
          type="pie"
          dataKey="name"
          valueKey="value"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <StatsChart
          title="Динамика выручки по месяцам"
          data={mockTrends}
          type="line"
          dataKey="month"
          valueKey="revenue"
        />
      </Grid>
    </Grid>
  </Box>
);

export default ChartsBlock;
