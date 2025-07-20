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
import { Payment, PaymentStatus } from '../../types';
import { apiService } from '../../services/api';

const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPayments();
      const paymentsData = Array.isArray(response) ? response : []; // getPayments возвращает массив
      setPayments(paymentsData);
      setError(null);
    } catch (err) {
      setError('Ошибка загрузки платежей');
      console.error('Error loading payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: PaymentStatus): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (status) {
      case PaymentStatus.PENDING: return 'warning';
      case PaymentStatus.COMPLETED: return 'success';
      case PaymentStatus.FAILED: return 'error';
      case PaymentStatus.REFUNDED: return 'info';
      default: return 'default';
    }
  };

  const getStatusText = (status: PaymentStatus): string => {
    switch (status) {
      case PaymentStatus.PENDING: return 'Ожидает';
      case PaymentStatus.COMPLETED: return 'Завершен';
      case PaymentStatus.FAILED: return 'Неудача';
      case PaymentStatus.REFUNDED: return 'Возврат';
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
        <Typography variant="h4">Платежи</Typography>
        <IconButton onClick={loadPayments}>
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
              <TableCell>Бронирование</TableCell>
              <TableCell>Пользователь</TableCell>
              <TableCell>Сумма</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Дата создания</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.id}</TableCell>
                <TableCell>#{payment.bookingId}</TableCell>
                <TableCell>{payment.booking?.user?.fullName || 'Не указан'}</TableCell>
                <TableCell>{payment.amount} ₽</TableCell>
                <TableCell>
                  <Chip
                    label={getStatusText(payment.status)}
                    color={getStatusColor(payment.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(payment.createdAt).toLocaleString('ru-RU')}
                </TableCell>
                <TableCell>
                  <IconButton size="small">
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {payments.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Платежи не найдены
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PaymentsPage;
