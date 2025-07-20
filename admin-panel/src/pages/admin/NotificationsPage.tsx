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
  Button,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Send as SendIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Notification, NotificationType } from '../../types';
import { apiService } from '../../services/api';

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await apiService.getNotifications();
      const notificationsData = Array.isArray(response) ? response : response.items || [];
      setNotifications(notificationsData);
      setError(null);
    } catch (err) {
      setError('Ошибка загрузки уведомлений');
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: NotificationType): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (type) {
      case NotificationType.INFO: return 'info';
      case NotificationType.WARNING: return 'warning';
      case NotificationType.ERROR: return 'error';
      case NotificationType.SUCCESS: return 'success';
      default: return 'default';
    }
  };

  const getTypeText = (type: NotificationType): string => {
    switch (type) {
      case NotificationType.INFO: return 'Информация';
      case NotificationType.WARNING: return 'Предупреждение';
      case NotificationType.ERROR: return 'Ошибка';
      case NotificationType.SUCCESS: return 'Успех';
      default: return type;
    }
  };

  const handleDeleteNotification = async (notificationId: number) => {
    if (window.confirm('Вы уверены, что хотите удалить это уведомление?')) {
      try {
        await apiService.deleteNotification(notificationId);
        await loadNotifications();
      } catch (err) {
        setError('Ошибка удаления уведомления');
        console.error('Error deleting notification:', err);
      }
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
        <Typography variant="h4">Уведомления</Typography>
        <Box>
          <IconButton onClick={loadNotifications} sx={{ mr: 1 }}>
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={() => {/* TODO: Открыть диалог создания уведомления */}}
          >
            Создать уведомление
          </Button>
        </Box>
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
              <TableCell>Получатель</TableCell>
              <TableCell>Заголовок</TableCell>
              <TableCell>Сообщение</TableCell>
              <TableCell>Тип</TableCell>
              <TableCell>Прочитано</TableCell>
              <TableCell>Дата создания</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notifications.map((notification) => (
              <TableRow key={notification.id}>
                <TableCell>{notification.id}</TableCell>
                <TableCell>{notification.user?.fullName || 'Все пользователи'}</TableCell>
                <TableCell>{notification.title}</TableCell>
                <TableCell>
                  <Box sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {notification.message}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getTypeText(notification.type)}
                    color={getTypeColor(notification.type)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={notification.isRead ? 'Да' : 'Нет'}
                    color={notification.isRead ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(notification.createdAt).toLocaleString('ru-RU')}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteNotification(notification.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {notifications.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Уведомления не найдены
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default NotificationsPage;
