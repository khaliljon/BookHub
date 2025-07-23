import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const fetchClubs = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await apiService.getClubs();
        // Для каждого клуба подгружаем clubPhotos
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

  const handleView = async (club: Club) => {
    const halls = await apiService.getClubHalls(club.id);
    setViewClub({ ...club, halls });
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
  const handlePhotoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      await apiService.createHall({ ...newHall, clubId: editClub.id });
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
      await apiService.updateClub(club.id, club);
      // Обновить список клубов
      const updatedClubs = await apiService.getClubs();
      setClubs(updatedClubs);
      setEditClub(null);
      setSnackbar({ open: true, message: 'Клуб обновлён', severity: 'success' });
    } catch (e) {
      setSnackbar({ open: true, message: 'Ошибка при обновлении клуба', severity: 'error' });
    }
  };

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
          onClick={() => setAddClubOpen(true)}
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
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {club.clubPhotos?.length > 0 ? (
                          <Avatar
                            src={`http://localhost:3001${club.clubPhotos[0].photoUrl}`}
                            alt={club.name}
                            sx={{ width: 40, height: 40, mr: 1 }}
                          />
                        ) : (
                          <Avatar sx={{ width: 40, height: 40, mr: 1 }}>{club.name[0]}</Avatar>
                        )}
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
                      <Chip 
                        label={club.isActive ? 'Активен' : 'Неактивен'}
                        color={club.isActive ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
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

      {/* Модалка просмотра клуба */}
      <Dialog open={!!viewClub} onClose={() => setViewClub(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Информация о клубе</DialogTitle>
        <DialogContent>
          {viewClub && (
            <Box>
              <Typography variant="h6">{viewClub.name}</Typography>
              <Typography>Город: {viewClub.city}</Typography>
              <Typography>Адрес: {viewClub.address}</Typography>
              <Typography>Описание: {viewClub.description}</Typography>
              <Typography>Телефон: {viewClub.phone}</Typography>
              <Typography>Email: {viewClub.email}</Typography>
              <Typography>Время работы: {viewClub.openingHours}</Typography>
              <Typography sx={{ mt: 2, fontWeight: 'bold' }}>Фото клуба:</Typography>
              <Box sx={{ mb: 1, display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                {viewClub.clubPhotos?.length ? (
                  viewClub.clubPhotos.length === 1 ? (
                    <div>
                      <img src={`http://localhost:3001${viewClub.clubPhotos[0].photoUrl}`} alt={viewClub.clubPhotos[0].description} style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 4 }} />
                      <Typography variant="caption" color="text.secondary">{viewClub.clubPhotos[0].photoUrl}</Typography>
                    </div>
                  ) : (
                    <ClubPhotoSlider photos={viewClub.clubPhotos} />
                  )
                ) : <Typography color="text.secondary">Нет фото</Typography>}
              </Box>
              <Typography sx={{ mt: 2, fontWeight: 'bold' }}>Залы:</Typography>
              <Box sx={{ mb: 1 }}>
                {viewClub.halls?.length ? (
                  <>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {viewClub.halls.length} {viewClub.halls.length === 1 ? 'зал' : (viewClub.halls.length >= 2 && viewClub.halls.length <= 4 ? 'зала' : 'залов')}
                    </Typography>
                    {viewClub.halls.map(hall => (
                      <Box key={hall.id} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <Typography sx={{ flex: 1 }}>{hall.name} — {hall.description}</Typography>
                      </Box>
                    ))}
                  </>
                ) : <Typography color="text.secondary">Нет залов</Typography>}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewClub(null)}>Закрыть</Button>
        </DialogActions>
      </Dialog>
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
              <Typography sx={{ mt: 2, fontWeight: 'bold' }}>Фото клуба:</Typography>
              <Box sx={{ mb: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {editClubPhotos.length === 0 && <Typography color="text.secondary">Нет фото</Typography>}
                {editClubPhotos.map(photo => (
                  <Box key={photo.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <img src={`http://localhost:3001${photo.photoUrl}`} alt={photo.description} style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 4 }} />
                    <Typography sx={{ flex: 1 }}>{photo.description}</Typography>
                    <IconButton size="small" color="error" onClick={() => handleDeletePhoto(photo.id)}><DeleteIcon fontSize="small" /></IconButton>
                  </Box>
                ))}
              </Box>
              <Button variant="outlined" onClick={() => setAddPhotoOpen(true)}>Добавить фото</Button>
              <Typography sx={{ mt: 2, fontWeight: 'bold' }}>Залы:</Typography>
              <Box sx={{ mb: 1 }}>
                {editClubHalls.length === 0 && <Typography color="text.secondary">Нет залов</Typography>}
                {editClubHalls.map(hall => (
                  <Box key={hall.id} sx={{ display: 'flex', alignItems: 'center', mb: 0.5, gap: 1 }}>
                    <Typography sx={{ flex: 1 }}>{hall.name} — {hall.description}</Typography>
                    <IconButton size="small" color="primary" onClick={() => setEditHall(hall)}><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteHall(hall.id)}><DeleteIcon fontSize="small" /></IconButton>
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
