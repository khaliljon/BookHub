import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  EventSeat as EventSeatIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { useAuth } from '../../utils/AuthContext';
import { UserRoles } from '../../types';

const OverviewPage: React.FC = () => {
  const { user } = useAuth();

  const getRoleDisplayName = (role: UserRoles): string => {
    const roleNames = {
      [UserRoles.SUPER_ADMIN]: 'Супер Администратор',
      [UserRoles.ADMIN]: 'Администратор', 
      [UserRoles.MANAGER]: 'Менеджер',
      [UserRoles.USER]: 'Пользователь',
    };
    return roleNames[role] || role;
  };

  const statsCards = [
    { title: 'Пользователи', value: '1,234', icon: <PeopleIcon />, color: 'primary' },
    { title: 'Клубы', value: '45', icon: <BusinessIcon />, color: 'success' },
    { title: 'Бронирования', value: '156', icon: <EventSeatIcon />, color: 'info' },
    { title: 'Доход', value: '₽485,230', icon: <PaymentIcon />, color: 'warning' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Добро пожаловать, {user?.fullName}!
      </Typography>
      
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Ваши роли: {user?.roles?.map((role: any) => getRoleDisplayName(role.name || role)).join(', ')}
      </Typography>

      <Grid container spacing={3} mt={2}>
        {statsCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" variant="overline">
                      {card.title}
                    </Typography>
                    <Typography variant="h4">
                      {card.value}
                    </Typography>
                  </Box>
                  <Box color={`${card.color}.main`}>
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Быстрые действия
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Выберите раздел в меню для управления системой
        </Typography>
      </Box>
    </Box>
  );
};

export default OverviewPage;
