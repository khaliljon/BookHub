import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import { Club } from '../types';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  TextField,
  MenuItem,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Star as StarIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  TrendingUp,
} from '@mui/icons-material';

const ClubsPage: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterCity, setFilterCity] = useState('all');

  useEffect(() => {
    const fetchClubs = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await apiService.getClubs(1, 100);
        setClubs(response.items || []);
      } catch (err) {
        setError('Ошибка загрузки клубов');
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  const filteredClubs = clubs.filter((club: any) =>
    filterCity === 'all' || club.city === filterCity
  );
  const cities = ['all', ...Array.from(new Set(clubs.map((club: any) => club.city)))];

  // Пример статистики: количество клубов и залов
  const totalClubs = clubs.length;
  const totalHalls = clubs.reduce((sum, club) => sum + (club.halls ? club.halls.length : 0), 0);
  // Placeholders for unavailable stats (future: fetch from backend)
  const totalRevenue = 0; // TODO: Aggregate from bookings/payments
  const totalBookings = 0; // TODO: Aggregate from bookings
  const avgRating = 0; // TODO: Aggregate from ratings if available

  return (
    <Box sx={{ p: 3 }}>
      {/* Заголовок */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
          🏢 Управление клубами
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#666' }}>
          Сеть игровых клубов по всему Казахстану
        </Typography>
      </Box>

      {/* Общая статистика */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            backgroundColor: '#1976d2',
            color: 'white',
            borderRadius: 2,
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {totalClubs}
                  </Typography>
                  <Typography variant="body2">
                    Всего клубов
                  </Typography>
                </Box>
                <LocationIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            backgroundColor: '#2e7d32',
            color: 'white',
            borderRadius: 2,
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    ₸{(totalRevenue / 1000000).toFixed(1)}M
                  </Typography>
                  <Typography variant="body2">
                    Общий доход
                  </Typography>
                </Box>
                <MoneyIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            backgroundColor: '#ed6c02',
            color: 'white',
            borderRadius: 2,
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {totalHalls}
                  </Typography>
                  <Typography variant="body2">
                    Всего залов
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            backgroundColor: '#9c27b0',
            color: 'white',
            borderRadius: 2,
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {avgRating.toFixed(1)}
                  </Typography>
                  <Typography variant="body2">
                    Средний рейтинг
                  </Typography>
                </Box>
                <StarIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Фильтры и кнопка добавления */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <TextField
          select
          size="small"
          label="Фильтр по городу"
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="all">Все города</MenuItem>
          {cities.slice(1).map((city) => (
            <MenuItem key={city} value={city}>{city}</MenuItem>
          ))}
        </TextField>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ borderRadius: 2 }}
        >
          Добавить клуб
        </Button>
      </Box>

      {/* Таблица клубов */}
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            📋 Список клубов
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Клуб</TableCell>
                  <TableCell>Локация</TableCell>
                  <TableCell>Контакты</TableCell>
                  <TableCell>Статистика</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredClubs.map((club) => (
                  <TableRow key={club.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                    <TableCell>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {club.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {club.description}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <StarIcon sx={{ fontSize: 16, color: '#ffa726', mr: 0.5 }} />
                          <Typography variant="caption">
                            {/* No rating property, so just show halls count */}
                            {club.halls.length} {club.halls.length === 1 ? 'зал' : 'зала'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationIcon sx={{ fontSize: 16, mr: 1, color: '#666' }} />
                        <Typography variant="body2">
                          {club.city}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {club.address}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PhoneIcon sx={{ fontSize: 16, mr: 1, color: '#666' }} />
                        <Typography variant="body2">
                          {club.phone}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ScheduleIcon sx={{ fontSize: 16, mr: 1, color: '#666' }} />
                        <Typography variant="caption" color="text.secondary">
                          {club.openingHours}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {/* No monthlyRevenue or totalBookings properties, so show placeholders or remove */}
                        <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                          —
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          —
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Chip 
                        label={club.isActive ? 'Активен' : 'Неактивен'}
                        color={club.isActive ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Просмотр">
                          <IconButton size="small" sx={{ color: '#1976d2' }}>
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Редактировать">
                          <IconButton size="small" sx={{ color: '#ed6c02' }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Удалить">
                          <IconButton size="small" sx={{ color: '#d32f2f' }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ClubsPage;
