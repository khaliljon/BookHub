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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
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
import { User, UserRoles } from '../types';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [addUserError, setAddUserError] = useState('');
  const [addUserSuccess, setAddUserSuccess] = useState('');
  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    roles: [UserRoles.USER] as UserRoles[],
  });

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

  // Статистика
  const totalUsers = users.length;

  // Фильтрация
  const filteredUsers = users.filter(user => {
    const roleMatch = filterRole === 'all' || (Array.isArray(user.roles) && user.roles.some(r => (typeof r === 'string' ? r : r.name) === filterRole));
    const searchMatch = searchTerm === '' ||
      (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.phoneNumber && user.phoneNumber.includes(searchTerm));
    return roleMatch && searchMatch;
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
                    {users.filter(u => u.isDeleted === false).length}
                  </Typography>
                  <Typography variant="body2">
                    Активных
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="caption">
                      {totalUsers ? ((users.filter(u => u.isDeleted === false).length / totalUsers) * 100).toFixed(0) : 0}% от общего числа
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
                    0
                  </Typography>
                  <Typography variant="body2">
                    Онлайн сейчас
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="caption">
                      0% активности
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
                    {users.filter(u => u.isDeleted).length}
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

                <Button
                  variant="contained"
                  startIcon={<AddPersonIcon />}
                  sx={{ ml: 'auto' }}
                  onClick={() => setAddUserOpen(true)}
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
                      <TableCell>Роли</TableCell>
                      <TableCell>Статус</TableCell>
                      <TableCell>Баланс</TableCell>
                      <TableCell>Очки</TableCell>
                      <TableCell>Дата регистрации</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar>{user.fullName ? user.fullName[0] : '?'}</Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{user.fullName}</Typography>
                              <Typography variant="caption" color="text.secondary">ID: {user.id}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">{user.email}</Typography><br />
                          <Typography variant="caption">{user.phoneNumber}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={Array.isArray(user.roles) ? user.roles.map(r => typeof r === 'string' ? r : r.name).join(', ') : ''}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.isDeleted ? 'Заблокирован' : 'Активен'}
                            color={user.isDeleted ? 'error' : 'success'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">₸{user.balance}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">{user.points}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : ''}</Typography>
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
                  { name: 'Супер админ', key: 'SuperAdmin', color: '#d32f2f' },
                  { name: 'Администратор', key: 'Admin', color: '#ed6c02' },
                  { name: 'Менеджер', key: 'Manager', color: '#1976d2' },
                  { name: 'Пользователь', key: 'User', color: '#2e7d32' },
                ].map((role, index) => {
                  const count = users.filter(u => Array.isArray(u.roles) && u.roles.some(r => (typeof r === 'string' ? r : r.name) === role.key)).length;
                  return (
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
                          secondary={`${count} пользователей (${users.length ? ((count / users.length) * 100).toFixed(0) : 0}%)`}
                        />
                      </ListItem>
                      {index < 3 && <Divider />}
                    </React.Fragment>
                  );
                })}
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
                  .slice()
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 5)
                  .map((user, index) => (
                    <React.Fragment key={user.id}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar>{user.fullName ? user.fullName[0] : '?'}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {user.fullName}
                              </Typography>
                              <Chip
                                label={Array.isArray(user.roles) ? user.roles.map(r => typeof r === 'string' ? r : r.name).join(', ') : ''}
                                size="small"
                                sx={{ fontSize: '10px', height: 20 }}
                              />
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="caption">
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : ''}
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
        </Grid>
      </Grid>

      <Dialog open={addUserOpen} onClose={() => setAddUserOpen(false)}>
        <DialogTitle>Добавить пользователя</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 340 }}>
          <TextField label="ФИО" value={newUser.fullName} onChange={e => setNewUser({ ...newUser, fullName: e.target.value })} fullWidth />
          <TextField label="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} fullWidth />
          <TextField label="Телефон" value={newUser.phoneNumber} onChange={e => setNewUser({ ...newUser, phoneNumber: e.target.value })} fullWidth />
          <TextField label="Пароль" type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} fullWidth />
          <TextField
            select
            label="Роль"
            value={newUser.roles[0]}
            onChange={e => setNewUser({ ...newUser, roles: [e.target.value as UserRoles] })}
            fullWidth
          >
            <MenuItem value={UserRoles.USER}>Пользователь</MenuItem>
            <MenuItem value={UserRoles.MANAGER}>Менеджер</MenuItem>
            <MenuItem value={UserRoles.ADMIN}>Админ</MenuItem>
            <MenuItem value={UserRoles.SUPER_ADMIN}>Супер админ</MenuItem>
          </TextField>
          {addUserError && <Alert severity="error">{addUserError}</Alert>}
          {addUserSuccess && <Alert severity="success">{addUserSuccess}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddUserOpen(false)}>Отмена</Button>
          <Button
            variant="contained"
            onClick={async () => {
              setAddUserLoading(true);
              setAddUserError('');
              setAddUserSuccess('');
              try {
                await apiService.createUser({
                  fullName: newUser.fullName,
                  email: newUser.email,
                  phoneNumber: newUser.phoneNumber,
                  password: newUser.password,
                  roles: newUser.roles,
                });
                setAddUserSuccess('Пользователь добавлен!');
                setAddUserOpen(false);
                setNewUser({ fullName: '', email: '', phoneNumber: '', password: '', roles: [UserRoles.USER] });
                // обновить список
                setLoading(true);
                const data = await apiService.getUsers();
                setUsers(data);
              } catch (e: any) {
                setAddUserError(e?.message || 'Ошибка при добавлении пользователя');
              } finally {
                setAddUserLoading(false);
              }
            }}
            disabled={addUserLoading || !newUser.fullName || !newUser.email || !newUser.phoneNumber || !newUser.password}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={!!addUserSuccess} autoHideDuration={3000} onClose={() => setAddUserSuccess('')}>
        <Alert onClose={() => setAddUserSuccess('')} severity="success" sx={{ width: '100%' }}>
          {addUserSuccess}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UsersPage;
