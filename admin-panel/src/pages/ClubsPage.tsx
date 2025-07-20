import React, { useState } from 'react';
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
  const [filterCity, setFilterCity] = useState('all');

  // Моковые данные клубов
  const clubs = [
    {
      id: 1,
      name: 'CyberArena Almaty',
      city: 'Алматы',
      address: 'ул. Абая 150/230',
      description: 'Современный игровой клуб с топовыми компьютерами',
      phone: '+7 701 234 5678',
      openingHours: '10:00-02:00',
      isActive: true,
      rating: 4.8,
      monthlyRevenue: 890000,
      totalBookings: 156,
      halls: 3,
    },
    {
      id: 2,
      name: 'GameZone Astana',
      city: 'Астана',
      address: 'пр. Кабанбай батыра 53',
      description: 'Премиальный игровой клуб в центре столицы',
      phone: '+7 702 345 6789',
      openingHours: '09:00-01:00',
      isActive: true,
      rating: 4.7,
      monthlyRevenue: 765000,
      totalBookings: 142,
      halls: 2,
    },
    {
      id: 3,
      name: 'ProGaming Shymkent',
      city: 'Шымкент',
      address: 'ул. Кунаева 12',
      description: 'Клуб для настоящих геймеров с турнирами',
      phone: '+7 703 456 7890',
      openingHours: '11:00-00:00',
      isActive: true,
      rating: 4.6,
      monthlyRevenue: 523000,
      totalBookings: 98,
      halls: 2,
    },
    {
      id: 4,
      name: 'NetCafe Pavlodar',
      city: 'Павлодар',
      address: 'ул. Торайгырова 45',
      description: 'Уютный игровой клуб с семейной атмосферой',
      phone: '+7 704 567 8901',
      openingHours: '12:00-23:00',
      isActive: true,
      rating: 4.5,
      monthlyRevenue: 324000,
      totalBookings: 76,
      halls: 1,
    },
    {
      id: 5,
      name: 'Cyber Club Aktobe',
      city: 'Актобе',
      address: 'пр. Абилкайыр хана 89',
      description: 'Новый современный клуб с игровыми автоматами',
      phone: '+7 705 678 9012',
      openingHours: '10:00-01:00',
      isActive: false,
      rating: 4.3,
      monthlyRevenue: 198000,
      totalBookings: 45,
      halls: 1,
    },
  ];

  const totalRevenue = clubs.reduce((sum, club) => sum + club.monthlyRevenue, 0);
  const totalBookings = clubs.reduce((sum, club) => sum + club.totalBookings, 0);
  const avgRating = clubs.reduce((sum, club) => sum + club.rating, 0) / clubs.length;

  const filteredClubs = clubs.filter(club => 
    filterCity === 'all' || club.city === filterCity
  );

  const cities = ['all', ...Array.from(new Set(clubs.map(club => club.city)))];

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
                    {clubs.length}
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
                    {totalBookings}
                  </Typography>
                  <Typography variant="body2">
                    Бронирования
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
                            {club.rating} • {club.halls} {club.halls === 1 ? 'зал' : 'зала'}
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
                        <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                          ₸{(club.monthlyRevenue / 1000).toFixed(0)}K/мес
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {club.totalBookings} бронирований
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
