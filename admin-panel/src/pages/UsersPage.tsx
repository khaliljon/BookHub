// Removed duplicate imports
import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, CircularProgress, MenuItem } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert } from '@mui/material';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

interface Role {
  id: number;
  name: string;
}


const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: '', phone: '' });
  const [roles, setRoles] = useState<Role[]>([]);
  // Загрузка списка ролей
  useEffect(() => {
    fetch('/api/roles')
      .then(res => res.json())
      .then(data => setRoles(data))
      .catch(() => setRoles([]));
  }, []);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success'|'error' }>({ open: false, message: '', severity: 'success' });

  const fetchUsers = () => {
    setLoading(true);
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => {
        setSnackbar({ open: true, message: 'Ошибка загрузки пользователей', severity: 'error' });
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpen = (user?: User) => {
    if (user) {
      setEditUser(user);
      setForm({ name: user.name, email: user.email, password: '', role: user.role, phone: user.phone || '' });
    } else {
      setEditUser(null);
      setForm({ name: '', email: '', password: '', role: '', phone: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditUser(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Валидация обязательных полей
    if (!form.name || !form.email || !form.role || (!editUser && !form.password)) {
      setSnackbar({ open: true, message: 'Заполните все обязательные поля', severity: 'error' });
      return;
    }
    const method = editUser ? 'PUT' : 'POST';
    const url = editUser ? `/api/users/${editUser.id}` : '/api/users';
    const payload: Omit<typeof form, 'password'> & { password?: string } = { ...form };
    if (editUser) delete payload.password; // пароль только при создании
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error('Ошибка сохранения');
        return res.json();
      })
      .then(() => {
        setSnackbar({ open: true, message: 'Пользователь сохранён', severity: 'success' });
        fetchUsers();
        handleClose();
      })
      .catch(() => setSnackbar({ open: true, message: 'Ошибка сохранения', severity: 'error' }));
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('Удалить пользователя?')) return;
    fetch(`/api/users/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('Ошибка удаления');
        setSnackbar({ open: true, message: 'Пользователь удалён', severity: 'success' });
        fetchUsers();
      })
      .catch(() => setSnackbar({ open: true, message: 'Ошибка удаления', severity: 'error' }));
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: 40 }}>
      <Typography variant="h4" gutterBottom>Пользователи</Typography>
      <Button variant="contained" color="primary" style={{ marginBottom: 16 }} onClick={() => handleOpen()}>
        Добавить пользователя
      </Button>
      <Paper>
        {loading ? <CircularProgress /> : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Имя</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Роль</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined" onClick={() => handleOpen(user)}>Редактировать</Button>
                    <Button size="small" color="error" variant="outlined" style={{ marginLeft: 8 }} onClick={() => handleDelete(user.id)}>Удалить</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>{editUser ? 'Редактировать пользователя' : 'Добавить пользователя'}</DialogTitle>
        <DialogContent>
          <TextField margin="normal" label="Имя *" name="name" fullWidth required value={form.name} onChange={handleChange} />
          <TextField margin="normal" label="Email *" name="email" fullWidth required value={form.email} onChange={handleChange} />
          {!editUser && (
            <TextField margin="normal" label="Пароль *" name="password" type="password" fullWidth required value={form.password} onChange={handleChange} />
          )}
          <TextField
            margin="normal"
            label="Роль *"
            name="role"
            select
            fullWidth
            required
            value={form.role}
            onChange={handleChange}
          >
            {roles.map(role => (
              <MenuItem key={role.id} value={role.name}>{role.name}</MenuItem>
            ))}
          </TextField>
          <TextField margin="normal" label="Телефон" name="phone" fullWidth value={form.phone} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button onClick={handleSave} variant="contained" color="primary">Сохранить</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default UsersPage;
