import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, CircularProgress } from '@mui/material';

interface Payment {
  id: number;
  bookingId: number;
  amount: number;
  method: string;
  status: string;
}

const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editPayment, setEditPayment] = useState<Payment | null>(null);
  const [form, setForm] = useState({ bookingId: '', amount: '', method: '', status: '' });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success'|'error' }>({ open: false, message: '', severity: 'success' });

  const fetchPayments = () => {
    setLoading(true);
    fetch('/api/payments')
      .then(res => res.json())
      .then(data => {
        setPayments(data);
        setLoading(false);
      })
      .catch(() => {
        setSnackbar({ open: true, message: 'Ошибка загрузки платежей', severity: 'error' });
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleOpen = (payment?: Payment) => {
    if (payment) {
      setEditPayment(payment);
      setForm({ bookingId: String(payment.bookingId), amount: String(payment.amount), method: payment.method, status: payment.status });
    } else {
      setEditPayment(null);
      setForm({ bookingId: '', amount: '', method: '', status: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditPayment(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!form.bookingId || !form.amount || !form.method || !form.status) {
      setSnackbar({ open: true, message: 'Заполните все поля', severity: 'error' });
      return;
    }
    const method = editPayment ? 'PUT' : 'POST';
    const url = editPayment ? `/api/payments/${editPayment.id}` : '/api/payments';
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, amount: Number(form.amount), bookingId: Number(form.bookingId) })
    })
      .then(res => {
        if (!res.ok) throw new Error('Ошибка сохранения');
        return res.json();
      })
      .then(() => {
        setSnackbar({ open: true, message: 'Платеж сохранен', severity: 'success' });
        fetchPayments();
        handleClose();
      })
      .catch(() => setSnackbar({ open: true, message: 'Ошибка сохранения', severity: 'error' }));
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: 40 }}>
      <Typography variant="h4" gutterBottom>Платежи</Typography>
      <Button variant="contained" color="primary" style={{ marginBottom: 16 }} onClick={() => handleOpen()}>
        Добавить платеж
      </Button>
      <Paper>
        {loading ? <CircularProgress /> : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>ID бронирования</TableCell>
                <TableCell>Сумма</TableCell>
                <TableCell>Метод</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map(payment => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.id}</TableCell>
                  <TableCell>{payment.bookingId}</TableCell>
                  <TableCell>{payment.amount}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell>{payment.status}</TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined" onClick={() => handleOpen(payment)}>Редактировать</Button>
                    <Button size="small" color="error" variant="outlined" style={{ marginLeft: 8 }}>Удалить</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editPayment ? 'Редактировать платеж' : 'Добавить платеж'}</DialogTitle>
        <DialogContent>
          <TextField label="ID бронирования" name="bookingId" value={form.bookingId} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="Сумма" name="amount" value={form.amount} onChange={handleChange} fullWidth margin="normal" required type="number" />
          <TextField label="Метод" name="method" value={form.method} onChange={handleChange} fullWidth margin="normal" required />
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

export default PaymentsPage;
