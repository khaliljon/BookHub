import React from 'react';
import { Container, Typography } from '@mui/material';

export {};

const DashboardPage: React.FC = () => (
  <Container maxWidth="lg" style={{ marginTop: 40 }}>
    <Typography variant="h3" align="center" gutterBottom>
      Админ-панель BookHub
    </Typography>
    <Typography align="center" color="textSecondary">
      Добро пожаловать! Здесь будет основной функционал админки.
    </Typography>
  </Container>
);

export default DashboardPage;
