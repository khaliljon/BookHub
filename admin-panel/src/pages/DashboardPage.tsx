import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  EventSeat as EventSeatIcon,
  Payment as PaymentIcon,
  Notifications as NotificationsIcon,
  Computer as ComputerIcon,
  Photo as PhotoIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AccountCircle,
  Security as SecurityIcon,
  Psychology as PsychologyIcon,
  AccountBalance as AccountBalanceIcon,
  PeopleAlt as PeopleAltIcon,
  Campaign as CampaignIcon,
} from '@mui/icons-material';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { UserRoles } from '../types';
import OverviewPage from './OverviewPage';
import UsersPage from './UsersPage';
import ClubsPage from './ClubsPage';
import BookingsPage from './BookingsPage';
import PaymentsPage from './PaymentsPage';
import RolesPage from './RolesPage';
import NotificationsPage from './NotificationsPage';
import AdvancedAnalyticsPage from './AdvancedAnalyticsPage';
import FinancialAnalyticsPage from './FinancialAnalyticsPage';
import CustomerIntelligencePage from './CustomerIntelligencePage';
import MarketingIntelligencePage from './MarketingIntelligencePage';

const drawerWidth = 240;

interface NavigationItem {
  title: string;
  path: string;
  icon: React.ReactElement;
  requiredRoles: UserRoles[];
}

const navigationItems: NavigationItem[] = [
  {
    title: 'Обзор',
    path: '/dashboard',
    icon: <DashboardIcon />,
    requiredRoles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN, UserRoles.MANAGER],
  },
  {
    title: 'AI Аналитика',
    path: '/dashboard/analytics',
    icon: <PsychologyIcon />,
    requiredRoles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN],
  },
  {
    title: 'Финансы',
    path: '/dashboard/financial',
    icon: <AccountBalanceIcon />,
    requiredRoles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN],
  },
  {
    title: 'Клиенты ИИ',
    path: '/dashboard/customers',
    icon: <PeopleAltIcon />,
    requiredRoles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN, UserRoles.MANAGER],
  },
  {
    title: 'Маркетинг ИИ',
    path: '/dashboard/marketing',
    icon: <CampaignIcon />,
    requiredRoles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN, UserRoles.MANAGER],
  },
  {
    title: 'Пользователи',
    path: '/dashboard/users',
    icon: <PeopleIcon />,
    requiredRoles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN],
  },
  {
    title: 'Клубы',
    path: '/dashboard/clubs',
    icon: <BusinessIcon />,
    requiredRoles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN, UserRoles.MANAGER],
  },
  {
    title: 'Бронирования',
    path: '/dashboard/bookings',
    icon: <EventSeatIcon />,
    requiredRoles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN, UserRoles.MANAGER],
  },
  {
    title: 'Платежи',
    path: '/dashboard/payments',
    icon: <PaymentIcon />,
    requiredRoles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN],
  },
  {
    title: 'Роли и права',
    path: '/dashboard/roles',
    icon: <SecurityIcon />,
    requiredRoles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN],
  },
  {
    title: 'Уведомления',
    path: '/dashboard/notifications',
    icon: <NotificationsIcon />,
    requiredRoles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN, UserRoles.MANAGER],
  },
  {
    title: 'Системные логи',
    path: '/dashboard/audit-logs',
    icon: <AssessmentIcon />,
    requiredRoles: [UserRoles.SUPER_ADMIN],
  },
];

const DashboardPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout, hasAnyRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };

  const getVisibleNavigationItems = () => {
    return navigationItems.filter(item => 
      hasAnyRole(item.requiredRoles)
    );
  };

  const getRoleDisplayName = (role: UserRoles): string => {
    const roleNames = {
      [UserRoles.SUPER_ADMIN]: 'Супер Администратор',
      [UserRoles.ADMIN]: 'Администратор',
      [UserRoles.MANAGER]: 'Менеджер',
      [UserRoles.USER]: 'Пользователь',
    };
    return roleNames[role] || role;
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Oyna Admin
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {getVisibleNavigationItems().map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Панель управления
          </Typography>
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem disabled>
                <Box>
                  <Typography variant="subtitle1">{user?.email}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {user?.roles?.map((role: any) => {
                      const roleName = typeof role === 'string' ? role : role.name;
                      return getRoleDisplayName(roleName as UserRoles);
                    }).join(', ')}
                  </Typography>
                </Box>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Выйти
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/analytics" element={<AdvancedAnalyticsPage />} />
          <Route path="/financial" element={<FinancialAnalyticsPage />} />
          <Route path="/customers" element={<CustomerIntelligencePage />} />
          <Route path="/marketing" element={<MarketingIntelligencePage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/clubs" element={<ClubsPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default DashboardPage;
