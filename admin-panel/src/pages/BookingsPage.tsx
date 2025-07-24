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
import apiService from '../services/api';
import { Booking, BookingStatus } from '../types';

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterClub, setFilterClub] = useState('all');

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const data = await apiService.getBookings(1, 100);
        setBookings(data.items || data); // поддержка пагинации и простого массива
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case BookingStatus.CONFIRMED: return 'success';
      case BookingStatus.PENDING: return 'warning';
      case BookingStatus.CANCELLED: return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case BookingStatus.CONFIRMED: return <CheckIcon />;
      case BookingStatus.PENDING: return <PendingIcon />;
      case BookingStatus.CANCELLED: return <CancelIcon />;
      default: return <ScheduleIcon />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case BookingStatus.CONFIRMED: return 'Подтверждено';
      case BookingStatus.PENDING: return 'Ожидает';
      case BookingStatus.CANCELLED: return 'Отменено';
      default: return status;
    }
  };

  // Статистика
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === BookingStatus.CONFIRMED).length;
  const pendingBookings = bookings.filter(b => b.status === BookingStatus.PENDING).length;
  const totalRevenue = bookings
    .filter(b => b.payments?.some(p => p.status === 'Completed'))
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  // 1. Собираем уникальные статусы и клубы из данных
  const uniqueStatuses = Array.from(new Set(bookings.map(b => b.status))).filter(Boolean);
  const uniqueClubs = Array.from(new Set(bookings.map(b => b.seat?.hall?.club?.name))).filter(Boolean);

  // 2. Фильтрация по статусу и клубу
  const filteredBookings = bookings.filter(booking => {
    const statusMatch = filterStatus === 'all' || booking.status === filterStatus;
    const clubMatch = filterClub === 'all' || booking.seat?.hall?.club?.name === filterClub;
    return statusMatch && clubMatch;
  });

  // 3. Корректное отображение времени
  const formatDateTime = (dateStr: string, timeStr: string) => {
    if (!dateStr || !timeStr) return '';
    const dt = new Date(`${dateStr}T${timeStr}`);
    if (isNaN(dt.getTime())) return '';
    return dt.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  const formatTime = (dateStr: string, timeStr: string) => {
    if (!dateStr || !timeStr) return '';
    const dt = new Date(`${dateStr}T${timeStr}`);
    if (isNaN(dt.getTime())) return '';
    return dt.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <Box p={3}><Typography>Загрузка...</Typography></Box>;
  }

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
                  onChange={e => setFilterStatus(e.target.value)}
                  sx={{ minWidth: 150 }}
                >
                  <MenuItem value="all">Все статусы</MenuItem>
                  {uniqueStatuses.map(status => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  size="small"
                  label="Клуб"
                  value={filterClub}
                  onChange={e => setFilterClub(e.target.value)}
                  sx={{ minWidth: 200 }}
                >
                  <MenuItem value="all">Все клубы</MenuItem>
                  {uniqueClubs.map(club => (
                    <MenuItem key={club} value={club}>{club}</MenuItem>
                  ))}
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
                            <Avatar sx={{ width: 40, height: 40 }}>
                              {booking.user?.fullName ? booking.user.fullName[0] : '?'}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {booking.user?.fullName || ''}
                              </Typography>
                              {/* booking.gameType удалён, такого поля нет */}
                            </Box>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {booking.seat?.hall?.club?.name || ''}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {booking.seat?.hall?.name || ''}
                            </Typography>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {formatDateTime(booking.createdAt, booking.startTime)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatTime(booking.createdAt, booking.startTime)} - {formatTime(booking.createdAt, booking.endTime)}
                            </Typography>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Chip 
                            label={`Место ${booking.seat?.seatNumber || booking.seat?.id || ''}`}
                            variant="outlined"
                            size="small"
                            icon={<Computer />}
                          />
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                            ₸{(booking.totalAmount || 0).toLocaleString()}
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
                              <IconButton size="small" sx={{ color: '#1976d2' }} onClick={() => alert(`Просмотр бронирования #${booking.id}`)}>
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Редактировать">
                              <IconButton size="small" sx={{ color: '#ed6c02' }} onClick={() => alert(`Редактировать бронирование #${booking.id}`)}>
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Удалить">
                              <IconButton size="small" sx={{ color: '#d32f2f' }} onClick={() => alert(`Удалить бронирование #${booking.id}`)}>
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
                        <Avatar sx={{ width: 36, height: 36 }}>
                          {booking.user?.fullName ? booking.user.fullName[0] : '?'}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {booking.user?.fullName || ''}
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
                              {booking.seat?.hall?.club?.name || ''} • ₸{(booking.totalAmount || 0).toLocaleString()}
                            </Typography>
                            <br />
                            <Typography variant="caption" color="text.secondary">
                              {formatTime(booking.createdAt, booking.startTime)}
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
