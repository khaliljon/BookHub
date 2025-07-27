import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import RolesPage from './pages/RolesPage';
import ClubsPage from './pages/ClubsPage';
import VenuesPage from './pages/VenuesPage';
import RoomsPage from './pages/RoomsPage';
import SeatsPage from './pages/SeatsPage';
import BookingsPage from './pages/BookingsPage';
import PaymentsPage from './pages/PaymentsPage';
import NotificationsPage from './pages/NotificationsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import Sidebar from './components/Sidebar';

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


const App: React.FC = () => (
  <Router>
    <CssBaseline />
    <Sidebar />
    <div style={{ marginLeft: 240, padding: 32 }}>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/clubs" element={<ClubsPage />} />
        <Route path="/venues" element={<VenuesPage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/seats" element={<SeatsPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="*" element={<DashboardPage />} />
      </Routes>
    </div>
  </Router>
);

export default App;
