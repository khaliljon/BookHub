import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  User, 
  Role, 
  Club, 
  Hall, 
  Seat, 
  Booking, 
  Payment, 
  Tariff, 
  Notification,
  LoginRequest, 
  LoginResponse, 
  RegisterRequest,
  CreateUserRequest,
  UpdateUserRequest,
  ApiResponse,
  PaginatedResponse
} from '../types';

// MEGA FORCE RELOAD: 2025-07-20-19:15:00
console.log('🚨 API MODULE LOADING AT:', new Date().toISOString());
console.log('🚨 WINDOW LOCATION:', window.location.href);
console.log('🚨 USER AGENT:', navigator.userAgent);

class ApiService {
  private api: AxiosInstance;

  constructor() {
    const timestamp = new Date().toISOString();
    console.log('� API SERVICE CONSTRUCTOR CALLED AT:', timestamp);
    console.log('=== 🚨 API SERVICE MEGA DEBUG 🚨 ===');
    console.log('REACT_APP_API_URL environment variable:', process.env.REACT_APP_API_URL);
    console.log('Fallback URL: https://localhost:7183/api');
    const finalUrl = process.env.REACT_APP_API_URL || 'https://localhost:7183/api';
    console.log('🚨 FINAL baseURL that will be used:', finalUrl);
    console.log('🚨 Type of finalUrl:', typeof finalUrl);
    console.log('🚨 finalUrl length:', finalUrl.length);
    console.log('======================================');
    
    this.api = axios.create({
      baseURL: finalUrl,
      headers: {
        'Content-Type': 'application/json',
        'X-Debug-Timestamp': timestamp
      },
      timeout: 10000,
    });

    console.log('🚨 AXIOS INSTANCE CREATED WITH baseURL:', this.api.defaults.baseURL);
    console.log('🚨 AXIOS CONFIG:', this.api.defaults);

    // Добавляем токен к каждому запросу
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Обработка ответов
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Токен истек или невалиден
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Авторизация
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response: AxiosResponse<LoginResponse> = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<User>> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.post('/auth/register', userData);
    return response.data;
  }

  // Пользователи
  async getUsers(): Promise<User[]> {
    try {
      console.log('🔍 DEBUG: getUsers method called');
      console.log('🔍 DEBUG: this.api.defaults.baseURL =', this.api.defaults.baseURL);
      console.log('🔍 DEBUG: Full request URL will be:', this.api.defaults.baseURL + '/users');
      console.log('Making request to /users...');
      const response: AxiosResponse<User[]> = await this.api.get('/users');
      console.log('Response from /users:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in getUsers:', error);
      console.error('🔍 DEBUG: Error config:', (error as any)?.config);
      throw error;
    }
  }

  async getUserById(id: number): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get(`/users/${id}`);
    return response.data;
  }

  async updateUser(id: number, userData: UpdateUserRequest): Promise<User> {
    try {
      // Сначала получаем текущие данные пользователя
      const currentUser = await this.getUserById(id);
      console.log('Current user data:', currentUser);
      
      // Создаем полный UserDto с обновленными данными
      const userDto = {
        id: currentUser.id,
        fullName: userData.fullName ?? currentUser.fullName,
        phoneNumber: userData.phoneNumber ?? currentUser.phoneNumber,
        email: userData.email ?? currentUser.email,
        createdAt: currentUser.createdAt,
        balance: currentUser.balance,
        points: currentUser.points,
        isDeleted: currentUser.isDeleted,
        roles: userData.roles ? userData.roles.map(r => typeof r === 'string' ? r : r) : currentUser.roles.map(r => typeof r === 'object' && 'name' in r ? r.name : r)
      };
      
      console.log('Sending userDto to API:', userDto);
      const response: AxiosResponse<User> = await this.api.put(`/users/${id}`, userDto);
      return response.data;
    } catch (error) {
      console.error('Error in updateUser:', error);
      throw error;
    }
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    const response: AxiosResponse<User> = await this.api.post('/users', userData);
    return response.data;
  }

  async deleteUser(id: number): Promise<void> {
    await this.api.delete(`/users/${id}`);
  }

  async restoreUser(id: number): Promise<void> {
    await this.api.post(`/users/${id}/restore`);
  }

  // Роли
  async getRoles(): Promise<Role[]> {
    const response: AxiosResponse<Role[]> = await this.api.get('/roles');
    return response.data;
  }

  async assignUserRole(userId: number, roleId: number): Promise<void> {
    await this.api.post('/users/assign-role', { userId, roleId });
  }

  async removeUserRole(userId: number, roleId: number): Promise<void> {
    await this.api.delete(`/users/${userId}/roles/${roleId}`);
  }

  // Клубы
  async getClubs(page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<Club>> {
    const response: AxiosResponse<PaginatedResponse<Club>> = await this.api.get(`/clubs?page=${page}&pageSize=${pageSize}`);
    return response.data;
  }

  async getClubById(id: number): Promise<Club> {
    const response: AxiosResponse<Club> = await this.api.get(`/clubs/${id}`);
    return response.data;
  }

  async createClub(clubData: Partial<Club>): Promise<Club> {
    const response: AxiosResponse<Club> = await this.api.post('/clubs', clubData);
    return response.data;
  }

  async updateClub(id: number, clubData: Partial<Club>): Promise<Club> {
    const response: AxiosResponse<Club> = await this.api.put(`/clubs/${id}`, clubData);
    return response.data;
  }

  async deleteClub(id: number): Promise<void> {
    await this.api.delete(`/clubs/${id}`);
  }

  // Залы
  async getHalls(clubId?: number): Promise<Hall[]> {
    const url = clubId ? `/halls?clubId=${clubId}` : '/halls';
    const response: AxiosResponse<Hall[]> = await this.api.get(url);
    return response.data;
  }

  async getHallById(id: number): Promise<Hall> {
    const response: AxiosResponse<Hall> = await this.api.get(`/halls/${id}`);
    return response.data;
  }

  async createHall(hallData: Partial<Hall>): Promise<Hall> {
    const response: AxiosResponse<Hall> = await this.api.post('/halls', hallData);
    return response.data;
  }

  async updateHall(id: number, hallData: Partial<Hall>): Promise<Hall> {
    const response: AxiosResponse<Hall> = await this.api.put(`/halls/${id}`, hallData);
    return response.data;
  }

  async deleteHall(id: number): Promise<void> {
    await this.api.delete(`/halls/${id}`);
  }

  // Места
  async getSeats(hallId?: number): Promise<Seat[]> {
    const url = hallId ? `/seats?hallId=${hallId}` : '/seats';
    const response: AxiosResponse<Seat[]> = await this.api.get(url);
    return response.data;
  }

  async getSeatById(id: number): Promise<Seat> {
    const response: AxiosResponse<Seat> = await this.api.get(`/seats/${id}`);
    return response.data;
  }

  async createSeat(seatData: Partial<Seat>): Promise<Seat> {
    const response: AxiosResponse<Seat> = await this.api.post('/seats', seatData);
    return response.data;
  }

  async updateSeat(id: number, seatData: Partial<Seat>): Promise<Seat> {
    const response: AxiosResponse<Seat> = await this.api.put(`/seats/${id}`, seatData);
    return response.data;
  }

  async deleteSeat(id: number): Promise<void> {
    await this.api.delete(`/seats/${id}`);
  }

  // Бронирования
  async getBookings(page: number = 1, pageSize: number = 10, filters?: any): Promise<PaginatedResponse<Booking>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...filters
    });
    const response: AxiosResponse<PaginatedResponse<Booking>> = await this.api.get(`/bookings?${params}`);
    return response.data;
  }

  async getBookingById(id: number): Promise<Booking> {
    const response: AxiosResponse<Booking> = await this.api.get(`/bookings/${id}`);
    return response.data;
  }

  async createBooking(bookingData: Partial<Booking>): Promise<Booking> {
    const response: AxiosResponse<Booking> = await this.api.post('/bookings', bookingData);
    return response.data;
  }

  async updateBooking(id: number, bookingData: Partial<Booking>): Promise<Booking> {
    const response: AxiosResponse<Booking> = await this.api.put(`/bookings/${id}`, bookingData);
    return response.data;
  }

  async cancelBooking(id: number): Promise<void> {
    await this.api.post(`/bookings/${id}/cancel`);
  }

  // Тарифы
  async getTariffs(clubId?: number): Promise<Tariff[]> {
    const url = clubId ? `/tariffs?clubId=${clubId}` : '/tariffs';
    const response: AxiosResponse<Tariff[]> = await this.api.get(url);
    return response.data;
  }

  async createTariff(tariffData: Partial<Tariff>): Promise<Tariff> {
    const response: AxiosResponse<Tariff> = await this.api.post('/tariffs', tariffData);
    return response.data;
  }

  async updateTariff(id: number, tariffData: Partial<Tariff>): Promise<Tariff> {
    const response: AxiosResponse<Tariff> = await this.api.put(`/tariffs/${id}`, tariffData);
    return response.data;
  }

  async deleteTariff(id: number): Promise<void> {
    await this.api.delete(`/tariffs/${id}`);
  }

  // Платежи
  async getPayments(bookingId?: number): Promise<Payment[]> {
    const url = bookingId ? `/payments?bookingId=${bookingId}` : '/payments';
    const response: AxiosResponse<Payment[]> = await this.api.get(url);
    return response.data;
  }

  // Аналитика и отчеты
  async getAnalytics(period: string, clubId?: number): Promise<any> {
    const params = new URLSearchParams({ period });
    if (clubId) params.append('clubId', clubId.toString());
    const response = await this.api.get(`/analytics?${params}`);
    return response.data;
  }

  // Уведомления
  async getNotifications(page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<Notification>> {
    const response: AxiosResponse<PaginatedResponse<Notification>> = await this.api.get(`/notifications?page=${page}&pageSize=${pageSize}`);
    return response.data;
  }

  async deleteNotification(id: number): Promise<void> {
    await this.api.delete(`/notifications/${id}`);
  }
}

export const apiService = new ApiService();

// DEBUG: Принудительно выводим в консоль при загрузке модуля
console.log('🚀 API SERVICE MODULE LOADED - TIMESTAMP:', new Date().toISOString());
console.log('🚀 Current baseURL config:', (apiService as any).api.defaults.baseURL);
export default apiService;
