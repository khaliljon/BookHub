import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { useAuth } from '../utils/AuthContext';
import { apiService } from '../services/api';
import { LoginRequest } from '../types';

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginRequest>({
    emailOrPhone: '',
    password: ''
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await apiService.login(credentials);
      login(response.user, response.token);
      // Перенаправление будет обработано в App.tsx
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'Ошибка входа в систему. Проверьте данные и попробуйте снова.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof LoginRequest) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCredentials(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Card sx={{ minWidth: 400, p: 2 }}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3
              }}
            >
              <LockOutlined sx={{ m: 1, bgcolor: 'primary.main', color: 'white', p: 1, borderRadius: '50%' }} />
              <Typography component="h1" variant="h4" gutterBottom>
                Админ-панель
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Система управления бронированием
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="emailOrPhone"
                label="Email или телефон"
                name="emailOrPhone"
                autoComplete="username"
                autoFocus
                value={credentials.emailOrPhone}
                onChange={handleChange('emailOrPhone')}
                disabled={isLoading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Пароль"
                type="password"
                id="password"
                autoComplete="current-password"
                value={credentials.password}
                onChange={handleChange('password')}
                disabled={isLoading}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={isLoading || !credentials.emailOrPhone || !credentials.password}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Войти в систему'
                )}
              </Button>
            </Box>

            <Box mt={3}>
              <Typography variant="body2" color="text.secondary" align="center">
                Доступные роли:
              </Typography>
              <Typography variant="caption" display="block" align="center" mt={1}>
                SuperAdmin • Admin • Manager • User
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default LoginPage;
