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
  Switch,
  FormControlLabel,
  Badge,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  NotificationsActive as PushIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Visibility,
  VisibilityOff,
  FilterList,
  Person,
  Group,
  Public,
  AccessTime,
  CalendarToday,
  TrendingUp,
} from '@mui/icons-material';

const NotificationsPage: React.FC = () => {
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Моковые данные уведомлений
  const notifications = [
    {
      id: 1,
      title: 'Добро пожаловать в систему!',
      message: 'Спасибо за регистрацию в нашей платформе бронирования игровых клубов.',
      type: 'email',
      status: 'sent',
      recipients: 156,
      openRate: 78,
      createdAt: new Date(2024, 11, 26, 14, 30),
      sentAt: new Date(2024, 11, 26, 14, 35),
      targetAudience: 'new_users',
      template: 'welcome',
    },
    {
      id: 2,
      title: 'Бронирование подтверждено',
      message: 'Ваше бронирование на CyberArena Almaty подтверждено на 26.12.2024 в 18:00',
      type: 'sms',
      status: 'sent',
      recipients: 23,
      openRate: 95,
      createdAt: new Date(2024, 11, 26, 12, 15),
      sentAt: new Date(2024, 11, 26, 12, 16),
      targetAudience: 'booking_confirmed',
      template: 'booking_confirmation',
    },
    {
      id: 3,
      title: 'Специальное предложение на выходные',
      message: 'Скидка 20% на все бронирования в выходные дни! Не упустите возможность.',
      type: 'push',
      status: 'scheduled',
      recipients: 234,
      openRate: 0,
      createdAt: new Date(2024, 11, 26, 10, 0),
      sentAt: new Date(2024, 11, 27, 9, 0),
      targetAudience: 'active_users',
      template: 'promotion',
    },
    {
      id: 4,
      title: 'Напоминание о бронировании',
      message: 'Напоминаем, что ваше бронирование начинается через 1 час.',
      type: 'push',
      status: 'sent',
      recipients: 45,
      openRate: 88,
      createdAt: new Date(2024, 11, 25, 17, 0),
      sentAt: new Date(2024, 11, 25, 17, 0),
      targetAudience: 'booking_reminder',
      template: 'reminder',
    },
    {
      id: 5,
      title: 'Техническое обслуживание',
      message: 'Запланировано техническое обслуживание системы 28.12.2024 с 02:00 до 04:00',
      type: 'email',
      status: 'draft',
      recipients: 0,
      openRate: 0,
      createdAt: new Date(2024, 11, 26, 16, 0),
      sentAt: null,
      targetAudience: 'all_users',
      template: 'maintenance',
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email': return 'primary';
      case 'sms': return 'success';
      case 'push': return 'warning';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'success';
      case 'scheduled': return 'warning';
      case 'draft': return 'default';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <EmailIcon />;
      case 'sms': return <SmsIcon />;
      case 'push': return <PushIcon />;
      default: return <NotificationsIcon />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckIcon />;
      case 'scheduled': return <ScheduleIcon />;
      case 'draft': return <EditIcon />;
      case 'failed': return <CancelIcon />;
      default: return <PendingIcon />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent': return 'Отправлено';
      case 'scheduled': return 'Запланировано';
      case 'draft': return 'Черновик';
      case 'failed': return 'Ошибка';
      default: return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'email': return 'Email';
      case 'sms': return 'SMS';
      case 'push': return 'Push';
      default: return type;
    }
  };

  const getAudienceText = (audience: string) => {
    switch (audience) {
      case 'all_users': return 'Все пользователи';
      case 'new_users': return 'Новые пользователи';
      case 'active_users': return 'Активные пользователи';
      case 'booking_confirmed': return 'Подтвержденные бронирования';
      case 'booking_reminder': return 'Напоминания о бронировании';
      default: return audience;
    }
  };

  // Статистика
  const totalNotifications = notifications.length;
  const sentNotifications = notifications.filter(n => n.status === 'sent').length;
  const scheduledNotifications = notifications.filter(n => n.status === 'scheduled').length;
  const draftNotifications = notifications.filter(n => n.status === 'draft').length;

  const totalRecipients = notifications
    .filter(n => n.status === 'sent')
    .reduce((sum, n) => sum + n.recipients, 0);

  const averageOpenRate = notifications
    .filter(n => n.status === 'sent' && n.openRate > 0)
    .reduce((sum, n, _, arr) => sum + n.openRate / arr.length, 0);

  // Фильтрация
  const filteredNotifications = notifications.filter(notification => {
    const typeMatch = filterType === 'all' || notification.type === filterType;
    const statusMatch = filterStatus === 'all' || notification.status === filterStatus;
    return typeMatch && statusMatch;
  });

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Заголовок */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
          📢 Управление уведомлениями
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#666' }}>
          Создание и отправка уведомлений пользователям
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
                    {totalNotifications}
                  </Typography>
                  <Typography variant="body2">
                    Всего уведомлений
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption">+5 за неделю</Typography>
                  </Box>
                </Box>
                <NotificationsIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {sentNotifications}
                  </Typography>
                  <Typography variant="body2">
                    Отправлено
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="caption">
                      {totalRecipients} получателей
                    </Typography>
                  </Box>
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
                    {scheduledNotifications}
                  </Typography>
                  <Typography variant="body2">
                    Запланировано
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption">Ожидают отправки</Typography>
                  </Box>
                </Box>
                <ScheduleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {averageOpenRate.toFixed(0)}%
                  </Typography>
                  <Typography variant="body2">
                    Средний открытий
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="caption">
                      Черновиков: {draftNotifications}
                    </Typography>
                  </Box>
                </Box>
                <Visibility sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Основная таблица */}
        <Grid item xs={12} lg={8}>
          {/* Фильтры и действия */}
          <Card sx={{ borderRadius: 2, mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mr: 2 }}>
                  🔍 Фильтры и действия
                </Typography>
                
                <TextField
                  select
                  size="small"
                  label="Тип"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="all">Все типы</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="sms">SMS</MenuItem>
                  <MenuItem value="push">Push</MenuItem>
                </TextField>

                <TextField
                  select
                  size="small"
                  label="Статус"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  sx={{ minWidth: 150 }}
                >
                  <MenuItem value="all">Все статусы</MenuItem>
                  <MenuItem value="sent">Отправлено</MenuItem>
                  <MenuItem value="scheduled">Запланировано</MenuItem>
                  <MenuItem value="draft">Черновик</MenuItem>
                  <MenuItem value="failed">Ошибка</MenuItem>
                </TextField>

                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={() => {
                    setFilterType('all');
                    setFilterStatus('all');
                  }}
                >
                  Сбросить
                </Button>

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{ ml: 'auto' }}
                >
                  Создать уведомление
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Таблица уведомлений */}
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                📢 Список уведомлений ({filteredNotifications.length})
              </Typography>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Уведомление</TableCell>
                      <TableCell>Тип</TableCell>
                      <TableCell>Статус</TableCell>
                      <TableCell>Получатели</TableCell>
                      <TableCell>Открытий</TableCell>
                      <TableCell>Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredNotifications.map((notification) => (
                      <TableRow 
                        key={notification.id}
                        sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}
                      >
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {notification.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                              {notification.message.length > 60 
                                ? `${notification.message.substring(0, 60)}...` 
                                : notification.message}
                            </Typography>
                            <Typography variant="caption" color="primary">
                              {getAudienceText(notification.targetAudience)}
                            </Typography>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Chip
                            icon={getTypeIcon(notification.type)}
                            label={getTypeText(notification.type)}
                            color={getTypeColor(notification.type)}
                            size="small"
                          />
                        </TableCell>
                        
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(notification.status)}
                            label={getStatusText(notification.status)}
                            color={getStatusColor(notification.status)}
                            size="small"
                          />
                        </TableCell>
                        
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {notification.recipients === 0 ? '-' : notification.recipients.toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {notification.sentAt ? formatDateTime(notification.sentAt) : 'Не отправлено'}
                            </Typography>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ 
                              fontWeight: 'bold',
                              color: notification.openRate > 80 ? '#2e7d32' : notification.openRate > 50 ? '#ed6c02' : '#d32f2f'
                            }}>
                              {notification.openRate === 0 ? '-' : `${notification.openRate}%`}
                            </Typography>
                            {notification.openRate > 0 && (
                              <Typography variant="caption" color="text.secondary">
                                {Math.round(notification.recipients * notification.openRate / 100)} открытий
                              </Typography>
                            )}
                          </Box>
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
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {notification.status === 'draft' && (
                              <Tooltip title="Отправить">
                                <IconButton size="small" sx={{ color: '#2e7d32' }}>
                                  <SendIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="Удалить">
                              <IconButton size="small" sx={{ color: '#d32f2f' }}>
                                <DeleteIcon fontSize="small" />
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

        {/* Правая панель */}
        <Grid item xs={12} lg={4}>
          {/* Типы уведомлений */}
          <Card sx={{ borderRadius: 2, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                📨 Типы уведомлений
              </Typography>

              <List sx={{ p: 0 }}>
                {[
                  { type: 'email', name: 'Email уведомления', count: notifications.filter(n => n.type === 'email').length, color: '#1976d2' },
                  { type: 'sms', name: 'SMS сообщения', count: notifications.filter(n => n.type === 'sms').length, color: '#2e7d32' },
                  { type: 'push', name: 'Push уведомления', count: notifications.filter(n => n.type === 'push').length, color: '#ed6c02' },
                ].map((type, index) => (
                  <React.Fragment key={type.type}>
                    <ListItem sx={{ px: 0, py: 2 }}>
                      <ListItemAvatar sx={{ minWidth: 36 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            backgroundColor: type.color,
                            color: 'white',
                          }}
                        >
                          {getTypeIcon(type.type)}
                        </Box>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {type.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: type.color }}>
                              {type.count}
                            </Typography>
                          </Box>
                        }
                        secondary={`${((type.count / totalNotifications) * 100).toFixed(0)}% от общего числа`}
                      />
                    </ListItem>
                    {index < 2 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Быстрые действия */}
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                ⚡ Быстрые действия
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<AddIcon />}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Создать Email кампанию
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<SmsIcon />}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Массовая SMS рассылка
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<PushIcon />}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Push уведомление
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<ScheduleIcon />}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Запланировать рассылку
                  </Button>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>
                ⚙️ Настройки
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel
                  control={<Switch defaultChecked size="small" />}
                  label={<Typography variant="caption">Автоматические напоминания</Typography>}
                />
                <FormControlLabel
                  control={<Switch defaultChecked size="small" />}
                  label={<Typography variant="caption">Email подтверждения</Typography>}
                />
                <FormControlLabel
                  control={<Switch size="small" />}
                  label={<Typography variant="caption">SMS уведомления</Typography>}
                />
                <FormControlLabel
                  control={<Switch defaultChecked size="small" />}
                  label={<Typography variant="caption">Push уведомления</Typography>}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NotificationsPage;
