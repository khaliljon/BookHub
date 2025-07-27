import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, CircularProgress } from '@mui/material';

interface Seat {
  id: number;
  label: string;
  seatType: string;
  roomId: number;
}

const SeatsPage: React.FC = () => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editSeat, setEditSeat] = useState<Seat | null>(null);
  const [form, setForm] = useState({ label: '', type: '', roomId: '' });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success'|'error' }>({ open: false, message: '', severity: 'success' });

  const fetchSeats = () => {
    setLoading(true);
    fetch('/api/seats')
      .then(res => res.json())
      .then(data => {
        setSeats(data);
        setLoading(false);
      })
      .catch(() => {
        setSnackbar({ open: true, message: 'Ошибка загрузки мест', severity: 'error' });
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSeats();
  }, []);

  const handleOpen = (seat?: Seat) => {
    if (seat) {
      setEditSeat(seat);
      setForm({ label: seat.label, type: seat.seatType, roomId: String(seat.roomId) });
    } else {
      setEditSeat(null);
      setForm({ label: '', type: '', roomId: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditSeat(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!form.label || !form.type || !form.roomId) {
      setSnackbar({ open: true, message: 'Заполните все поля', severity: 'error' });
      return;
    }
    const method = editSeat ? 'PUT' : 'POST';
    const url = editSeat ? `/api/seats/${editSeat.id}` : '/api/seats';
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, roomId: Number(form.roomId) })
    })
      .then(res => {
        if (!res.ok) throw new Error('Ошибка сохранения');
        return res.json();
      })
      .then(() => {
        setSnackbar({ open: true, message: 'Место сохранено', severity: 'success' });
        fetchSeats();
        handleClose();
      })
      .catch(() => setSnackbar({ open: true, message: 'Ошибка сохранения', severity: 'error' }));
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: 40 }}>
      <Typography variant="h4" gutterBottom>Места</Typography>
      <Button variant="contained" color="primary" style={{ marginBottom: 16 }} onClick={() => handleOpen()}>
        Добавить место
      </Button>
      <Paper>
        {loading ? <CircularProgress /> : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Метка</TableCell>
                <TableCell>Тип места</TableCell>
                <TableCell>ID комнаты</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {seats.map(seat => (
                <TableRow key={seat.id}>
                  <TableCell>{seat.id}</TableCell>
                  <TableCell>{seat.label}</TableCell>
                  <TableCell>{seat.seatType}</TableCell>
                  <TableCell>{seat.roomId}</TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined" onClick={() => handleOpen(seat)}>Редактировать</Button>
                    <Button size="small" color="error" variant="outlined" style={{ marginLeft: 8 }}>Удалить</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editSeat ? 'Редактировать место' : 'Добавить место'}</DialogTitle>
        <DialogContent>
          <TextField label="Метка" name="label" value={form.label} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="Тип места" name="type" value={form.type} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="ID комнаты" name="roomId" value={form.roomId} onChange={handleChange} fullWidth margin="normal" required />
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

export default SeatsPage;
