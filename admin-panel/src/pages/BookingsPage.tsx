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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  TextField,
  MenuItem,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@mui/material';
import {
  Event as EventIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  CalendarToday as CalendarIcon,
  TrendingUp,
  AccessTime,
  Computer,
  AttachMoney,
  FilterList,
  Refresh,
  Visibility,
  Edit,
  Delete,
} from '@mui/icons-material';

const BookingsPage: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterClub, setFilterClub] = useState('all');

  // Моковые данные бронирований
  const bookings = [
    {
      id: 1,
      userId: 1,
      userName: 'Асылбек Нурланов',
      userAvatar: 'https://i.pravatar.cc/150?img=1',
      clubId: 1,
      clubName: 'CyberArena Almaty',
      hallId: 1,
      hallName: 'Основной зал',
      seatNumber: 15,
      startTime: new Date(2024, 11, 25, 14, 0),
      endTime: new Date(2024, 11, 25, 16, 0),
      totalCost: 2400,
      status: 'confirmed',
      paymentStatus: 'paid',
      createdAt: new Date(2024, 11, 20, 10, 30),
      gameType: 'CS:GO',
    },
    {
      id: 2,
      userId: 2,
      userName: 'Алия Сарсенова',
      userAvatar: 'https://i.pravatar.cc/150?img=2',
      clubId: 1,
      clubName: 'CyberArena Almaty',
      hallId: 2,
      hallName: 'VIP зал',
      seatNumber: 8,
      startTime: new Date(2024, 11, 25, 18, 0),
      endTime: new Date(2024, 11, 25, 20, 30),
      totalCost: 4500,
      status: 'confirmed',
      paymentStatus: 'paid',
      createdAt: new Date(2024, 11, 22, 15, 45),
      gameType: 'Dota 2',
    },
    {
      id: 3,
      userId: 3,
      userName: 'Даурен Муратов',
      userAvatar: 'https://i.pravatar.cc/150?img=3',
      clubId: 2,
      clubName: 'GameZone Astana',
      hallId: 3,
      hallName: 'Турнирный зал',
      seatNumber: 22,
      startTime: new Date(2024, 11, 26, 12, 0),
      endTime: new Date(2024, 11, 26, 15, 0),
      totalCost: 5400,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date(2024, 11, 24, 9, 15),
      gameType: 'Valorant',
    },
    {
      id: 4,
      userId: 4,
      userName: 'Жанна Касымова',
      userAvatar: 'https://i.pravatar.cc/150?img=4',
      clubId: 1,
      clubName: 'CyberArena Almaty',
      hallId: 1,
      hallName: 'Основной зал',
      seatNumber: 7,
      startTime: new Date(2024, 11, 26, 20, 0),
      endTime: new Date(2024, 11, 26, 22, 0),
      totalCost: 2400,
      status: 'cancelled',
      paymentStatus: 'refunded',
      createdAt: new Date(2024, 11, 23, 14, 20),
      gameType: 'League of Legends',
    },
    {
      id: 5,
      userId: 5,
      userName: 'Ерлан Абдуллаев',
      userAvatar: 'https://i.pravatar.cc/150?img=5',
      clubId: 3,
      clubName: 'ProGaming Shymkent',
      hallId: 4,
      hallName: 'Киберспорт зал',
      seatNumber: 12,
      startTime: new Date(2024, 11, 27, 16, 30),
      endTime: new Date(2024, 11, 27, 19, 0),
      totalCost: 3600,
      status: 'confirmed',
      paymentStatus: 'paid',
      createdAt: new Date(2024, 11, 24, 11, 0),
      gameType: 'Fortnite',
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckIcon />;
      case 'pending': return <PendingIcon />;
      case 'cancelled': return <CancelIcon />;
      default: return <ScheduleIcon />;
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

  // Статистика
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const totalRevenue = bookings
    .filter(b => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + b.totalCost, 0);

  // Фильтрация
  const filteredBookings = bookings.filter(booking => {
    const statusMatch = filterStatus === 'all' || booking.status === filterStatus;
    const clubMatch = filterClub === 'all' || booking.clubId.toString() === filterClub;
    return statusMatch && clubMatch;
  });

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Заголовок */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
          📅 Управление бронированиями
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#666' }}>
          Отслеживайте и управляйте всеми бронированиями
        </Typography>
      </Box>

      {/* Статистика */}
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
                    {totalBookings}
                  </Typography>
                  <Typography variant="body2">
                    Всего бронирований
                  </Typography>
                </Box>
                <EventIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {confirmedBookings}
                  </Typography>
                  <Typography variant="body2">
                    Подтверждено
                  </Typography>
                </Box>
                <CheckIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {pendingBookings}
                  </Typography>
                  <Typography variant="body2">
                    Ожидает
                  </Typography>
                </Box>
                <PendingIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    ₸{(totalRevenue / 1000).toFixed(0)}K
                  </Typography>
                  <Typography variant="body2">
                    Доход
                  </Typography>
                </Box>
                <AttachMoney sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Основная таблица */}
        <Grid item xs={12} lg={8}>
          {/* Фильтры */}
          <Card sx={{ borderRadius: 2, mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mr: 2 }}>
                  🔍 Фильтры
                </Typography>
                
                <TextField
                  select
                  size="small"
                  label="Статус"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  sx={{ minWidth: 150 }}
                >
                  <MenuItem value="all">Все статусы</MenuItem>
                  <MenuItem value="confirmed">Подтверждено</MenuItem>
                  <MenuItem value="pending">Ожидает</MenuItem>
                  <MenuItem value="cancelled">Отменено</MenuItem>
                </TextField>

                <TextField
                  select
                  size="small"
                  label="Клуб"
                  value={filterClub}
                  onChange={(e) => setFilterClub(e.target.value)}
                  sx={{ minWidth: 200 }}
                >
                  <MenuItem value="all">Все клубы</MenuItem>
                  <MenuItem value="1">CyberArena Almaty</MenuItem>
                  <MenuItem value="2">GameZone Astana</MenuItem>
                  <MenuItem value="3">ProGaming Shymkent</MenuItem>
                </TextField>

                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={() => {
                    setFilterStatus('all');
                    setFilterClub('all');
                  }}
                >
                  Сбросить
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Таблица бронирований */}
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                📋 Список бронирований
              </Typography>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Пользователь</TableCell>
                      <TableCell>Клуб/Зал</TableCell>
                      <TableCell>Время</TableCell>
                      <TableCell>Место</TableCell>
                      <TableCell>Стоимость</TableCell>
                      <TableCell>Статус</TableCell>
                      <TableCell>Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow 
                        key={booking.id}
                        sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar 
                              src={booking.userAvatar} 
                              sx={{ width: 40, height: 40 }}
                            />
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {booking.userName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {booking.gameType}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {booking.clubName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {booking.hallName}
                            </Typography>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {formatDateTime(booking.startTime)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                            </Typography>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Chip 
                            label={`Место ${booking.seatNumber}`}
                            variant="outlined"
                            size="small"
                            icon={<Computer />}
                          />
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                            ₸{booking.totalCost.toLocaleString()}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(booking.status)}
                            label={getStatusText(booking.status)}
                            color={getStatusColor(booking.status)}
                            size="small"
                          />
                        </TableCell>
                        
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Просмотр">
                              <IconButton size="small" sx={{ color: '#1976d2' }}>
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Редактировать">
                              <IconButton size="small" sx={{ color: '#ed6c02' }}>
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Удалить">
                              <IconButton size="small" sx={{ color: '#d32f2f' }}>
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
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

        {/* Боковая панель */}
        <Grid item xs={12} lg={4}>
          {/* Недавние бронирования */}
          <Card sx={{ borderRadius: 2, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                🕒 Недавние бронирования
              </Typography>
              
              <List sx={{ p: 0 }}>
                {bookings.slice(0, 5).map((booking, index) => (
                  <React.Fragment key={booking.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar 
                          src={booking.userAvatar}
                          sx={{ width: 36, height: 36 }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {booking.userName}
                            </Typography>
                            <Chip
                              label={getStatusText(booking.status)}
                              color={getStatusColor(booking.status)}
                              size="small"
                              sx={{ height: 20, fontSize: '10px' }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              {booking.clubName} • ₸{booking.totalCost}
                            </Typography>
                            <br />
                            <Typography variant="caption" color="text.secondary">
                              {formatTime(booking.createdAt)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < 4 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Топ клубы */}
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                🏆 Топ клубы по бронированиям
              </Typography>
              
              <List sx={{ p: 0 }}>
                {[
                  { name: 'CyberArena Almaty', bookings: 3, revenue: 9300 },
                  { name: 'GameZone Astana', bookings: 1, revenue: 5400 },
                  { name: 'ProGaming Shymkent', bookings: 1, revenue: 3600 },
                ].map((club, index) => (
                  <React.Fragment key={club.name}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          backgroundColor: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : '#cd7f32',
                          color: 'white',
                          fontWeight: 'bold',
                          width: 32,
                          height: 32,
                        }}>
                          {index + 1}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={club.name}
                        secondary={`${club.bookings} бронирований • ₸${club.revenue.toLocaleString()}`}
                      />
                    </ListItem>
                    {index < 2 && <Divider />}
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

export default BookingsPage;
