import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { Club } from '../../types';
import { apiService } from '../../services/api';

const ClubsPage: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadClubs();
  }, []);

  const loadClubs = async () => {
    try {
      setLoading(true);
      const response = await apiService.getClubs();
      const clubsData = Array.isArray(response) ? response : response.items || [];
      setClubs(clubsData);
      setError(null);
    } catch (err) {
      setError('Ошибка загрузки клубов');
      console.error('Error loading clubs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClub = async (clubId: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот клуб?')) {
      try {
        await apiService.deleteClub(clubId);
        await loadClubs();
      } catch (err) {
        setError('Ошибка удаления клуба');
        console.error('Error deleting club:', err);
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Управление клубами</Typography>
        <Box>
          <IconButton onClick={loadClubs} sx={{ mr: 1 }}>
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {/* TODO: Открыть диалог создания */}}
          >
            Добавить клуб
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Название</TableCell>
              <TableCell>Адрес</TableCell>
              <TableCell>Телефон</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Залы</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clubs.map((club) => (
              <TableRow key={club.id}>
                <TableCell>{club.id}</TableCell>
                <TableCell>{club.name}</TableCell>
                <TableCell>{club.address}</TableCell>
                <TableCell>{club.phone}</TableCell>
                <TableCell>
                  <Chip 
                    label={club.isActive ? 'Активен' : 'Неактивен'} 
                    color={club.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{club.halls?.length || 0}</TableCell>
                <TableCell>
                  <IconButton size="small" sx={{ mr: 1 }}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton size="small" sx={{ mr: 1 }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClub(club.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {clubs.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Клубы не найдены
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ClubsPage;
