import React from 'react';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

const pages = [
  { path: '/dashboard', label: 'Главная' },
  { path: '/users', label: 'Пользователи' },
  { path: '/roles', label: 'Роли' },
  { path: '/clubs', label: 'Клубы' },
  { path: '/venues', label: 'Заведения' },
  { path: '/rooms', label: 'Комнаты' },
  { path: '/seats', label: 'Места' },
  { path: '/bookings', label: 'Бронирования' },
  { path: '/payments', label: 'Платежи' },
  { path: '/notifications', label: 'Уведомления' },
  { path: '/analytics', label: 'Аналитика' },
];

const Sidebar: React.FC = () => (
  <Drawer variant="permanent" anchor="left">
    <List>
      {pages.map(page => (
        <ListItem button key={page.path} component={Link} to={page.path}>
          <ListItemText primary={page.label} />
        </ListItem>
      ))}
    </List>
  </Drawer>
);

export default Sidebar;
