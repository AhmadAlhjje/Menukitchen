// Order Status - Only two statuses are used in the system
export type OrderStatus = 'new' | 'ready';

// User & Auth Types
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'kitchen';
  restaurantId: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// Menu Item Types
export interface MenuItem {
  id: number;
  categoryId: number;
  name: string;
  nameAr: string;
  description?: string;
  price: number;
  image?: string;
  preparationTime: number;
  isAvailable: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Order Types
export interface OrderItem {
  id: number;
  orderId: number;
  itemId: number;
  quantity: number;
  price: number;
  notes?: string;
  item?: MenuItem;
}

export interface Order {
  id: number;
  sessionId: number;
  status: OrderStatus;
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  session?: Session;
}

// Session Types
export interface Session {
  id: number;
  tableId: number;
  qrCode: string;
  numberOfGuests: number;
  status: 'active' | 'closed';
  startTime: string;
  endTime?: string;
  notes?: string;
  table?: Table;
}

// Table Types
export interface Table {
  id: number;
  restaurantId: number;
  tableNumber: string;
  capacity: number;
  qrCode: string;
  location?: string;
  isActive: boolean;
}

// Dashboard Statistics
export interface DashboardStats {
  newOrdersCount: number;
  readyOrdersCount: number;
  activeSessionsCount: number;
  todayOrdersCount: number;
}

// Backend Note Types
export interface BackendNote {
  id: string;
  title: string;
  description: string;
  endpoint: string;
  type: 'bug' | 'missing' | 'enhancement';
  severity: 'high' | 'medium' | 'low';
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Language Type
export type Language = 'ar' | 'en';

// Translation Type
export interface Translation {
  [key: string]: string | Translation;
}
