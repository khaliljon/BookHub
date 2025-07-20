import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { User, UserRoles, CreateUserRequest, UpdateUserRequest } from '../../types';
import { apiService } from '../../services/api';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
    fullName: '',
    password: '',
    roles: [] as UserRoles[],
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const users = await apiService.getUsers();
      console.log('Loaded users:', users);
      setUsers(users);
      setError(null);
    } catch (err) {
      setError('Ошибка загрузки пользователей');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setFormData({
      email: '',
      phoneNumber: '',
      fullName: '',
      password: '',
      roles: [UserRoles.USER],
    });
    setDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      fullName: user.fullName,
      password: '',
      roles: user.roles.map((role: any) => role.name || role) as UserRoles[], // Преобразуем Role в UserRoles
    });
    setDialogOpen(true);
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      try {
        await apiService.deleteUser(userId);
        await loadUsers();
      } catch (err) {
        setError('Ошибка удаления пользователя');
        console.error('Error deleting user:', err);
      }
    }
  };

  const handleSaveUser = async () => {
    try {
      if (editingUser) {
        // Обновление пользователя
        const updateData: UpdateUserRequest = {
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          fullName: formData.fullName,
          roles: formData.roles,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        console.log('Updating user with data:', updateData);
        await apiService.updateUser(editingUser.id, updateData);
      } else {
        // Создание нового пользователя
        const createData: CreateUserRequest = {
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          fullName: formData.fullName,
          password: formData.password,
          roles: formData.roles,
        };
        console.log('Creating user with data:', createData);
        await apiService.createUser(createData);
      }
      setDialogOpen(false);
      await loadUsers();
    } catch (err) {
      setError('Ошибка сохранения пользователя');
      console.error('Error saving user:', err);
    }
  };

  const getRoleDisplayName = (role: UserRoles): string => {
    const roleNames = {
      [UserRoles.SUPER_ADMIN]: 'Супер Администратор',
      [UserRoles.ADMIN]: 'Администратор',
      [UserRoles.MANAGER]: 'Менеджер',
      [UserRoles.USER]: 'Пользователь',
    };
    return roleNames[role] || role;
  };

  const getRoleColor = (role: UserRoles): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (role) {
      case UserRoles.SUPER_ADMIN: return 'error';
      case UserRoles.ADMIN: return 'warning';
      case UserRoles.MANAGER: return 'info';
      case UserRoles.USER: return 'default';
      default: return 'default';
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
        <Typography variant="h4">Управление пользователями</Typography>
        <Box>
          <IconButton onClick={loadUsers} sx={{ mr: 1 }}>
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateUser}
          >
            Добавить пользователя
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
              <TableCell>Email</TableCell>
              <TableCell>Телефон</TableCell>
              <TableCell>Полное имя</TableCell>
              <TableCell>Роли</TableCell>
              <TableCell>Дата создания</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    {user.roles.map((role: any, index: number) => (
                      <Chip
                        key={index}
                        label={getRoleDisplayName(role.name || role)}
                        color={getRoleColor(role.name || role)}
                        size="small"
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleEditUser(user)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteUser(user.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Пользователи не найдены
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Диалог создания/редактирования пользователя */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Редактировать пользователя' : 'Создать пользователя'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Телефон"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              fullWidth
              required
              placeholder="+7 (999) 123-45-67"
            />
            <TextField
              label="Полное имя"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label={editingUser ? 'Новый пароль (оставьте пустым для сохранения текущего)' : 'Пароль'}
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              fullWidth
              required={!editingUser}
            />
            <FormControl fullWidth>
              <InputLabel>Роли</InputLabel>
              <Select
                multiple
                value={formData.roles}
                onChange={(e) => setFormData({ ...formData, roles: e.target.value as UserRoles[] })}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={getRoleDisplayName(value)} />
                    ))}
                  </Box>
                )}
              >
                {Object.values(UserRoles).map((role) => (
                  <MenuItem key={role} value={role}>
                    {getRoleDisplayName(role)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleSaveUser} variant="contained">
            {editingUser ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersPage;
