import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, CircularProgress } from '@mui/material';

interface Booking {
  id: number;
  userId: number;
  seatId: number;
  startTime: string;
  endTime: string;
  status: string;
}

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editBooking, setEditBooking] = useState<Booking | null>(null);
  const [form, setForm] = useState({ userId: '', seatId: '', startTime: '', endTime: '', status: '' });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success'|'error' }>({ open: false, message: '', severity: 'success' });

  const fetchBookings = () => {
    setLoading(true);
    fetch('/api/bookings')
      .then(res => res.json())
      .then(data => {
        setBookings(data);
        setLoading(false);
      })
      .catch(() => {
        setSnackbar({ open: true, message: 'Ошибка загрузки бронирований', severity: 'error' });
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleOpen = (booking?: Booking) => {
    if (booking) {
      setEditBooking(booking);
      setForm({ userId: String(booking.userId), seatId: String(booking.seatId), startTime: booking.startTime, endTime: booking.endTime, status: booking.status });
    } else {
      setEditBooking(null);
      setForm({ userId: '', seatId: '', startTime: '', endTime: '', status: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditBooking(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!form.userId || !form.seatId || !form.startTime || !form.endTime || !form.status) {
      setSnackbar({ open: true, message: 'Заполните все поля', severity: 'error' });
      return;
    }
    const method = editBooking ? 'PUT' : 'POST';
    const url = editBooking ? `/api/bookings/${editBooking.id}` : '/api/bookings';
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, userId: Number(form.userId), seatId: Number(form.seatId) })
    })
      .then(res => {
        if (!res.ok) throw new Error('Ошибка сохранения');
        return res.json();
      })
      .then(() => {
        setSnackbar({ open: true, message: 'Бронирование сохранено', severity: 'success' });
        fetchBookings();
        handleClose();
      })
      .catch(() => setSnackbar({ open: true, message: 'Ошибка сохранения', severity: 'error' }));
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: 40 }}>
      <Typography variant="h4" gutterBottom>Бронирования</Typography>
      <Button variant="contained" color="primary" style={{ marginBottom: 16 }} onClick={() => handleOpen()}>
        Добавить бронирование
      </Button>
      <Paper>
        {loading ? <CircularProgress /> : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>ID пользователя</TableCell>
                <TableCell>ID места</TableCell>
                <TableCell>Начало</TableCell>
                <TableCell>Конец</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map(booking => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.id}</TableCell>
                  <TableCell>{booking.userId}</TableCell>
                  <TableCell>{booking.seatId}</TableCell>
                  <TableCell>{booking.startTime}</TableCell>
                  <TableCell>{booking.endTime}</TableCell>
                  <TableCell>{booking.status}</TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined" onClick={() => handleOpen(booking)}>Редактировать</Button>
                    <Button size="small" color="error" variant="outlined" style={{ marginLeft: 8 }}>Удалить</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editBooking ? 'Редактировать бронирование' : 'Добавить бронирование'}</DialogTitle>
        <DialogContent>
          <TextField label="ID пользователя" name="userId" value={form.userId} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="ID места" name="seatId" value={form.seatId} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="Начало" name="startTime" value={form.startTime} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="Конец" name="endTime" value={form.endTime} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="Статус" name="status" value={form.status} onChange={handleChange} fullWidth margin="normal" required />
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

export default BookingsPage;
