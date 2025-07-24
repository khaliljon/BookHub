import React, { useState, useEffect, ChangeEvent, MouseEvent } from 'react';
import apiService from '../services/api';
import { Club, Hall, ClubPhoto } from '../types';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  GlobalStyles,
  Checkbox,
  FormControlLabel,
  Switch,
  InputAdornment,
  TableSortLabel,
  Toolbar,
  Popover,
  Divider,
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
  Email as EmailIcon,
  AddAPhoto as AddAPhotoIcon,
  Search as SearchIcon,
  InfoOutlined as InfoOutlinedIcon,
} from '@mui/icons-material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'yet-another-react-lightbox/styles.css';
import Lightbox from 'yet-another-react-lightbox';

const ClubsPage: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterCity, setFilterCity] = useState('all');
  const [viewClub, setViewClub] = useState<Club | null>(null);
  const [editClub, setEditClub] = useState<Club | null>(null);
  const [addClubOpen, setAddClubOpen] = useState(false);
  const [editClubPhotos, setEditClubPhotos] = useState<ClubPhoto[]>([]);
  const [editClubHalls, setEditClubHalls] = useState<Hall[]>([]);
  const [newPhoto, setNewPhoto] = useState<Partial<ClubPhoto>>({ photoUrl: '', description: '' });
  const [addPhotoOpen, setAddPhotoOpen] = useState(false);
  const [newHall, setNewHall] = useState<Partial<Hall>>({ name: '', description: '' });
  const [addHallOpen, setAddHallOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [editHall, setEditHall] = useState<Hall | null>(null);
  const [tab, setTab] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [orderBy, setOrderBy] = useState<'name' | 'city' | 'status'>('name');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedClubIds, setSelectedClubIds] = useState<number[]>([]);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [quickViewAnchor, setQuickViewAnchor] = useState<null | HTMLElement>(null);
  const [quickViewClub, setQuickViewClub] = useState<Club | null>(null);
  const [hallLightboxOpen, setHallLightboxOpen] = useState(false);
  const [hallLightboxImages, setHallLightboxImages] = useState<string[]>([]);
  const [hallLightboxIndex, setHallLightboxIndex] = useState(0);
  const [logoLightboxOpen, setLogoLightboxOpen] = useState(false);
  const [clubPhotoLightboxOpen, setClubPhotoLightboxOpen] = useState<number | false>(false);
  const [quickViewHallLightboxOpen, setQuickViewHallLightboxOpen] = useState(false);
  const [quickViewHallLightboxImages, setQuickViewHallLightboxImages] = useState<string[]>([]);
  const [quickViewHallLightboxIndex, setQuickViewHallLightboxIndex] = useState(0);

  // Универсальная функция загрузки клубов с фото
  const fetchClubsWithPhotos = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiService.getClubs();
      const clubsWithPhotos = await Promise.all(
        response.map(async (club) => {
          const clubPhotos = await apiService.getClubPhotos(club.id);
          return { ...club, clubPhotos };
        })
      );
      setClubs(clubsWithPhotos);
    } catch (err) {
      setError('Ошибка загрузки клубов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubsWithPhotos();
  }, []);

  const filteredClubs = clubs.filter((club: Club) => {
    const matchesCity = filterCity === 'all' || club.city === filterCity;
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? club.isActive : !club.isActive);
    const matchesSearch =
      searchTerm.trim() === '' ||
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCity && matchesStatus && matchesSearch;
  });
  const cities = ['all', ...Array.from(new Set(clubs.map((club: Club) => club.city)))];

  // Пример статистики: количество клубов и залов
  const totalClubs = clubs.length;
  const totalHalls = clubs.reduce((sum, club) => sum + (club.halls ? club.halls.length : 0), 0);
  // Placeholders for unavailable stats (future: fetch from backend)
  const totalRevenue = 0; // TODO: Aggregate from bookings/payments
  const totalBookings = 0; // TODO: Aggregate from bookings
  const avgRating = 0; // TODO: Aggregate from ratings if available

  const handleView = async (club: Club) => {
    const halls = await apiService.getClubHalls(club.id);
    const clubPhotos = await apiService.getClubPhotos(club.id);
    setViewClub({ ...club, halls, clubPhotos });
  };
  const handleEdit = async (club: Club) => {
    setEditClub(club);
    const photos = await apiService.getClubPhotos(club.id);
    setEditClubPhotos(photos);
    const halls = await apiService.getClubHalls(club.id);
    setEditClubHalls(halls);
  };
  const handleAddPhoto = async () => {
    if (editClub && newPhoto.photoUrl) {
      await apiService.addClubPhoto({
        clubId: editClub.id,
        photoUrl: newPhoto.photoUrl,
        description: newPhoto.description,
        uploadedAt: new Date().toISOString(),
      });
      setAddPhotoOpen(false);
      setNewPhoto({ photoUrl: '', description: '' });
      const photos = await apiService.getClubPhotos(editClub.id);
      setEditClubPhotos(photos);
      setSnackbar({ open: true, message: 'Фото добавлено', severity: 'success' });
    }
  };
  const handleDeletePhoto = async (photoId: number) => {
    if (editClub) {
      await apiService.deleteClubPhoto(photoId);
      const photos = await apiService.getClubPhotos(editClub.id);
      setEditClubPhotos(photos);
      setSnackbar({ open: true, message: 'Фото удалено', severity: 'success' });
    }
  };
  const handlePhotoFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await apiService.uploadClubPhoto(file);
      setNewPhoto({ ...newPhoto, photoUrl: url });
      setSnackbar({ open: true, message: 'Фото загружено', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Ошибка загрузки файла', severity: 'error' });
    }
  };
  const handleAddHall = async () => {
    if (editClub && newHall.name) {
      await apiService.createHall({ ...newHall, clubId: editClub.id, photoUrls: [] });
      setAddHallOpen(false);
      setNewHall({ name: '', description: '' });
      const halls = await apiService.getClubHalls(editClub.id);
      setEditClubHalls(halls);
      setSnackbar({ open: true, message: 'Зал добавлен', severity: 'success' });
    }
  };
  const handleDeleteHall = async (hallId: number) => {
    if (editClub) {
      await apiService.deleteHall(hallId);
      const halls = await apiService.getClubHalls(editClub.id);
      setEditClubHalls(halls);
      setSnackbar({ open: true, message: 'Зал удалён', severity: 'success' });
    }
  };

  const handleEditSave = async (club: Club | null) => {
    if (!club) return;
    try {
      const clubData = {
        id: club.id, // обязательно для PUT
        name: club.name,
        city: club.city,
        address: club.address,
        description: club.description,
        phone: club.phone,
        email: club.email,
        openingHours: club.openingHours,
        isActive: club.isActive,
        isDeleted: club.isDeleted ?? false,
        logoUrl: club.logoUrl ?? ''
      };
      await apiService.updateClub(club.id, clubData);
      await fetchClubsWithPhotos();
      setEditClub(null);
      setSnackbar({ open: true, message: 'Клуб обновлён', severity: 'success' });
    } catch (e) {
      setSnackbar({ open: true, message: 'Ошибка при обновлении клуба', severity: 'error' });
    }
  };

  const handleSort = (column: 'name' | 'city' | 'status') => {
    if (orderBy === column) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(column);
      setOrder('asc');
    }
  };

  const sortedClubs = [...filteredClubs].sort((a, b) => {
    let aValue: string | boolean = '';
    let bValue: string | boolean = '';
    if (orderBy === 'name') {
      aValue = a.name;
      bValue = b.name;
    } else if (orderBy === 'city') {
      aValue = a.city;
      bValue = b.city;
    } else if (orderBy === 'status') {
      aValue = a.isActive;
      bValue = b.isActive;
    }
    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedClubIds(sortedClubs.map(club => club.id));
    } else {
      setSelectedClubIds([]);
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    setSelectedClubIds(prev => checked ? [...prev, id] : prev.filter(cid => cid !== id));
  };

  const handleBulkSetActive = async (isActive: boolean) => {
    await Promise.all(selectedClubIds.map(async id => {
      const club = clubs.find(c => c.id === id);
      if (club) {
        await apiService.updateClub(club.id, {
          id: club.id,
          name: club.name,
          city: club.city,
          address: club.address,
          description: club.description,
          phone: club.phone,
          email: club.email,
          openingHours: club.openingHours,
          isActive,
          isDeleted: club.isDeleted ?? false,
          logoUrl: club.logoUrl ?? ''
        });
      }
    }));
    await fetchClubsWithPhotos();
    setSelectedClubIds([]);
  };

  const handleBulkDelete = async () => {
    await Promise.all(selectedClubIds.map(async id => {
      await apiService.deleteClub(id);
    }));
    await fetchClubsWithPhotos();
    setSelectedClubIds([]);
  };

  const handleQuickViewOpen = (event: React.MouseEvent<HTMLElement>, club: Club) => {
    setQuickViewAnchor(event.currentTarget);
    setQuickViewClub(club);
  };
  const handleQuickViewClose = () => {
    setQuickViewAnchor(null);
    setQuickViewClub(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <GlobalStyles styles={{
        '.swiper-slide:focus, .swiper-slide:focus-visible': {
          outline: 'none !important',
          background: 'transparent !important',
          boxShadow: 'none !important',
        },
      }} />
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Поиск по клубам..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 220 }}
          />
          <TextField
            select
            size="small"
            label="Город"
            value={filterCity}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFilterCity(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">Все города</MenuItem>
            {cities.slice(1).map((city) => (
              <MenuItem key={city} value={city}>{city}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label="Статус"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">Все</MenuItem>
            <MenuItem value="active">Активен</MenuItem>
            <MenuItem value="inactive">Неактивен</MenuItem>
          </TextField>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={multiSelectMode ? 'contained' : 'outlined'}
            color={multiSelectMode ? 'primary' : 'inherit'}
            onClick={() => {
              setMultiSelectMode(!multiSelectMode);
              setSelectedClubIds([]);
            }}
          >
            {multiSelectMode ? 'Отменить выбор' : 'Множественный выбор'}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ borderRadius: 2 }}
            onClick={() => setAddClubOpen(true)}
          >
            Добавить клуб
          </Button>
        </Box>
      </Box>

      {/* Bulk actions toolbar */}
      {multiSelectMode && selectedClubIds.length > 0 && (
        <Toolbar sx={{ background: '#f5f5f5', borderRadius: 2, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1">Выбрано: {selectedClubIds.length}</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" color="success" onClick={() => handleBulkSetActive(true)}>Включить</Button>
            <Button variant="outlined" color="warning" onClick={() => handleBulkSetActive(false)}>Выключить</Button>
            <Button variant="outlined" color="error" onClick={handleBulkDelete}>Удалить</Button>
          </Box>
        </Toolbar>
      )}

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
                  {multiSelectMode && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedClubIds.length === sortedClubs.length && sortedClubs.length > 0}
                        indeterminate={selectedClubIds.length > 0 && selectedClubIds.length < sortedClubs.length}
                        onChange={e => handleSelectAll(e.target.checked)}
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'name'}
                      direction={orderBy === 'name' ? order : 'asc'}
                      onClick={() => handleSort('name')}
                    >
                      Клуб
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'city'}
                      direction={orderBy === 'city' ? order : 'asc'}
                      onClick={() => handleSort('city')}
                    >
                      Локация
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Контакты</TableCell>
                  <TableCell>Статистика</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'status'}
                      direction={orderBy === 'status' ? order : 'asc'}
                      onClick={() => handleSort('status')}
                    >
                      Статус
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedClubs.map((club) => (
                  <TableRow key={club.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                    {multiSelectMode && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedClubIds.includes(club.id)}
                          onChange={e => handleSelectOne(club.id, e.target.checked)}
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          src={club.logoUrl ? club.logoUrl : undefined}
                          alt={club.name}
                          sx={{ width: 40, height: 40, mr: 1 }}
                        >
                          {!club.logoUrl && club.name[0]}
                        </Avatar>
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
                              {(club.halls?.length ?? 0)} {(club.halls?.length === 1 ? 'зал' : 'зала')}
                            </Typography>
                          </Box>
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          label={club.isActive ? 'Активен' : 'Неактивен'}
                          color={club.isActive ? 'success' : 'error'}
                          size="small"
                        />
                        <Tooltip title={club.isActive ? 'Выключить клуб' : 'Включить клуб'}>
                          <Switch
                            checked={club.isActive}
                            onChange={async (e) => {
                              await apiService.updateClub(club.id, {
                                id: club.id,
                                name: club.name,
                                city: club.city,
                                address: club.address,
                                description: club.description,
                                phone: club.phone,
                                email: club.email,
                                openingHours: club.openingHours,
                                isActive: e.target.checked,
                                isDeleted: club.isDeleted ?? false,
                                logoUrl: club.logoUrl ?? ''
                              });
                              await fetchClubsWithPhotos();
                            }}
                            color="primary"
                          />
                        </Tooltip>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Быстрый просмотр">
                          <IconButton size="small" sx={{ color: '#1976d2' }} onClick={e => handleQuickViewOpen(e, club)}>
                            <InfoOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Просмотр">
                          <IconButton size="small" sx={{ color: '#1976d2' }} onClick={async () => await handleView(club)}>
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Редактировать">
                          <IconButton size="small" sx={{ color: '#ed6c02' }} onClick={() => handleEdit(club)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Удалить">
                          <IconButton size="small" sx={{ color: '#d32f2f' }} onClick={async () => {
                            try {
                              await apiService.deleteClub(club.id);
                              await fetchClubsWithPhotos();
                              setSnackbar({ open: true, message: 'Клуб удалён', severity: 'success' });
                            } catch (e) {
                              setSnackbar({ open: true, message: 'Ошибка при удалении клуба', severity: 'error' });
                            }
                          }}>
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

      {/* Модалка просмотра клуба */}
      {viewClub && (
        <Dialog open={true} onClose={() => setViewClub(null)} maxWidth="md" fullWidth sx={{ '& .MuiDialog-paper': { borderRadius: 4, minWidth: 520, maxWidth: 700, p: 3 } }}>
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                src={viewClub.clubPhotos?.[0]?.photoUrl ? `http://localhost:3001${viewClub.clubPhotos[0].photoUrl}` : undefined}
                sx={{ width: 64, height: 64, boxShadow: 2 }}
                variant="rounded"
              />
              <Box>
                <Typography variant="h5">{viewClub.name}</Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {viewClub.city}
                </Typography>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ overflowX: 'hidden', pt: 2, pb: 1, px: 3 }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
              <Tab label="Общее" />
              <Tab label="Залы" />
              <Tab label="Фото" />
              <Tab label="Контакты" />
            </Tabs>
            {tab === 0 && (
              <Box>
                <Typography gutterBottom>
                  <LocationIcon fontSize="small" /> {viewClub.address}
                </Typography>
                <Typography gutterBottom>
                  <ScheduleIcon fontSize="small" /> {viewClub.openingHours}
                </Typography>
                <Typography gutterBottom>
                  {viewClub.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Статус: {viewClub.isActive ? 'Активен' : 'Неактивен'}
                </Typography>
              </Box>
            )}
            {tab === 1 && (
              <Box>
                {viewClub.halls?.length ? (
                  <Grid container spacing={2}>
                    {viewClub.halls.map((room, idx) => (
                      <Grid item xs={12} md={6} key={room.id}>
                        <Box p={2} boxShadow={1} borderRadius={2}>
                          <Typography variant="subtitle1">{room.name}</Typography>
                          <Typography variant="body2">{room.description}</Typography>
                          {/* Добавляем вывод фото залов */}
                          {room.photoUrls?.length ? (
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                              {(room.photoUrls || []).map((url, i) => (
                                <img
                                  key={i}
                                  src={url.startsWith('http') ? url : `http://localhost:3001${url}`}
                                  alt="hall"
                                  style={{
                                    width: 120,
                                    height: 90,
                                    objectFit: 'cover',
                                    borderRadius: 8,
                                    border: '1px solid #eee',
                                    marginRight: 8,
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => {
                                    setQuickViewHallLightboxImages((room.photoUrls || []).map(u => u.startsWith('http') ? u : `http://localhost:3001${u}`));
                                    setQuickViewHallLightboxIndex(i);
                                    setQuickViewHallLightboxOpen(true);
                                  }}
                                />
                              ))}
                            </Box>
                          ) : (
                            <Typography color="text.secondary">Нет фото</Typography>
                          )}
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography color="text.secondary">Нет информации о залах</Typography>
                )}
                {/* Lightbox для фото залов (для этой вкладки) */}
                {quickViewHallLightboxOpen && (
                  <Lightbox
                    open={quickViewHallLightboxOpen}
                    close={() => setQuickViewHallLightboxOpen(false)}
                    index={quickViewHallLightboxIndex}
                    slides={quickViewHallLightboxImages.map(src => ({ src }))}
                  />
                )}
              </Box>
            )}
            {tab === 2 && (
              <Box sx={{ minHeight: 240, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Swiper
                  slidesPerView={1}
                  navigation
                  loop
                  modules={[Navigation]}
                  style={{ width: '100%', maxWidth: 500, margin: '0 auto' }}
                >
                  {viewClub.clubPhotos?.length ? viewClub.clubPhotos.map((photo, idx) => (
                    <SwiperSlide key={photo.id}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box
                          component="img"
                          src={`http://localhost:3001${photo.photoUrl}`}
                          alt={photo.description}
                          tabIndex={-1}
                          sx={{
                            width: '100%',
                            maxWidth: 480,
                            height: 'auto',
                            maxHeight: 350,
                            objectFit: 'contain',
                            borderRadius: 2,
                            boxShadow: 1,
                            margin: '0 auto',
                            background: '#f7f7f7',
                            border: '1px solid #eee',
                            display: 'block',
                            '&:focus': {
                              outline: 'none',
                              background: '#f7f7f7',
                            },
                          }}
                        />
                        {photo.description && (
                          <Typography variant="body2" sx={{ mt: 1, color: '#555', textAlign: 'center', maxWidth: 480 }}>
                            {photo.description}
                          </Typography>
                        )}
                      </Box>
                    </SwiperSlide>
                  )) : (
                    <Box textAlign="center" sx={{ width: '100%' }}>
                      <AddAPhotoIcon fontSize="large" sx={{ color: '#ccc', mb: 1 }} />
                      <Typography>Нет фото</Typography>
                    </Box>
                  )}
                </Swiper>
                {lightboxIndex !== null && viewClub.clubPhotos?.length > 0 && (
                  <Lightbox
                    open={lightboxIndex !== null}
                    close={() => setLightboxIndex(null)}
                    index={lightboxIndex}
                    slides={viewClub.clubPhotos.map((photo, i) => ({ src: `http://localhost:3001${photo.photoUrl}`, description: photo.description }))}
                  />
                )}
              </Box>
            )}
            {tab === 3 && (
              <Box>
                <Typography gutterBottom>
                  <PhoneIcon fontSize="small" /> {viewClub.phone}
                </Typography>
                <Typography gutterBottom>
                  <EmailIcon fontSize="small" /> {viewClub.email}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewClub(null)}>Закрыть</Button>
          </DialogActions>
        </Dialog>
      )}
      {/* Модалка редактирования клуба */}
      <Dialog open={!!editClub} onClose={() => setEditClub(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Редактировать клуб</DialogTitle>
        <DialogContent>
          {editClub && (
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField label="Название" value={editClub.name} onChange={e => setEditClub({...editClub, name: e.target.value})} />
              <TextField label="Город" value={editClub.city} onChange={e => setEditClub({...editClub, city: e.target.value})} />
              <TextField label="Адрес" value={editClub.address} onChange={e => setEditClub({...editClub, address: e.target.value})} />
              <TextField label="Описание" value={editClub.description} onChange={e => setEditClub({...editClub, description: e.target.value})} />
              <TextField label="Телефон" value={editClub.phone} onChange={e => setEditClub({...editClub, phone: e.target.value})} />
              <TextField label="Email" value={editClub.email} onChange={e => setEditClub({...editClub, email: e.target.value})} />
              <TextField label="Время работы" value={editClub.openingHours} onChange={e => setEditClub({...editClub, openingHours: e.target.value})} />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!editClub.isActive}
                    onChange={e => setEditClub({ ...editClub, isActive: e.target.checked })}
                  />
                }
                label="Клуб активен"
                sx={{ mb: 1 }}
              />
              {/* Логотип клуба: */}
              {editClub?.logoUrl ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <img
                    src={editClub.logoUrl}
                    alt="logo"
                    style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '2px solid #eee' }}
                  />
                  <IconButton
                    color="error"
                    size="small"
                    onClick={async () => {
                      if (!editClub) return;
                      setEditClub({ ...editClub, logoUrl: '' });
                      await apiService.updateClub(editClub.id, { ...editClub, logoUrl: '' });
                      setSnackbar({ open: true, message: 'Логотип удалён', severity: 'success' });
                    }}
                    sx={{ border: '1px solid #eee' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  {logoLightboxOpen && (
                    <Lightbox
                      open={logoLightboxOpen}
                      close={() => setLogoLightboxOpen(false)}
                      slides={[{ src: editClub.logoUrl }]}
                    />
                  )}
                </Box>
              ) : (
                <Typography color="text.secondary">Нет логотипа</Typography>
              )}
              <Button variant="outlined" component="label" sx={{ mb: 2 }}>
                Загрузить логотип
                <input type="file" hidden accept="image/*" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file || !editClub) return;
                  const url = await apiService.uploadClubPhoto(file);
                  setEditClub({ ...editClub, logoUrl: url });
                }} />
              </Button>
              {/* Фото клуба: */}
              <Box sx={{ mb: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {editClubPhotos.length === 0 && <Typography color="text.secondary">Нет фото</Typography>}
                {editClubPhotos.map((photo, idx) => (
                  <Box key={photo.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <img
                      src={`http://localhost:3001${photo.photoUrl}`}
                      alt={photo.description}
                      style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 8, border: '2px solid #eee', cursor: 'pointer' }}
                      onClick={() => setClubPhotoLightboxOpen(idx)}
                    />
                    <input
                      type="text"
                      value={photo.description || ''}
                      onChange={async (e) => {
                        const newDesc = e.target.value;
                        const updated = { ...photo, description: newDesc };
                        await apiService.updateClubPhoto(photo.id, updated);
                        const photos = await apiService.getClubPhotos(editClub.id);
                        setEditClubPhotos(photos);
                      }}
                      style={{ flex: 1, fontSize: 16, padding: 4, borderRadius: 4, border: '1px solid #ccc' }}
                      placeholder="Описание фото"
                    />
                    <IconButton size="small" color="error" onClick={() => handleDeletePhoto(photo.id)}><DeleteIcon fontSize="small" /></IconButton>
                  </Box>
                ))}
                {typeof clubPhotoLightboxOpen === 'number' && clubPhotoLightboxOpen >= 0 && (
                  <Lightbox
                    open={typeof clubPhotoLightboxOpen === 'number'}
                    close={() => setClubPhotoLightboxOpen(false)}
                    index={clubPhotoLightboxOpen}
                    slides={editClubPhotos.map(photo => ({ src: `http://localhost:3001${photo.photoUrl}` }))}
                  />
                )}
              </Box>
              <Button variant="outlined" onClick={() => setAddPhotoOpen(true)}>Добавить фото</Button>
              <Typography sx={{ mt: 2, fontWeight: 'bold' }}>Залы:</Typography>
              <Box sx={{ mb: 1 }}>
                {editClubHalls
                  .filter((hall, idx, arr) => arr.findIndex(h => h.id === hall.id) === idx)
                  .map(hall => (
                    <Box key={hall.id} sx={{ display: 'flex', flexDirection: 'column', mb: 1, border: '1px solid #eee', borderRadius: 2, p: 1, position: 'relative' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontWeight: 'bold' }}>{hall.name}</Typography>
                        <IconButton size="small" color="error" onClick={async () => {
                          await handleDeleteHall(hall.id);
                        }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                        {(hall.photoUrls || []).length ? (hall.photoUrls || []).map((url, idx) => (
                          <Box key={idx} sx={{ position: 'relative', display: 'inline-block', mr: 1 }}>
                            <img
                              src={url.startsWith('http') ? url : `http://localhost:3001${url}`}
                              alt="hall"
                              style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 8, cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
                              onClick={() => {
                                setHallLightboxImages((hall.photoUrls || []).map(u => u.startsWith('http') ? u : `http://localhost:3001${u}`));
                                setHallLightboxIndex(idx);
                                setHallLightboxOpen(true);
                              }}
                              onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.12)')}
                              onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
                            />
                            <IconButton
                              size="small"
                              sx={{ position: 'absolute', top: 0, right: 0, background: 'rgba(255,255,255,0.7)' }}
                              onClick={async () => {
                                const newPhotoUrls = (hall.photoUrls || []).filter((_, i) => i !== idx);
                                await apiService.updateHall(hall.id, { ...hall, photoUrls: newPhotoUrls });
                                const halls = await apiService.getClubHalls(editClub.id);
                                setEditClubHalls(halls);
                                setSnackbar({ open: true, message: 'Фото зала удалено', severity: 'success' });
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        )) : <Typography color="text.secondary">Нет фото</Typography>}
                        <Button variant="outlined" component="label" size="small">
                          + Фото
                          <input type="file" hidden accept="image/*" onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const url = await apiService.uploadClubPhoto(file);
                            const newPhotoUrls = [...(hall.photoUrls || []), url];
                            await apiService.updateHall(hall.id, { ...hall, photoUrls: newPhotoUrls });
                            const halls = await apiService.getClubHalls(editClub.id);
                            setEditClubHalls(halls);
                          }} />
                        </Button>
                      </Box>
                    </Box>
                  ))}
              </Box>
              <Button variant="outlined" onClick={() => setAddHallOpen(true)}>Добавить зал</Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditClub(null)}>Отмена</Button>
          <Button onClick={() => handleEditSave(editClub)} variant="contained">Сохранить</Button>
        </DialogActions>
      </Dialog>
      {/* Модалка добавления фото */}
      <Dialog open={addPhotoOpen} onClose={() => setAddPhotoOpen(false)}>
        <DialogTitle>Добавить фото клуба</DialogTitle>
        <DialogContent>
          <Button variant="outlined" component="label" sx={{ mb: 2 }}>
            Загрузить файл
            <input type="file" hidden accept="image/*" onChange={handlePhotoFileUpload} />
          </Button>
          {newPhoto.photoUrl && (
            <img src={`http://localhost:3001${newPhoto.photoUrl}`} alt="preview" style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 4, marginBottom: 8 }} />
          )}
          <TextField label="Описание" value={newPhoto.description} onChange={e => setNewPhoto({ ...newPhoto, description: e.target.value })} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddPhotoOpen(false)}>Отмена</Button>
          <Button onClick={handleAddPhoto} variant="contained" disabled={!newPhoto.photoUrl}>Добавить</Button>
        </DialogActions>
      </Dialog>
      {/* Модалка добавления зала */}
      <Dialog open={addHallOpen} onClose={() => setAddHallOpen(false)}>
        <DialogTitle>Добавить зал</DialogTitle>
        <DialogContent>
          <TextField label="Название" value={newHall.name} onChange={e => setNewHall({ ...newHall, name: e.target.value })} fullWidth sx={{ mb: 2 }} />
          <TextField label="Описание" value={newHall.description} onChange={e => setNewHall({ ...newHall, description: e.target.value })} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddHallOpen(false)}>Отмена</Button>
          <Button onClick={handleAddHall} variant="contained" disabled={!newHall.name}>Добавить</Button>
        </DialogActions>
      </Dialog>
      {/* Модалка редактирования зала */}
      <Dialog open={!!editHall} onClose={() => setEditHall(null)}>
        <DialogTitle>Редактировать зал</DialogTitle>
        <DialogContent>
          {editHall && (
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField label="Название" value={editHall.name} onChange={e => setEditHall({ ...editHall, name: e.target.value })} />
              <TextField label="Описание" value={editHall.description} onChange={e => setEditHall({ ...editHall, description: e.target.value })} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditHall(null)}>Отмена</Button>
          <Button onClick={async () => {
            if (editHall && editClub) {
              await apiService.updateHall(editHall.id, {
                id: editHall.id,
                clubId: editHall.clubId,
                name: editHall.name,
                description: editHall.description,
                isDeleted: editHall.isDeleted ?? false
              });
              const halls = await apiService.getClubHalls(editClub.id);
              setEditClubHalls(halls);
              setEditHall(null);
              setSnackbar({ open: true, message: 'Зал обновлён', severity: 'success' });
            }
          }} variant="contained">Сохранить</Button>
        </DialogActions>
      </Dialog>
      {/* Quick View Popover */}
      <Popover
        open={!!quickViewAnchor && !!quickViewClub}
        anchorEl={quickViewAnchor}
        onClose={handleQuickViewClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{ sx: { p: 2, minWidth: 280, maxWidth: 340, borderRadius: 3 } }}
      >
        {quickViewClub && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Avatar sx={{ width: 48, height: 48, fontSize: 24 }}>{quickViewClub.name[0]}</Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{quickViewClub.name}</Typography>
                <Typography variant="body2" color="text.secondary">{quickViewClub.city}</Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body2" sx={{ mb: 0.5 }}><b>Адрес:</b> {quickViewClub.address}</Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}><b>Телефон:</b> {quickViewClub.phone}</Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}><b>Email:</b> {quickViewClub.email}</Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}><b>Время работы:</b> {quickViewClub.openingHours}</Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}><b>Статус:</b> <Chip label={quickViewClub.isActive ? 'Активен' : 'Неактивен'} color={quickViewClub.isActive ? 'success' : 'error'} size="small" /></Typography>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button size="small" variant="outlined" onClick={() => { handleEdit(quickViewClub); handleQuickViewClose(); }}>Редактировать</Button>
              <Button size="small" variant="contained" onClick={() => { handleView(quickViewClub); handleQuickViewClose(); }}>Подробнее</Button>
            </Box>
          </Box>
        )}
      </Popover>
      {/* Lightbox для фото залов */}
      {hallLightboxOpen && (
        <Lightbox
          open={hallLightboxOpen}
          close={() => setHallLightboxOpen(false)}
          index={hallLightboxIndex}
          slides={hallLightboxImages.map(src => ({ src }))}
        />
      )}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity as any} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ClubsPage;

// Слайдер для фото клуба
type ClubPhotoSliderProps = { photos: ClubPhoto[] };
const ClubPhotoSlider: React.FC<ClubPhotoSliderProps> = ({ photos }) => {
  const [index, setIndex] = useState(0);
  const prev = () => setIndex(i => (i === 0 ? photos.length - 1 : i - 1));
  const next = () => setIndex(i => (i === photos.length - 1 ? 0 : i + 1));
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Button size="small" onClick={prev} disabled={photos.length <= 1}>{'<'}</Button>
      <img src={`http://localhost:3001${photos[index].photoUrl}`} alt={photos[index].description} style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 4 }} />
      <Button size="small" onClick={next} disabled={photos.length <= 1}>{'>'}</Button>
    </Box>
  );
};

// Новый компонент модального окна для просмотра клуба
interface ClubInfoModalProps {
  open: boolean;
  onClose: () => void;
  club: Club;
}
const ClubInfoModal: React.FC<ClubInfoModalProps> = ({ open, onClose, club }) => {
  const [tab, setTab] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const photos = club.clubPhotos?.length ? club.clubPhotos.map(p => `http://localhost:3001${p.photoUrl}`) : [];
  const [hallLightboxOpen, setHallLightboxOpen] = useState(false);
  const [hallLightboxImages, setHallLightboxImages] = useState<string[]>([]);
  const [hallLightboxIndex, setHallLightboxIndex] = useState(0);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={photos[0] || undefined}
            sx={{ width: 64, height: 64, boxShadow: 2 }}
            variant="rounded"
          />
          <Box>
            <Typography variant="h5">{club.name}</Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {club.city}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="Общее" />
          <Tab label="Залы" />
          <Tab label="Фото" />
          <Tab label="Контакты" />
        </Tabs>
        {tab === 0 && (
          <Box>
            <Typography gutterBottom>
              <LocationIcon fontSize="small" /> {club.address}
            </Typography>
            <Typography gutterBottom>
              <ScheduleIcon fontSize="small" /> {club.openingHours}
            </Typography>
            <Typography gutterBottom>
              {club.description}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Статус: {club.isActive ? 'Активен' : 'Неактивен'}
            </Typography>
          </Box>
        )}
        {tab === 1 && (
          <Box>
            {club.halls?.length ? (
              <Grid container spacing={2}>
                {club.halls.filter((hall, idx, arr) => arr.findIndex(h => h.id === hall.id) === idx).map((room, idx) => (
                  <Grid item xs={12} md={6} key={room.id}>
                    <Box p={2} boxShadow={1} borderRadius={2}>
                      <Typography variant="subtitle1">{room.name}</Typography>
                      <Typography variant="body2">{room.description}</Typography>
                      {/* --- Фото залов --- */}
                      {(room.photoUrls || []).length ? (
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                          {(room.photoUrls || []).map((url, i) => (
                            <img
                              key={i}
                              src={url.startsWith('http') ? url : `http://localhost:3001${url}`}
                              alt="hall"
                              style={{
                                width: 120,
                                height: 90,
                                objectFit: 'cover',
                                borderRadius: 8,
                                border: '1px solid #eee',
                                marginRight: 8,
                              }}
                            />
                          ))}
                        </Box>
                      ) : (
                        <Typography color="text.secondary">Нет фото</Typography>
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography color="text.secondary">Нет информации о залах</Typography>
            )}
            {hallLightboxOpen && (
              <Lightbox
                open={hallLightboxOpen}
                close={() => setHallLightboxOpen(false)}
                index={hallLightboxIndex}
                slides={hallLightboxImages.map(src => ({ src }))}
              />
            )}
          </Box>
        )}
        {tab === 2 && (
          <Box sx={{ minHeight: 240, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2 }}>
            {/* Логотип клуба */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Логотип клуба:</Typography>
              {club.logoUrl ? (
                <Box sx={{ position: 'relative', display: 'inline-block', mr: 2 }}>
                  <img src={club.logoUrl} alt="logo" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
                  <IconButton size="small" sx={{ position: 'absolute', top: 0, right: 0, background: 'rgba(255,255,255,0.7)' }} onClick={async () => {
                    await apiService.updateClub(club.id, { ...club, logoUrl: '' });
                    // обновить club.logoUrl после удаления
                    club.logoUrl = '';
                  }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ) : <Typography color="text.secondary">Нет логотипа</Typography>}
            </Box>
            {/* Фото клуба */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Фото клуба:</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {club.clubPhotos?.length ? club.clubPhotos.map((photo, idx) => (
                  <Box key={photo.id} sx={{ position: 'relative', display: 'inline-block', mr: 1 }}>
                    <img src={`http://localhost:3001${photo.photoUrl}`} alt={photo.description} style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 4 }} />
                    <IconButton size="small" sx={{ position: 'absolute', top: 0, right: 0, background: 'rgba(255,255,255,0.7)' }} onClick={async () => {
                      await apiService.deleteClubPhoto(photo.id);
                      // обновить club.clubPhotos после удаления
                      club.clubPhotos = club.clubPhotos.filter(p => p.id !== photo.id);
                    }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )) : <Typography color="text.secondary">Нет фото</Typography>}
              </Box>
            </Box>
            {/* Фото всех залов */}
            <Box>
              <Typography variant="subtitle2">Фото залов:</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {club.halls?.filter((hall, idx, arr) => arr.findIndex(h => h.id === hall.id) === idx).flatMap(hall =>
                  (hall.photoUrls || []).map((url, i) => (
                    <Box key={hall.id + '-' + i} sx={{ position: 'relative', display: 'inline-block', mr: 1 }}>
                      <img src={url} alt="hall" style={{ width: 60, height: 45, objectFit: 'cover', borderRadius: 4 }} />
                      <IconButton size="small" sx={{ position: 'absolute', top: 0, right: 0, background: 'rgba(255,255,255,0.7)' }} onClick={async () => {
                        const newPhotoUrls = (hall.photoUrls || []).filter((_, idx2) => idx2 !== i);
                        await apiService.updateHall(hall.id, { ...hall, photoUrls: newPhotoUrls });
                        const halls = await apiService.getClubHalls(club.id);
                        club.halls = halls;
                      }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))
                )}
              </Box>
            </Box>
          </Box>
        )}
        {tab === 3 && (
          <Box>
            <Typography gutterBottom>
              <PhoneIcon fontSize="small" /> {club.phone}
            </Typography>
            <Typography gutterBottom>
              <EmailIcon fontSize="small" /> {club.email}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
};
