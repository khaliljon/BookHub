import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert } from '@mui/material';
import React from 'react';
import { Container, Typography } from '@mui/material';

const LoginPage: React.FC = () => (
  <Container maxWidth="xs" style={{ marginTop: 80 }}>
    <Typography variant="h4" align="center" gutterBottom>
      Вход в админ-панель
    </Typography>
    <Typography align="center" color="textSecondary">
      Авторизация будет добавлена позже
    </Typography>
  </Container>
);

export default LoginPage;
