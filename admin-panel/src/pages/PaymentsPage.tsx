import React, { useState, useEffect } from 'react';
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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  CreditCard as CardIcon,
  AccountBalance as BankIcon,
  TrendingUp,
  Payment as PaymentIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  FilterList,
  Download,
  Visibility,
  Receipt,
  AccountBalanceWallet,
  MonetizationOn,
} from '@mui/icons-material';
import { useAuth } from '../utils/AuthContext';

const PaymentsPage: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetch('/api/payments', {
      headers: {
        'Authorization': 'Bearer ' + token
      },
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error('Ошибка авторизации или получения данных');
        return res.json();
      })
      .then(data => {
        setPayments(data);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        setPayments([]);
        alert(err.message);
      });
  }, [token]);
  if (loading) return <div>Загрузка...</div>;
  if (!payments.length) return <div>Нет данных о платежах</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      case 'refunded': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckIcon />;
      case 'pending': return <PendingIcon />;
      case 'failed': return <CancelIcon />;
      case 'refunded': return <MoneyIcon />;
      default: return <PaymentIcon />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Завершен';
      case 'pending': return 'Ожидает';
      case 'failed': return 'Ошибка';
      case 'refunded': return 'Возвращен';
      default: return status;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'card': return <CardIcon />;
      case 'kaspi': return <AccountBalanceWallet />;
      case 'bank_transfer': return <BankIcon />;
      case 'wallet': return <AccountBalanceWallet />;
      default: return <PaymentIcon />;
    }
  };

  const getMethodText = (method: string) => {
    switch (method) {
      case 'card': return 'Банковская карта';
      case 'kaspi': return 'Kaspi Pay';
      case 'bank_transfer': return 'Банковский перевод';
      case 'wallet': return 'Электронный кошелек';
      default: return method;
    }
  };

  // Статистика
  const totalAmount = payments
    .filter(p => p.paymentStatus === 'успешно' || p.paymentStatus === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = payments
    .filter(p => p.paymentStatus === 'ожидание' || p.paymentStatus === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  // totalFees можно убрать или реализовать, если появится поле комиссии
  const totalFees = 0;

  // Фильтрация
  const filteredPayments = payments.filter(payment => {
    const statusMatch = filterStatus === 'all' || payment.paymentStatus === filterStatus;
    const methodMatch = filterMethod === 'all' || payment.paymentMethod === filterMethod;
    return statusMatch && methodMatch;
  });

  const formatDateTime = (date: any) => {
    if (!date) return '-';
    const d = new Date(date);
    if (isNaN(d as any)) return '-';
    return d.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (date: any) => {
    if (!date) return '-';
    const d = new Date(date);
    if (isNaN(d as any)) return '-';
    return d.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Заголовок */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
          💳 Управление платежами
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#666' }}>
          Отслеживайте доходы и транзакции
        </Typography>
      </Box>

      {/* Статистика */}
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
                    ₸{(totalAmount / 1000).toFixed(0)}K
                  </Typography>
                  <Typography variant="body2">
                    Общий доход
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption">+12.5%</Typography>
                  </Box>
                </Box>
                <MonetizationOn sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    ₸{(pendingAmount / 1000).toFixed(0)}K
                  </Typography>
                  <Typography variant="body2">
                    В ожидании
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <PendingIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption">
                      {payments.filter(p => p.paymentStatus === 'pending').length} транз.
                    </Typography>
                  </Box>
                </Box>
                <PendingIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    ₸{totalFees}
                  </Typography>
                  <Typography variant="body2">
                    Комиссии
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="caption">
                      {((totalFees / totalAmount) * 100).toFixed(1)}% от оборота
                    </Typography>
                  </Box>
                </Box>
                <Receipt sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {payments.length}
                  </Typography>
                  <Typography variant="body2">
                    Всего транзакций
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="caption">
                      Успешных: {payments.filter(p => p.paymentStatus === 'completed').length}
                    </Typography>
                  </Box>
                </Box>
                <PaymentIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Основная таблица */}
        <Grid item xs={12} lg={8}>
          {/* Фильтры */}
          <Card sx={{ borderRadius: 2, mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mr: 2 }}>
                  🔍 Фильтры
                </Typography>
                
                <TextField
                  select
                  size="small"
                  label="Статус"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  sx={{ minWidth: 150 }}
                >
                  <MenuItem value="all">Все статусы</MenuItem>
                  <MenuItem value="completed">Завершено</MenuItem>
                  <MenuItem value="pending">Ожидает</MenuItem>
                  <MenuItem value="failed">Ошибка</MenuItem>
                  <MenuItem value="refunded">Возвращено</MenuItem>
                </TextField>

                <TextField
                  select
                  size="small"
                  label="Способ оплаты"
                  value={filterMethod}
                  onChange={(e) => setFilterMethod(e.target.value)}
                  sx={{ minWidth: 200 }}
                >
                  <MenuItem value="all">Все способы</MenuItem>
                  <MenuItem value="card">Банковская карта</MenuItem>
                  <MenuItem value="kaspi">Kaspi Pay</MenuItem>
                  <MenuItem value="bank_transfer">Банковский перевод</MenuItem>
                  <MenuItem value="wallet">Электронный кошелек</MenuItem>
                </TextField>

                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={() => {
                    setFilterStatus('all');
                    setFilterMethod('all');
                  }}
                >
                  Сбросить
                </Button>

                <Button
                  variant="contained"
                  startIcon={<Download />}
                  sx={{ ml: 'auto' }}
                >
                  Экспорт
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Таблица платежей */}
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                💳 Список транзакций
              </Typography>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID/Пользователь</TableCell>
                      <TableCell>Сумма</TableCell>
                      <TableCell>Способ</TableCell>
                      <TableCell>Статус</TableCell>
                      <TableCell>Дата</TableCell>
                      <TableCell>Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow 
                        key={payment.id}
                        sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar 
                              src={payment.userAvatar} 
                              sx={{ width: 40, height: 40 }}
                            />
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {payment.id}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {payment.userName}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ 
                              fontWeight: 'bold', 
                              color: payment.paymentStatus === 'refunded' ? '#f44336' : '#2e7d32' 
                            }}>
                              {payment.paymentStatus === 'refunded' ? '-' : ''}₸{payment.amount.toLocaleString()}
                            </Typography>
                            {payment.fee !== 0 && (
                              <Typography variant="caption" color="text.secondary">
                                Комиссия: ₸{Math.abs(payment.fee)}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Chip
                            icon={getMethodIcon(payment.paymentMethod)}
                            label={getMethodText(payment.paymentMethod)}
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                        
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(payment.paymentStatus)}
                            label={getStatusText(payment.paymentStatus)}
                            color={getStatusColor(payment.paymentStatus)}
                            size="small"
                          />
                        </TableCell>
                        
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              {formatDateTime(payment.paidAt)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatTime(payment.paidAt)}
                            </Typography>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Детали">
                              <IconButton size="small" sx={{ color: '#1976d2' }}>
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Чек">
                              <IconButton size="small" sx={{ color: '#ed6c02' }}>
                                <Receipt fontSize="small" />
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
        </Grid>

        {/* Правая панель */}
        <Grid item xs={12} lg={4}>
          {/* Способы оплаты */}
          <Card sx={{ borderRadius: 2, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                🏦 Способы оплаты
              </Typography>

              <List sx={{ p: 0 }}>
                {[
                  { name: 'Банковская карта', count: payments.filter(p => p.paymentMethod === 'card').length, color: '#1976d2' },
                  { name: 'Kaspi Pay', count: payments.filter(p => p.paymentMethod === 'kaspi').length, color: '#2e7d32' },
                  { name: 'Банковский перевод', count: payments.filter(p => p.paymentMethod === 'bank_transfer').length, color: '#ed6c02' },
                  { name: 'Электронный кошелек', count: payments.filter(p => p.paymentMethod === 'wallet').length, color: '#9c27b0' },
                ].map((method, index) => (
                  <React.Fragment key={method.name}>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemAvatar sx={{ minWidth: 36 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: method.color,
                          }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={method.name}
                        secondary={`${method.count} транзакций`}
                      />
                    </ListItem>
                    {index < 3 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Последние транзакции */}
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                🕒 Последние транзакции
              </Typography>
              
              <List sx={{ p: 0 }}>
                {payments.slice(0, 5).map((payment, index) => (
                  <React.Fragment key={payment.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar 
                          src={payment.userAvatar}
                          sx={{ width: 36, height: 36 }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {payment.userName}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: 'bold',
                                color: payment.paymentStatus === 'refunded' ? '#f44336' : '#2e7d32'
                              }}
                            >
                              {payment.paymentStatus === 'refunded' ? '-' : ''}₸{payment.amount.toLocaleString()}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption">
                              {getMethodText(payment.paymentMethod)}
                            </Typography>
                            <Chip
                              label={getStatusText(payment.paymentStatus)}
                              color={getStatusColor(payment.paymentStatus)}
                              size="small"
                              sx={{ fontSize: '10px', height: 20 }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < 4 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PaymentsPage;
