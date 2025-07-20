import React from 'react';
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
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People as PeopleIcon,
  Store as StoreIcon,
  EventNote as BookingIcon,
  AttachMoney as MoneyIcon,
  Notifications as NotificationIcon,
  AccessTime,
  CheckCircle,
  Warning,
  Error,
  Computer,
  LocationOn,
  CalendarToday,
  Schedule,
} from '@mui/icons-material';

const OverviewPage: React.FC = () => {
  // Моковые данные для обзора
  const stats = {
    totalUsers: 156,
    userGrowth: 12.5,
    totalClubs: 8,
    clubGrowth: 2.1,
    totalBookings: 324,
    bookingGrowth: 18.3,
    totalRevenue: 2840000,
    revenueGrowth: 15.7,
    onlineUsers: 23,
    pendingBookings: 12,
    activeClubs: 7,
    systemAlerts: 3,
  };

  const recentBookings = [
    {
      id: 'BOOK-001',
      userName: 'Асылбек Нурланов',
      userAvatar: 'https://i.pravatar.cc/150?img=1',
      clubName: 'CyberArena Almaty',
      startTime: new Date(2024, 11, 26, 18, 0),
      duration: 2,
      amount: 2400,
      status: 'confirmed',
    },
    {
      id: 'BOOK-002',
      userName: 'Алия Сарсенова',
      userAvatar: 'https://i.pravatar.cc/150?img=2',
      clubName: 'CyberArena Almaty',
      startTime: new Date(2024, 11, 26, 20, 0),
      duration: 2.5,
      amount: 4500,
      status: 'confirmed',
    },
    {
      id: 'BOOK-003',
      userName: 'Даурен Муратов',
      userAvatar: 'https://i.pravatar.cc/150?img=3',
      clubName: 'GameZone Astana',
      startTime: new Date(2024, 11, 27, 15, 30),
      duration: 3,
      amount: 5400,
      status: 'pending',
    },
    {
      id: 'BOOK-004',
      userName: 'Жанна Касымова',
      userAvatar: 'https://i.pravatar.cc/150?img=4',
      clubName: 'ProGaming Shymkent',
      startTime: new Date(2024, 11, 27, 19, 0),
      duration: 2,
      amount: 3600,
      status: 'confirmed',
    },
  ];

  const clubStats = [
    { name: 'CyberArena Almaty', bookings: 125, revenue: 980000, utilization: 78, status: 'online' },
    { name: 'GameZone Astana', bookings: 98, revenue: 750000, utilization: 65, status: 'online' },
    { name: 'ProGaming Shymkent', bookings: 76, revenue: 580000, utilization: 58, status: 'online' },
    { name: 'EsportsHub Almaty', bookings: 45, revenue: 320000, utilization: 42, status: 'maintenance' },
  ];

  const systemAlerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Низкая загрузка клуба',
      message: 'EsportsHub Almaty показывает загрузку менее 50%',
      time: new Date(2024, 11, 26, 14, 30),
    },
    {
      id: 2,
      type: 'error',
      title: 'Проблема с платежами',
      message: 'Обнаружены неудачные транзакции в Kaspi Pay',
      time: new Date(2024, 11, 26, 12, 15),
    },
    {
      id: 3,
      type: 'info',
      title: 'Обновление системы',
      message: 'Запланировано техническое обслуживание на 28.12.2024',
      time: new Date(2024, 11, 25, 16, 45),
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Подтверждено';
      case 'pending': return 'Ожидает';
      case 'cancelled': return 'Отменено';
      default: return status;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <Warning sx={{ color: '#ed6c02' }} />;
      case 'error': return <Error sx={{ color: '#d32f2f' }} />;
      case 'info': return <NotificationIcon sx={{ color: '#1976d2' }} />;
      default: return <NotificationIcon />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Заголовок */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
          📊 Обзор системы
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#666' }}>
          Основные показатели и активность
        </Typography>
      </Box>

      {/* Основные метрики */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            backgroundColor: '#1976d2',
            color: 'white',
            borderRadius: 2,
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.totalUsers}
                  </Typography>
                  <Typography variant="body2">
                    Пользователей
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption">+{stats.userGrowth}%</Typography>
                  </Box>
                </Box>
                <PeopleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            backgroundColor: '#2e7d32',
            color: 'white',
            borderRadius: 2,
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.totalClubs}
                  </Typography>
                  <Typography variant="body2">
                    Игровых клубов
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption">+{stats.clubGrowth}%</Typography>
                  </Box>
                </Box>
                <StoreIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            backgroundColor: '#ed6c02',
            color: 'white',
            borderRadius: 2,
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.totalBookings}
                  </Typography>
                  <Typography variant="body2">
                    Бронирований
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption">+{stats.bookingGrowth}%</Typography>
                  </Box>
                </Box>
                <BookingIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            backgroundColor: '#9c27b0',
            color: 'white',
            borderRadius: 2,
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    ₸{(stats.totalRevenue / 1000000).toFixed(1)}M
                  </Typography>
                  <Typography variant="body2">
                    Выручка
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption">+{stats.revenueGrowth}%</Typography>
                  </Box>
                </Box>
                <MoneyIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Быстрые показатели */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <AccessTime sx={{ color: '#1976d2', mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                {stats.onlineUsers}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Онлайн сейчас
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <Schedule sx={{ color: '#ed6c02', mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ed6c02' }}>
                {stats.pendingBookings}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Ожидающих подтверждения
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <CheckCircle sx={{ color: '#2e7d32', mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                {stats.activeClubs}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Активных клубов
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <Warning sx={{ color: '#d32f2f', mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                {stats.systemAlerts}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Системных уведомлений
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Последние бронирования */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                📅 Последние бронирования
              </Typography>

              <List sx={{ p: 0 }}>
                {recentBookings.map((booking, index) => (
                  <React.Fragment key={booking.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar 
                          src={booking.userAvatar}
                          sx={{ width: 40, height: 40 }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {booking.userName}
                            </Typography>
                            <Chip
                              label={getStatusText(booking.status)}
                              color={getStatusColor(booking.status)}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <LocationOn sx={{ fontSize: 14 }} />
                              <Typography variant="caption">
                                {booking.clubName}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AccessTime sx={{ fontSize: 14 }} />
                                <Typography variant="caption">
                                  {formatTime(booking.startTime)} • {booking.duration}ч
                                </Typography>
                              </Box>
                              <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                                ₸{booking.amount.toLocaleString()}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentBookings.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button variant="outlined" size="small">
                  Посмотреть все бронирования
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Статистика клубов */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: 2, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                🏪 Статистика клубов
              </Typography>

              <List sx={{ p: 0 }}>
                {clubStats.map((club, index) => (
                  <React.Fragment key={club.name}>
                    <ListItem sx={{ px: 0, py: 2 }}>
                      <ListItemAvatar>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            backgroundColor: club.status === 'online' ? '#2e7d32' : '#ed6c02',
                            color: 'white',
                          }}
                        >
                          <Computer />
                        </Box>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {club.name}
                            </Typography>
                            <Chip
                              label={club.status === 'online' ? 'Онлайн' : 'Обслуживание'}
                              color={club.status === 'online' ? 'success' : 'warning'}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="caption">
                                Бронирований: {club.bookings}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#2e7d32' }}>
                                ₸{(club.revenue / 1000).toFixed(0)}K
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="caption">
                                Загрузка: {club.utilization}%
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={club.utilization}
                                sx={{ 
                                  flexGrow: 1, 
                                  height: 6, 
                                  borderRadius: 3,
                                  backgroundColor: '#f0f0f0',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: club.utilization > 70 ? '#2e7d32' : club.utilization > 50 ? '#ed6c02' : '#d32f2f',
                                  }
                                }}
                              />
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < clubStats.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Системные уведомления */}
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                🔔 Системные уведомления
              </Typography>

              <List sx={{ p: 0 }}>
                {systemAlerts.map((alert, index) => (
                  <React.Fragment key={alert.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar sx={{ minWidth: 36 }}>
                        {getAlertIcon(alert.type)}
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {alert.title}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                              {alert.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatDateTime(alert.time)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < systemAlerts.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button variant="outlined" size="small">
                  Все уведомления
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OverviewPage;
