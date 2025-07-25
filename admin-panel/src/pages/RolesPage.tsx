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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  VpnKey as RoleIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Security as SecurityIcon,
  People as PeopleIcon,
  AdminPanelSettings,
  ManageAccounts,
  Person,
  ExpandMore,
  Shield,
  Lock,
  LockOpen,
  Visibility,
  VisibilityOff,
  Settings,
  Check,
  Close,
} from '@mui/icons-material';

const RolesPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // Моковые данные ролей
  const roles = [
    {
      id: 1,
      name: 'User',
      displayName: 'Пользователь',
      description: 'Базовые права для обычных пользователей',
      userCount: 2,
      color: '#2e7d32',
      icon: <Person />,
      permissions: {
        users: { create: false, read: false, update: false, delete: false },
        clubs: { create: false, read: true, update: false, delete: false },
        bookings: { create: true, read: true, update: false, delete: false },
        payments: { create: false, read: true, update: false, delete: false },
        roles: { create: false, read: false, update: false, delete: false },
        notifications: { create: false, read: true, update: false, delete: false },
        reports: { create: false, read: false, update: false, delete: false },
        settings: { create: false, read: false, update: false, delete: false },
      },
      isSystem: true,
      createdAt: new Date(2024, 0, 1),
    },
  ];

  // Моковые пользователи с ролями
  const usersWithRoles = [
    { id: 1, name: 'Иван Иванов', email: 'ivan@club.kz', role: 'User', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: 2, name: 'Петр Петров', email: 'petr@club.kz', role: 'User', avatar: 'https://i.pravatar.cc/150?img=2' },
  ];

  const permissions = [
    { key: 'users', name: 'Пользователи', description: 'Управление аккаунтами пользователей' },
    { key: 'clubs', name: 'Клубы', description: 'Управление игровыми клубами' },
    { key: 'bookings', name: 'Бронирования', description: 'Управление бронированиями' },
    { key: 'payments', name: 'Платежи', description: 'Управление платежами и транзакциями' },
    { key: 'roles', name: 'Роли', description: 'Управление ролями и правами' },
    { key: 'notifications', name: 'Уведомления', description: 'Управление системными уведомлениями' },
    { key: 'reports', name: 'Отчеты', description: 'Доступ к отчетам и аналитике' },
    { key: 'settings', name: 'Настройки', description: 'Настройки системы' },
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const PermissionIcon = ({ hasPermission }: { hasPermission: boolean }) => (
    hasPermission ? (
      <Check sx={{ color: '#2e7d32', fontSize: 16 }} />
    ) : (
      <Close sx={{ color: '#d32f2f', fontSize: 16 }} />
    )
  );

  const getPermissionText = (action: string) => {
    switch (action) {
      case 'create': return 'Создание';
      case 'read': return 'Просмотр';
      case 'update': return 'Изменение';
      case 'delete': return 'Удаление';
      default: return action;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Заголовок */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
          🎭 Управление ролями
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#666' }}>
          Настройка прав доступа и разрешений
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
                    {roles.length}
                  </Typography>
                  <Typography variant="body2">
                    Всего ролей
                  </Typography>
                  <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                    {roles.filter(r => r.isSystem).length} системных
                  </Typography>
                </Box>
                <RoleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {usersWithRoles.length}
                  </Typography>
                  <Typography variant="body2">
                    Пользователей с ролями
                  </Typography>
                  <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                    100% покрытие
                  </Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {permissions.length}
                  </Typography>
                  <Typography variant="body2">
                    Типов разрешений
                  </Typography>
                  <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                    4 действия на тип
                  </Typography>
                </Box>
                <SecurityIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {roles.filter(r => !r.isSystem).length}
                  </Typography>
                  <Typography variant="body2">
                    Пользовательских ролей
                  </Typography>
                  <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                    Можно редактировать
                  </Typography>
                </Box>
                <Shield sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Список ролей */}
        <Grid item xs={12} lg={7}>
          <Card sx={{ borderRadius: 2, mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  🎭 Роли системы
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                >
                  Создать роль
                </Button>
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Роль</TableCell>
                      <TableCell>Пользователи</TableCell>
                      <TableCell>Тип</TableCell>
                      <TableCell>Создана</TableCell>
                      <TableCell>Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {roles.map((role) => (
                      <TableRow 
                        key={role.id}
                        sx={{ 
                          '&:hover': { backgroundColor: '#f5f5f5' },
                          backgroundColor: selectedRole === role.name ? '#e3f2fd' : 'inherit'
                        }}
                        onClick={() => setSelectedRole(selectedRole === role.name ? null : role.name)}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                backgroundColor: role.color,
                                color: 'white',
                              }}
                            >
                              {role.icon}
                            </Box>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {role.displayName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {role.description}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Chip
                            label={`${role.userCount} ${role.userCount === 1 ? 'пользователь' : 'пользователей'}`}
                            size="small"
                            sx={{ backgroundColor: role.color, color: 'white' }}
                          />
                        </TableCell>
                        
                        <TableCell>
                          <Chip
                            icon={role.isSystem ? <Lock /> : <LockOpen />}
                            label={role.isSystem ? 'Системная' : 'Пользовательская'}
                            color={role.isSystem ? 'default' : 'primary'}
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(role.createdAt)}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Просмотр">
                              <IconButton size="small" sx={{ color: '#1976d2' }}>
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {!role.isSystem && (
                              <>
                                <Tooltip title="Редактировать">
                                  <IconButton size="small" sx={{ color: '#ed6c02' }}>
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Удалить">
                                  <IconButton size="small" sx={{ color: '#d32f2f' }}>
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Детали роли */}
          {selectedRole && (
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                  🔐 Разрешения роли: {roles.find(r => r.name === selectedRole)?.displayName}
                </Typography>

                {permissions.map((permission) => {
                  const rolePermissions = roles.find(r => r.name === selectedRole)?.permissions[permission.key as keyof typeof roles[0]['permissions']];
                  
                  return (
                    <Accordion key={permission.key} sx={{ mb: 1 }}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mr: 2 }}>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                              {permission.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {permission.description}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {Object.entries(rolePermissions || {}).map(([action, hasPermission]) => (
                              <PermissionIcon key={action} hasPermission={hasPermission} />
                            ))}
                          </Box>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          {Object.entries(rolePermissions || {}).map(([action, hasPermission]) => (
                            <Grid item xs={6} sm={3} key={action}>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={hasPermission}
                                    color="primary"
                                    size="small"
                                  />
                                }
                                label={getPermissionText(action)}
                                disabled={roles.find(r => r.name === selectedRole)?.isSystem}
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Правая панель */}
        <Grid item xs={12} lg={5}>
          {/* Пользователи по ролям */}
          <Card sx={{ borderRadius: 2, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                👥 Пользователи по ролям
              </Typography>

              {roles.map((role) => (
                <Box key={role.id} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: role.color,
                        color: 'white',
                      }}
                    >
                      {role.icon}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {role.displayName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {role.userCount} {role.userCount === 1 ? 'пользователь' : 'пользователей'}
                      </Typography>
                    </Box>
                  </Box>

                  <List sx={{ p: 0, pl: 5 }}>
                    {usersWithRoles
                      .filter(user => user.role === role.name)
                      .map((user, index) => (
                        <React.Fragment key={user.id}>
                          <ListItem sx={{ px: 0, py: 0.5 }}>
                            <ListItemAvatar sx={{ minWidth: 36 }}>
                              <Avatar 
                                src={user.avatar}
                                sx={{ width: 28, height: 28 }}
                              />
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography variant="body2">
                                  {user.name}
                                </Typography>
                              }
                              secondary={
                                <Typography variant="caption" color="text.secondary">
                                  {user.email}
                                </Typography>
                              }
                            />
                          </ListItem>
                          {index < usersWithRoles.filter(u => u.role === role.name).length - 1 && (
                            <Divider sx={{ ml: 5 }} />
                          )}
                        </React.Fragment>
                      ))}
                  </List>
                </Box>
              ))}
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
                    Создать новую роль
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<PeopleIcon />}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Массовое назначение ролей
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<SecurityIcon />}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Аудит разрешений
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Settings />}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Экспорт конфигурации
                  </Button>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>
                💡 Подсказки
              </Typography>
              
              <List sx={{ p: 0 }}>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemText
                    primary={
                      <Typography variant="caption">
                        • Системные роли нельзя изменить или удалить
                      </Typography>
                    }
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemText
                    primary={
                      <Typography variant="caption">
                        • Каждый пользователь должен иметь хотя бы одну роль
                      </Typography>
                    }
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemText
                    primary={
                      <Typography variant="caption">
                        • Изменения разрешений применяются мгновенно
                      </Typography>
                    }
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RolesPage;
