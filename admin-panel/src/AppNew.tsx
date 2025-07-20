import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './utils/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPageFixed from './pages/DashboardPageFixed';
import { UserRoles } from './types';

// Создаем тему Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

// Компонент для защищенных маршрутов
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRoles[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles }) => {
  const { user, hasAnyRole } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRoles && requiredRoles.length > 0) {
    if (!hasAnyRole(requiredRoles)) {
      console.log('Access denied. Required roles:', requiredRoles, 'User roles:', user.roles);
      return <Navigate to="/login" />;
    }
  }

  return <>{children}</>;
};

// Главный компонент приложения
const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/dashboard/*" 
              element={
                <ProtectedRoute requiredRoles={[UserRoles.SUPER_ADMIN, UserRoles.ADMIN]}>
                  <DashboardPageFixed />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
