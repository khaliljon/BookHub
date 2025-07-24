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
  Badge,
} from '@mui/material';
import {
  People as PeopleIcon,
  PersonAdd as AddPersonIcon,
  Block as BlockIcon,
  CheckCircle as ActiveIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  TrendingUp,
  PersonOff,
  VpnKey,
  Security,
} from '@mui/icons-material';
import apiService from '../services/api';
import { User } from '../types';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await apiService.getUsers();
        setUsers(data);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SuperAdmin': return 'error';
      case 'Admin': return 'warning';
      case 'Manager': return 'info';
      case 'User': return 'default';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'blocked': return 'error';
      case 'inactive': return 'default';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активен';
      case 'blocked': return 'Заблокирован';
      case 'inactive': return 'Неактивен';
      default: return status;
    }
  };

  // Статистика
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const blockedUsers = users.filter(u => u.status === 'blocked').length;
  const onlineUsers = users.filter(u => u.isOnline).length;

  // Фильтрация
  const filteredUsers = users.filter(user => {
    const roleMatch = filterRole === 'all' || user.role === filterRole;
    const statusMatch = filterStatus === 'all' || user.status === filterStatus;
    const searchMatch = searchTerm === '' || 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return roleMatch && statusMatch && searchMatch;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <Box p={3}><Typography>Загрузка...</Typography></Box>;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Заголовок */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
          👥 Управление пользователями
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#666' }}>
          Администрирование аккаунтов и ролей
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
                    {totalUsers}
                  </Typography>
                  <Typography variant="body2">
                    Всего пользователей
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption">+8 за месяц</Typography>
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
                    {activeUsers}
                  </Typography>
                  <Typography variant="body2">
                    Активных
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="caption">
                      {((activeUsers / totalUsers) * 100).toFixed(0)}% от общего числа
                    </Typography>
                  </Box>
                </Box>
                <ActiveIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {onlineUsers}
                  </Typography>
                  <Typography variant="body2">
                    Онлайн сейчас
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="caption">
                      {((onlineUsers / totalUsers) * 100).toFixed(0)}% активности
                    </Typography>
                  </Box>
                </Box>
                <Security sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            backgroundColor: '#d32f2f',
            color: 'white',
            borderRadius: 2,
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {blockedUsers}
                  </Typography>
                  <Typography variant="body2">
                    Заблокировано
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="caption">
                      Требует внимания
                    </Typography>
                  </Box>
                </Box>
                <PersonOff sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Основная таблица */}
        <Grid item xs={12} lg={8}>
          {/* Панель управления */}
          <Card sx={{ borderRadius: 2, mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mr: 2 }}>
                  🔍 Поиск и фильтры
                </Typography>
                
                <TextField
                  size="small"
                  label="Поиск пользователей"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ minWidth: 200 }}
                />
                
                <TextField
                  select
                  size="small"
                  label="Роль"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  sx={{ minWidth: 150 }}
                >
                  <MenuItem value="all">Все роли</MenuItem>
                  <MenuItem value="SuperAdmin">Супер админ</MenuItem>
                  <MenuItem value="Admin">Админ</MenuItem>
                  <MenuItem value="Manager">Менеджер</MenuItem>
                  <MenuItem value="User">Пользователь</MenuItem>
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
                  <MenuItem value="active">Активные</MenuItem>
                  <MenuItem value="blocked">Заблокированные</MenuItem>
                  <MenuItem value="inactive">Неактивные</MenuItem>
                </TextField>

                <Button
                  variant="contained"
                  startIcon={<AddPersonIcon />}
                  sx={{ ml: 'auto' }}
                >
                  Добавить пользователя
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Таблица пользователей */}
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                👥 Список пользователей ({filteredUsers.length})
              </Typography>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Пользователь</TableCell>
                      <TableCell>Контакты</TableCell>
                      <TableCell>Роль</TableCell>
                      <TableCell>Статус</TableCell>
                      <TableCell>Активность</TableCell>
                      <TableCell>Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow 
                        key={user.id}
                        sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Badge
                              overlap="circular"
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                              variant="dot"
                              sx={{
                                '& .MuiBadge-badge': {
                                  backgroundColor: user.isOnline ? '#44b700' : '#9e9e9e',
                                  color: user.isOnline ? '#44b700' : '#9e9e9e',
                                }
                              }}
                            >
                              <Avatar 
                                src={user.avatar} 
                                sx={{ width: 50, height: 50 }}
                              />
                            </Badge>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {user.firstName} {user.lastName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ID: {user.id} • {user.city}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                                {user.isEmailVerified && (
                                  <Chip label="Email ✓" size="small" color="success" sx={{ fontSize: '10px', height: 18 }} />
                                )}
                                {user.isPhoneVerified && (
                                  <Chip label="Тел ✓" size="small" color="info" sx={{ fontSize: '10px', height: 18 }} />
                                )}
                              </Box>
                            </Box>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Email sx={{ fontSize: 14, color: '#666' }} />
                              <Typography variant="caption">
                                {user.email}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Phone sx={{ fontSize: 14, color: '#666' }} />
                              <Typography variant="caption">
                                {user.phone}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Chip
                            icon={<VpnKey />}
                            label={user.role}
                            color={getRoleColor(user.role)}
                            size="small"
                          />
                        </TableCell>
                        
                        <TableCell>
                          <Chip
                            icon={user.status === 'active' ? <ActiveIcon /> : <BlockIcon />}
                            label={getStatusText(user.status)}
                            color={getStatusColor(user.status)}
                            size="small"
                          />
                        </TableCell>
                        
                        <TableCell>
                          <Box>
                            <Typography variant="caption" sx={{ display: 'block' }}>
                              Последний вход:
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatDateTime(user.lastLogin)}
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                              Бронирований: {user.totalBookings}
                            </Typography>
                            <Typography variant="caption" color="primary">
                              Потрачено: ₸{user.totalSpent.toLocaleString()}
                            </Typography>
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
                            <Tooltip title={user.status === 'active' ? 'Заблокировать' : 'Разблокировать'}>
                              <IconButton 
                                size="small" 
                                sx={{ color: user.status === 'active' ? '#d32f2f' : '#2e7d32' }}
                              >
                                {user.status === 'active' ? <BlockIcon fontSize="small" /> : <ActiveIcon fontSize="small" />}
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
          {/* Распределение по ролям */}
          <Card sx={{ borderRadius: 2, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                🎭 Распределение по ролям
              </Typography>

              <List sx={{ p: 0 }}>
                {[
                  { name: 'Супер админ', count: users.filter(u => u.role === 'SuperAdmin').length, color: '#d32f2f' },
                  { name: 'Администратор', count: users.filter(u => u.role === 'Admin').length, color: '#ed6c02' },
                  { name: 'Менеджер', count: users.filter(u => u.role === 'Manager').length, color: '#1976d2' },
                  { name: 'Пользователь', count: users.filter(u => u.role === 'User').length, color: '#2e7d32' },
                ].map((role, index) => (
                  <React.Fragment key={role.name}>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemAvatar sx={{ minWidth: 36 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: role.color,
                          }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={role.name}
                        secondary={`${role.count} пользователей (${((role.count / totalUsers) * 100).toFixed(0)}%)`}
                      />
                    </ListItem>
                    {index < 3 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Недавние регистрации */}
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                📅 Недавние регистрации
              </Typography>
              
              <List sx={{ p: 0 }}>
                {users
                  .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                  .slice(0, 5)
                  .map((user, index) => (
                    <React.Fragment key={user.id}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            variant="dot"
                            sx={{
                              '& .MuiBadge-badge': {
                                backgroundColor: user.isOnline ? '#44b700' : '#9e9e9e',
                                color: user.isOnline ? '#44b700' : '#9e9e9e',
                              }
                            }}
                          >
                            <Avatar 
                              src={user.avatar}
                              sx={{ width: 36, height: 36 }}
                            />
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {user.firstName} {user.lastName}
                              </Typography>
                              <Chip
                                label={user.role}
                                color={getRoleColor(user.role)}
                                size="small"
                                sx={{ fontSize: '10px', height: 20 }}
                              />
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="caption">
                                {formatDate(user.createdAt)}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <LocationOn sx={{ fontSize: 12 }} />
                                <Typography variant="caption">
                                  {user.city}
                                </Typography>
                              </Box>
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default UsersPage;
