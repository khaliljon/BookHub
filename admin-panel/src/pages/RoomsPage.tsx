import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, CircularProgress } from '@mui/material';

interface Room {
  id: number;
  name: string;
  roomType: string;
  venueId: number;
}

const RoomsPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editRoom, setEditRoom] = useState<Room | null>(null);
  const [form, setForm] = useState({ name: '', type: '', clubId: '' });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success'|'error' }>({ open: false, message: '', severity: 'success' });

  const fetchRooms = () => {
    setLoading(true);
    fetch('/api/rooms')
      .then(res => res.json())
      .then(data => {
        setRooms(data);
        setLoading(false);
      })
      .catch(() => {
        setSnackbar({ open: true, message: 'Ошибка загрузки комнат', severity: 'error' });
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleOpen = (room?: Room) => {
    if (room) {
      setEditRoom(room);
      setForm({ name: room.name, type: room.roomType, clubId: String(room.venueId) });
    } else {
      setEditRoom(null);
      setForm({ name: '', type: '', clubId: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditRoom(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!form.name || !form.type || !form.clubId) {
      setSnackbar({ open: true, message: 'Заполните все поля', severity: 'error' });
      return;
    }
    const method = editRoom ? 'PUT' : 'POST';
    const url = editRoom ? `/api/rooms/${editRoom.id}` : '/api/rooms';
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, clubId: Number(form.clubId) })
    })
      .then(res => {
        if (!res.ok) throw new Error('Ошибка сохранения');
        return res.json();
      })
      .then(() => {
        setSnackbar({ open: true, message: 'Комната сохранена', severity: 'success' });
        fetchRooms();
        handleClose();
      })
      .catch(() => setSnackbar({ open: true, message: 'Ошибка сохранения', severity: 'error' }));
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: 40 }}>
      <Typography variant="h4" gutterBottom>Комнаты</Typography>
      <Button variant="contained" color="primary" style={{ marginBottom: 16 }} onClick={() => handleOpen()}>
        Добавить комнату
      </Button>
      <Paper>
        {loading ? <CircularProgress /> : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Название</TableCell>
                <TableCell>Тип комнаты</TableCell>
                <TableCell>ID клуба</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rooms.map(room => (
                <TableRow key={room.id}>
                  <TableCell>{room.id}</TableCell>
                  <TableCell>{room.name}</TableCell>
                  <TableCell>{room.roomType}</TableCell>
                  <TableCell>{room.venueId}</TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined" onClick={() => handleOpen(room)}>Редактировать</Button>
                    <Button size="small" color="error" variant="outlined" style={{ marginLeft: 8 }}>Удалить</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editRoom ? 'Редактировать комнату' : 'Добавить комнату'}</DialogTitle>
        <DialogContent>
          <TextField label="Название" name="name" value={form.name} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="Тип комнаты" name="type" value={form.type} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="ID клуба" name="clubId" value={form.clubId} onChange={handleChange} fullWidth margin="normal" required />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} variant="contained" color="primary">Сохранить</Button>
          <Button onClick={handleClose}>Отмена</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default RoomsPage;
