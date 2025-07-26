import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  Person,
  ExpandMore,
  Shield,
  Lock,
  LockOpen,
  Visibility,
  Settings,
  Check,
  Close,
} from '@mui/icons-material';

interface RoleDto {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  userCount: number;
  createdAt: string;
  permissions: Record<string, Record<string, boolean>>;
}

type PermissionMatrix = Record<string, Record<string, boolean>>;

interface ExtendedRole extends RoleDto {
  color: string;
  icon: React.ReactNode;
  displayName: string;
  isSystem: boolean;
}

interface UserWithRole {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

const RolesPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [roles, setRoles] = useState<ExtendedRole[]>([]);
  const [usersWithRoles, setUsersWithRoles] = useState<UserWithRole[]>([]);

  const handlePermissionChange = (roleName: string, key: string, action: string, value: boolean) => {
    setRoles(prevRoles => prevRoles.map(r => {
      if (r.name !== roleName) return r;
      let newPermissions: PermissionMatrix = r.permissions || getDefaultPermissions(roleName);
      return {
        ...r,
        permissions: {
          ...newPermissions,
          [key]: {
            ...(newPermissions[key] || {}),
            [action]: value
          }
        }
      };
    }));
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Нет токена авторизации');
      return;
    }
    axios.get<RoleDto[]>('/api/roles', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const mappedRoles: ExtendedRole[] = res.data.map((r, index) => ({
          ...r,
          color: getRandomColor(index),
          icon: <Person />,
          displayName: r.name,
          isSystem: ['SuperAdmin', 'Admin'].includes(r.name)
        }));
        setRoles(mappedRoles);
      })
      .catch(err => {
        console.error('Ошибка загрузки ролей', err);
      });
  }, []);

  const getRandomColor = (index: number) => {
    const colors = ['#2e7d32', '#1976d2', '#9c27b0', '#ed6c02'];
    return colors[index % colors.length];
  };

  const permissionsMeta = [
    { key: 'users', name: 'Пользователи', description: 'Управление аккаунтами пользователей' },
    { key: 'clubs', name: 'Клубы', description: 'Управление игровыми клубами' },
    { key: 'bookings', name: 'Бронирования', description: 'Управление бронированиями' },
    { key: 'payments', name: 'Платежи', description: 'Управление платежами и транзакциями' },
    { key: 'roles', name: 'Роли', description: 'Управление ролями и правами' },
    { key: 'notifications', name: 'Уведомления', description: 'Управление системными уведомлениями' },
    { key: 'reports', name: 'Отчеты', description: 'Доступ к отчетам и аналитике' },
    { key: 'settings', name: 'Настройки', description: 'Настройки системы' },
  ];

  const getDefaultPermissions = (roleName: string): PermissionMatrix => {
    const allActions = { create: true, read: true, update: true, delete: true };
    const adminActions = { create: true, read: true, update: true, delete: false };
    const managerActions = { create: true, read: true, update: true, delete: false };
    const userActions = { create: false, read: true, update: true, delete: false };
    switch (roleName) {
      case 'SuperAdmin':
        return permissionsMeta.reduce((acc, p) => ({ ...acc, [p.key]: { ...allActions } }), {});
      case 'Admin':
        return permissionsMeta.reduce((acc, p) => ({ ...acc, [p.key]: { ...adminActions } }), {});
      case 'Manager':
        return permissionsMeta.reduce((acc, p) => ({ ...acc, [p.key]: { ...managerActions } }), {});
      case 'User':
        return permissionsMeta.reduce((acc, p) => ({ ...acc, [p.key]: { ...userActions } }), {});
      default:
        return {};
    }
  };

  const formatDate = (iso: string | null | undefined) => {
    if (!iso) return 'Неизвестно';
    const date = new Date(iso);
    return isNaN(date.getTime()) ? 'Неизвестно' : date.toLocaleDateString('ru-RU');
  };

  const PermissionIcon = ({ hasPermission }: { hasPermission: boolean }) => (
    Boolean(hasPermission) ? <Check sx={{ color: '#2e7d32', fontSize: 16 }} /> : <Close sx={{ color: '#d32f2f', fontSize: 16 }} />
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

  const handleSavePermissions = async () => {
    const selected = roles.find(r => r.name === selectedRole);
    if (!selected) return;
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(`/api/roles/${selected.id}/permissions`, selected.permissions, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // После успешного сохранения — повторно загружаем роли
      const res = await axios.get<RoleDto[]>("/api/roles", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const mappedRoles: ExtendedRole[] = res.data.map((r, index) => ({
        ...r,
        color: getRandomColor(index),
        icon: <Person />,
        displayName: r.name,
        isSystem: ["SuperAdmin", "Admin"].includes(r.name)
      }));
      setRoles(mappedRoles);
      // Убираем всплывающее сообщение об успехе
    } catch (err) {
      console.error("Ошибка при сохранении прав:", err);
      alert("Ошибка при сохранении прав");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>🎭 Управление ролями</Typography>
      <Typography variant="subtitle1" sx={{ color: '#666', mb: 4 }}>Настройка прав доступа и разрешений</Typography>

      <Grid container spacing={3}>
        {roles.map((role) => (
          <Grid item xs={12} md={6} lg={4} key={role.id}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ backgroundColor: role.color, borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>{role.icon}</Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{role.displayName}</Typography>
                      <Typography variant="caption" color="text.secondary">{role.description}</Typography>
                    </Box>
                  </Box>
                  <Chip label={role.isSystem ? 'Системная' : 'Пользовательская'} icon={role.isSystem ? <Lock /> : <LockOpen />} size="small" variant="outlined" />
                </Box>

                <Typography variant="body2" sx={{ mb: 1 }}>Пользователей: {role.userCount}</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>Создана: {formatDate(role.createdAt)}</Typography>

                <Button size="small" variant="outlined" onClick={() => setSelectedRole(role.name)}>Подробнее</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedRole && (
        <Box sx={{ mt: 5 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>🔐 Разрешения для роли: {selectedRole}</Typography>
          {permissionsMeta.map(p => {
            const selected = roles.find(r => r.name === selectedRole);
            const perms = selected?.permissions || getDefaultPermissions(selectedRole);
            const permsForKey = perms[p.key] || {};
            return (
              <Accordion key={p.key} sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>{p.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {Object.keys(permsForKey).length === 0 ? (
                    <Typography color="text.secondary" sx={{ p: 2 }}>Нет разрешений для этой роли</Typography>
                  ) : (
                    <Grid container spacing={2}>
                      {Object.entries(permsForKey).map(([action, hasPermission]) => (
                        <Grid item xs={6} sm={3} key={action}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={Boolean(hasPermission)}
                                disabled={selected?.isSystem}
                                size="small"
                                onChange={e => {
                                  if (!selected?.isSystem) {
                                    handlePermissionChange(selectedRole, p.key, action, e.target.checked);
                                  }
                                }}
                              />
                            }
                            label={getPermissionText(action)}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </AccordionDetails>
              </Accordion>
            );
          })}
          <Button variant="contained" onClick={handleSavePermissions} sx={{ mt: 2 }}>💾 Сохранить изменения</Button>
        </Box>
      )}
    </Box>
  );
};

export default RolesPage;
