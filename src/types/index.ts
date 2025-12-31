// Order Status - Three statuses are used in the system
export type OrderStatus = 'new' | 'preparing' | 'delivered';

// Restaurant Types
export interface Restaurant {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  logo?: string;
  logoUrl?: string;
}

// User & Auth Types
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'kitchen';
  restaurantId: number;
  restaurant?: Restaurant;
}

export interface LoginRequest {
  email: string;
  password: string;
  requiredRole?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  nameAr: string;
}

// Menu Item Types
export interface MenuItem {
  id: number;
  categoryId: number;
  name: string;
  nameAr: string;
  description?: string;
  price: string | number;
  images?: string[] | string; // Array of image paths or JSON string
  preparationTime: number;
  isAvailable: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  category?: Category;
}

// Order Types
export interface OrderItem {
  id: number;
  orderId: number;
  itemId: number;
  quantity: number;
  price?: number;
  unitPrice: string | number;
  subtotal: string | number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  item?: MenuItem;
}

export interface Order {
  id: number;
  sessionId: number;
  tableId: number;
  orderNumber: string;
  orderTime: string;
  status: OrderStatus;
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  orderItems?: OrderItem[];
  session?: Session;
  table?: Table;
}

// Session Types
export interface Session {
  id: number;
  restaurantId: number;
  tableId: number;
  sessionNumber: string;
  startTime: string;
  endTime?: string | null;
  status: 'active' | 'closed';
  totalAmount: string | number;
  numberOfGuests: number;
  notes?: string | null;
  closedBy?: number | null;
  createdAt: string;
  updatedAt: string;
  table?: Table;
  orders?: Order[];
  closedByUser?: {
    id: number;
    username: string;
  } | null;
}

// Table Types
export type TableStatus = 'available' | 'occupied' | 'reserved';

export interface Table {
  id: number;
  restaurantId: number;
  tableNumber: string;
  qrCode: string;
  qrCodeImage?: string;
  capacity: number;
  status: TableStatus;
  location?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Dashboard Statistics
export interface DashboardStats {
  newOrdersCount: number;
  preparingOrdersCount: number;
  deliveredOrdersCount: number;
  activeSessionsCount: number;
  todayOrdersCount: number;
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
