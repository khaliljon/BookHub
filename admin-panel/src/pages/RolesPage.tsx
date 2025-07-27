// Removed duplicate imports
import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, CircularProgress } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert } from '@mui/material';

interface Role {
  id: number;
  name: string;
  description: string;
}


const RolesPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success'|'error' }>({ open: false, message: '', severity: 'success' });

  const fetchRoles = () => {
    setLoading(true);
    fetch('/api/roles')
      .then(res => res.json())
      .then(data => {
        setRoles(data);
        setLoading(false);
      })
      .catch(() => {
        setSnackbar({ open: true, message: 'Ошибка загрузки ролей', severity: 'error' });
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleOpen = (role?: Role) => {
    if (role) {
      setEditRole(role);
      setForm({ name: role.name, description: role.description });
    } else {
      setEditRole(null);
      setForm({ name: '', description: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditRole(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!form.name) {
      setSnackbar({ open: true, message: 'Название роли обязательно', severity: 'error' });
      return;
    }
    const method = editRole ? 'PUT' : 'POST';
    const url = editRole ? `/api/roles/${editRole.id}` : '/api/roles';
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => {
        if (!res.ok) throw new Error('Ошибка сохранения');
        return res.json();
      })
      .then(() => {
        setSnackbar({ open: true, message: 'Роль сохранена', severity: 'success' });
        fetchRoles();
        handleClose();
      })
      .catch(() => setSnackbar({ open: true, message: 'Ошибка сохранения', severity: 'error' }));
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('Удалить роль?')) return;
    fetch(`/api/roles/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('Ошибка удаления');
        setSnackbar({ open: true, message: 'Роль удалена', severity: 'success' });
        fetchRoles();
      })
      .catch(() => setSnackbar({ open: true, message: 'Ошибка удаления', severity: 'error' }));
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: 40 }}>
      <Typography variant="h4" gutterBottom>Роли</Typography>
      <Button variant="contained" color="primary" style={{ marginBottom: 16 }} onClick={() => handleOpen()}>
        Добавить роль
      </Button>
      <Paper>
        {loading ? <CircularProgress /> : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Название</TableCell>
                <TableCell>Описание</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map(role => (
                <TableRow key={role.id}>
                  <TableCell>{role.id}</TableCell>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined" onClick={() => handleOpen(role)}>Редактировать</Button>
                    <Button size="small" color="error" variant="outlined" style={{ marginLeft: 8 }} onClick={() => handleDelete(role.id)}>Удалить</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>{editRole ? 'Редактировать роль' : 'Добавить роль'}</DialogTitle>
        <DialogContent>
          <TextField margin="normal" label="Название *" name="name" fullWidth required value={form.name} onChange={handleChange} />
          <TextField margin="normal" label="Описание" name="description" fullWidth value={form.description} onChange={handleChange} />
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

export default RolesPage;
