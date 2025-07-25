import React, { useEffect, useState } from 'react';
import {
  Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Avatar, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  CircularProgress, Snackbar, MenuItem, Chip, Grid, Divider, Alert, FormControl, InputLabel, Select, OutlinedInput, FormHelperText, Box, Tooltip
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import { useAuth } from '../utils/AuthContext';
import { fetchUsers, createUser, updateUser, deleteUser } from '../services/usersApi';
import { User, UserRoles } from '../types';

const ALL_ROLES: UserRoles[] = [
  UserRoles.SUPER_ADMIN,
  UserRoles.ADMIN,
  UserRoles.MANAGER,
  UserRoles.USER
];

const roleColors: Record<UserRoles, any> = {
  [UserRoles.SUPER_ADMIN]: 'error',
  [UserRoles.ADMIN]: 'warning',
  [UserRoles.MANAGER]: 'primary',
  [UserRoles.USER]: 'success'
};

const UsersPage: React.FC = () => {
  const { hasRole } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [openView, setOpenView] = useState<User | null>(null);
  const [openEdit, setOpenEdit] = useState<User | null>(null);
  const [openDelete, setOpenDelete] = useState<User | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [snackbar, setSnackbar] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter(u =>
    (filterRole === 'all' || (u.roles && u.roles.some(r => (typeof r === 'string' ? r : r.name) === filterRole))) &&
    (u.fullName?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))
  );

  const canEdit = hasRole(UserRoles.SUPER_ADMIN) || hasRole(UserRoles.ADMIN);
  const canDelete = hasRole(UserRoles.SUPER_ADMIN);
  const canCreate = hasRole(UserRoles.SUPER_ADMIN) || hasRole(UserRoles.ADMIN);

  const handleCreate = (data: Partial<User>) => {
    createUser(data as any).then(newUser => {
      setUsers([...users, newUser]);
      setOpenCreate(false);
      setSnackbar('Пользователь создан');
    });
  };

  const handleUpdate = (data: Partial<User>) => {
    const canEditSensitive = hasRole(UserRoles.SUPER_ADMIN) || hasRole(UserRoles.ADMIN);
    const payload: any = {
      id: data.id,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      email: data.email,
      roles: data.roles,
    };
    if (canEditSensitive) {
      if (data.managedClubId != null) payload.managedClubId = data.managedClubId;
      if (data.balance !== undefined) payload.balance = data.balance;
      if (data.points !== undefined) payload.points = data.points;
      if (data.isDeleted !== undefined) payload.isDeleted = data.isDeleted;
    }
    if ((data as any).password) payload.password = (data as any).password;
    updateUser(payload).then(() => {
      setUsers(users => users.map(u => u.id === data.id ? { ...u, ...data } : u));
      setOpenEdit(null);
      setSnackbar('Пользователь обновлен');
    });
  };

  const handleDelete = (id: number) => {
    deleteUser(id).then(() => {
      setUsers(users.filter(u => u.id !== id));
      setOpenDelete(null);
      setSnackbar('Пользователь удален');
    });
  };

  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>👥 Пользователи</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Поиск"
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="small"
        />
        <TextField
          select
          label="Роль"
          value={filterRole}
          onChange={e => setFilterRole(e.target.value)}
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="all">Все роли</MenuItem>
          {ALL_ROLES.map(role => <MenuItem value={role} key={role}>{role}</MenuItem>)}
        </TextField>
        {canCreate && (
          <Button variant="contained" startIcon={<Add />} onClick={() => setOpenCreate(true)}>
            Новый пользователь
          </Button>
        )}
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Аватар</TableCell>
                <TableCell>Имя</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Роли</TableCell>
                <TableCell>Клуб</TableCell>
                <TableCell>Баланс</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map(u => (
                <TableRow key={u.id}>
                  <TableCell>
                    <Avatar src={`https://i.pravatar.cc/150?u=${u.email}`} />
                  </TableCell>
                  <TableCell>{u.fullName}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    {(u.roles || []).map((r, i) => {
                      const roleName = typeof r === 'string' ? r : r.name;
                      return (
                        <Chip
                          key={i}
                          label={roleName}
                          color={roleColors[roleName as UserRoles] || 'default'}
                          size="small"
                          sx={{ mr: 0.5 }}
                        />
                      );
                    })}
                  </TableCell>
                  <TableCell>{u.managedClubId || '-'}</TableCell>
                  <TableCell>{u.balance}₸</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Посмотреть">
                        <IconButton
                          size="small"
                          sx={{ color: '#1976d2', bgcolor: '#e3f2fd', '&:hover': { bgcolor: '#bbdefb' } }}
                          onClick={() => setOpenView(u)}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {canEdit && (
                        <Tooltip title="Редактировать">
                          <IconButton
                            size="small"
                            sx={{ color: '#ed6c02', bgcolor: '#fff3e0', '&:hover': { bgcolor: '#ffe0b2' } }}
                            onClick={() => setOpenEdit(u)}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {canDelete && (
                        <Tooltip title="Удалить">
                          <IconButton
                            size="small"
                            sx={{ color: '#d32f2f', bgcolor: '#ffebee', '&:hover': { bgcolor: '#ffcdd2' } }}
                            onClick={() => setOpenDelete(u)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <UserDialog open={!!openView} user={openView || {}} onClose={() => setOpenView(null)} readOnly />
      <UserDialog open={!!openEdit} user={openEdit || {}} onClose={() => setOpenEdit(null)} onSave={handleUpdate} />
      <UserDialog open={openCreate} user={{}} onClose={() => setOpenCreate(false)} onSave={handleCreate} />
      <Dialog open={!!openDelete} onClose={() => setOpenDelete(null)}>
        <DialogTitle>Удалить пользователя?</DialogTitle>
        <DialogContent>Вы уверены, что хотите удалить пользователя {openDelete?.fullName}?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(null)}>Отмена</Button>
          <Button color="error" onClick={() => handleDelete(openDelete!.id)}>Удалить</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={!!snackbar} autoHideDuration={3000} onClose={() => setSnackbar(null)} message={snackbar} />
    </>
  );
};

const UserDialog = ({ open, user = {}, onClose, onSave, readOnly = false }: any) => {
  const [form, setForm] = useState<any>({ ...user, roles: user.roles || [] });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => { setForm({ ...user, roles: user.roles || [] }); setError(null); }, [user, open]);

  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const roles = Array.isArray(form.roles)
        ? form.roles.map((r: any) => typeof r === 'string' ? r : r.name)
        : [];
      const payload: any = {
        id: form.id,
        fullName: form.fullName,
        phoneNumber: form.phoneNumber,
        email: form.email,
        roles,
      };
      if (form.password) payload.password = form.password;
      if (form.managedClubId !== undefined) payload.managedClubId = form.managedClubId;
      if (form.balance !== undefined) payload.balance = form.balance;
      await onSave(payload);
    } catch (e: any) {
      setError(e.message || 'Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          minWidth: 500,
          maxWidth: 720,
          borderRadius: 4,
          p: 0,
        }
      }}
    >
      <DialogTitle sx={{ pt: 3, pb: 2, fontWeight: 700, fontSize: 22 }}>
        {readOnly ? 'Просмотр пользователя' : (user?.id ? 'Редактировать пользователя' : 'Новый пользователь')}
      </DialogTitle>
      <DialogContent sx={{ px: 4, pt: 1, pb: 0 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Имя"
              value={form.fullName || ''}
              onChange={e => handleChange('fullName', e.target.value)}
              disabled={readOnly || loading}
              fullWidth
              variant="outlined"
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              value={form.email || ''}
              onChange={e => handleChange('email', e.target.value)}
              disabled={readOnly || loading}
              fullWidth
              variant="outlined"
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Телефон"
              value={form.phoneNumber || ''}
              onChange={e => handleChange('phoneNumber', e.target.value)}
              disabled={readOnly || loading}
              fullWidth
              variant="outlined"
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="dense" disabled={readOnly || loading}>
              <InputLabel>Роли</InputLabel>
              <Select
                multiple
                value={form.roles || []}
                onChange={e => handleChange('roles', e.target.value)}
                input={<OutlinedInput label="Роли" />}
                renderValue={(selected) => (selected as string[]).join(', ')}
                sx={{ minHeight: 56 }}
              >
                {ALL_ROLES.map((role: string) => (
                  <MenuItem key={role} value={role}>{role}</MenuItem>
                ))}
              </Select>
              <FormHelperText>Можно выбрать несколько ролей</FormHelperText>
            </FormControl>
          </Grid>
          {!readOnly && (
            <Grid item xs={12} sm={6}>
              <TextField
                label="Пароль"
                type="password"
                value={form.password || ''}
                onChange={e => handleChange('password', e.target.value)}
                fullWidth
                autoComplete="new-password"
                variant="outlined"
                margin="dense"
              />
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Клуб"
              value={form.managedClubId || ''}
              onChange={e => handleChange('managedClubId', e.target.value)}
              disabled={readOnly || loading}
              fullWidth
              variant="outlined"
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Баланс"
              type="number"
              value={form.balance || 0}
              onChange={e => handleChange('balance', e.target.value)}
              disabled={readOnly || loading}
              fullWidth
              variant="outlined"
              margin="dense"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 4, pb: 3, pt: 2 }}>
        <Button onClick={onClose} disabled={loading}>Закрыть</Button>
        {!readOnly && (
          <Button onClick={handleSave} variant="contained" disabled={loading}>
            {loading ? 'Сохраняю...' : 'Сохранить'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default UsersPage;