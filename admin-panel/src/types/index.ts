// Типы пользователей и ролей
export interface User {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  createdAt: string;
  updatedAt?: string;
  balance: number;
  points: number;
  isDeleted: boolean;
  managedClubId?: number;
  roles: Role[] | string[]; // Поддерживаем оба формата
}

export interface Role {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

export interface UserRole {
  userId: number;
  roleId: number;
  assignedAt: string;
}

// Типы клубов и бронирований
export interface Club {
  id: number;
  name: string;
  city: string;
  address: string;
  description: string;
  phone: string;
  email: string;
  openingHours: string;
  isActive: boolean;
  halls: Hall[];
  tariffs: Tariff[];
  clubPhotos: ClubPhoto[];
}

export interface Hall {
  id: number;
  clubId: number;
  name: string;
  description: string;
  capacity: number;
  isActive: boolean;
  club: Club;
  seats: Seat[];
  isDeleted: boolean;
}

export interface Seat {
  id: number;
  hallId: number;
  seatNumber: string;
  description: string;
  status: string;
  isActive: boolean;
  hall: Hall;
  computerSpec: ComputerSpec;
  bookings: Booking[];
}

export interface Booking {
  id: number;
  userId: number;
  seatId: number;
  tariffId: number;
  startTime: string;
  endTime: string;
  totalAmount: number;
  status: BookingStatus;
  createdAt: string;
  user: User;
  seat: Seat;
  tariff: Tariff;
  payments: Payment[];
}

export interface Payment {
  id: number;
  bookingId: number;
  amount: number;
  paymentMethod: string;
  status: PaymentStatus;
  transactionId?: string;
  createdAt: string;
  booking: Booking;
}

export interface Tariff {
  id: number;
  clubId: number;
  name: string;
  description: string;
  pricePerHour: number;
  isActive: boolean;
  club: Club;
  bookings: Booking[];
}

export interface ComputerSpec {
  id: number;
  seatId: number;
  cpu: string;
  gpu: string;
  ram: string;
  monitor: string;
  peripherals: string;
  seat: Seat;
}

export interface ClubPhoto {
  id: number;
  clubId: number;
  photoUrl: string;
  description: string;
  uploadedAt: string;
  isMain: boolean;
  club: Club;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  user: User;
}

export interface AuditLog {
  id: number;
  userId?: number;
  action: string;
  tableName: string;
  recordId?: number;
  oldValues?: string;
  newValues?: string;
  timestamp: string;
}

// Типы для авторизации
export interface LoginRequest {
  emailOrPhone: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
}

export interface CreateUserRequest {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  roles: UserRoles[];
}

export interface UpdateUserRequest {
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  password?: string;
  roles?: UserRoles[];
}

// Типы для API ответов
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// Роли в системе
export enum UserRoles {
  SUPER_ADMIN = 'SuperAdmin',
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  USER = 'User'
}

// Статусы
export enum BookingStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled'
}

export enum PaymentStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
  REFUNDED = 'Refunded'
}

export enum SeatStatus {
  AVAILABLE = 'Available',
  OCCUPIED = 'Occupied',
  MAINTENANCE = 'Maintenance'
}

export enum NotificationType {
  INFO = 'Info',
  WARNING = 'Warning',
  ERROR = 'Error',
  SUCCESS = 'Success'
}
