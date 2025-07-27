import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, CircularProgress } from '@mui/material';

interface Club {
  id: number;
  name: string;
  type: string;
  location: string;
}

const ClubsPage: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/clubs')
      .then(res => res.json())
      .then(data => {
        setClubs(data);
        setLoading(false);
      });
  }, []);

  return (
    <Container maxWidth="lg" style={{ marginTop: 40 }}>
      <Typography variant="h4" gutterBottom>Клубы</Typography>
      <Paper>
        {loading ? <CircularProgress /> : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Название</TableCell>
                <TableCell>Тип</TableCell>
                <TableCell>Локация</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clubs.map(club => (
                <TableRow key={club.id}>
                  <TableCell>{club.id}</TableCell>
                  <TableCell>{club.name}</TableCell>
                  <TableCell>{club.type}</TableCell>
                  <TableCell>{club.location}</TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined">Редактировать</Button>
                    <Button size="small" color="error" variant="outlined" style={{ marginLeft: 8 }}>Удалить</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Container>
  );
};

export default ClubsPage;
