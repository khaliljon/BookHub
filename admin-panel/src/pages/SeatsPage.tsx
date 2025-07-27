import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, CircularProgress } from '@mui/material';

interface Seat {
  id: number;
  label: string;
  seatType: string;
  roomId: number;
}

const SeatsPage: React.FC = () => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/seats')
      .then(res => res.json())
      .then(data => {
        setSeats(data);
        setLoading(false);
      });
  }, []);

  return (
    <Container maxWidth="lg" style={{ marginTop: 40 }}>
      <Typography variant="h4" gutterBottom>Места</Typography>
      <Paper>
        {loading ? <CircularProgress /> : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Метка</TableCell>
                <TableCell>Тип места</TableCell>
                <TableCell>ID комнаты</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {seats.map(seat => (
                <TableRow key={seat.id}>
                  <TableCell>{seat.id}</TableCell>
                  <TableCell>{seat.label}</TableCell>
                  <TableCell>{seat.seatType}</TableCell>
                  <TableCell>{seat.roomId}</TableCell>
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

export default SeatsPage;
