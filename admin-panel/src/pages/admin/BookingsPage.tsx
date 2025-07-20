import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { Booking, BookingStatus } from '../../types';
import { apiService } from '../../services/api';

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await apiService.getBookings();
      const bookingsData = Array.isArray(response) ? response : response.items || [];
      setBookings(bookingsData);
      setError(null);
    } catch (err) {
      setError('Ошибка загрузки бронирований');
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: BookingStatus): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (status) {
      case BookingStatus.PENDING: return 'warning';
      case BookingStatus.CONFIRMED: return 'success';
      case BookingStatus.CANCELLED: return 'error';
      case BookingStatus.COMPLETED: return 'info';
      default: return 'default';
    }
  };

  const getStatusText = (status: BookingStatus): string => {
    switch (status) {
      case BookingStatus.PENDING: return 'Ожидает';
      case BookingStatus.CONFIRMED: return 'Подтверждено';
      case BookingStatus.CANCELLED: return 'Отменено';
      case BookingStatus.COMPLETED: return 'Завершено';
      default: return status;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Бронирования</Typography>
        <IconButton onClick={loadBookings}>
          <RefreshIcon />
        </IconButton>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Пользователь</TableCell>
              <TableCell>Место</TableCell>
              <TableCell>Время начала</TableCell>
              <TableCell>Время окончания</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Сумма</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>
                <TableCell>{booking.user?.fullName || 'Не указан'}</TableCell>
                <TableCell>
                  {booking.seat ? `Место ${booking.seat.seatNumber}` : 'Не указано'}
                </TableCell>
                <TableCell>
                  {new Date(booking.startTime).toLocaleString('ru-RU')}
                </TableCell>
                <TableCell>
                  {new Date(booking.endTime).toLocaleString('ru-RU')}
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusText(booking.status)}
                    color={getStatusColor(booking.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{booking.totalAmount} ₽</TableCell>
                <TableCell>
                  <IconButton size="small">
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {bookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Бронирования не найдены
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BookingsPage;
