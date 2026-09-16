// ============================================================
// AksesPangan — Core TypeScript Types
// ============================================================

// --- User & Auth ---
export type UserRole = 'penyedia' | 'penerima' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // hashed in real app, plain for demo
  role: UserRole;
  phone: string;
  avatar?: string;
  // Penyedia-specific fields
  businessName?: string;
  businessAddress?: string;
  businessPhoto?: string;
  businessType?: BusinessType;
  location?: Coordinates;
  createdAt: string;
}

export type BusinessType =
  | 'restoran'
  | 'hotel'
  | 'kafe'
  | 'katering'
  | 'supermarket'
  | 'pasar'
  | 'lainnya';

// --- Geolocation ---
export interface Coordinates {
  lat: number;
  lng: number;
}

// --- Surplus ---
export type FoodCategory =
  | 'nasi'
  | 'lauk'
  | 'sayur'
  | 'roti'
  | 'kue'
  | 'buah'
  | 'minuman'
  | 'lainnya';

export type SurplusStatus = 'active' | 'booked' | 'completed' | 'expired';

export interface SurplusItem {
  id: string;
  providerId: string;
  providerName: string;
  providerBusinessName: string;
  name: string;
  description: string;
  photo: string; // base64 or URL
  quantity: number; // in kg
  portionCount: number;
  productionTime: string; // ISO string
  expiryTime: string; // ISO string
  status: SurplusStatus;
  price: number; // 0 = gratis
  isFree: boolean;
  foodCategory: FoodCategory;
  location: Coordinates;
  address: string;
  createdAt: string;
}

// --- Booking ---
export type BookingStatus =
  | 'menunggu'
  | 'dikonfirmasi'
  | 'diambil'
  | 'dibatalkan'
  | 'kedaluwarsa';

export interface Booking {
  id: string;
  surplusId: string;
  surplusName: string;
  surplusPhoto: string;
  providerId: string;
  providerBusinessName: string;
  recipientId: string;
  recipientName: string;
  recipientPhone: string;
  quantity: number; // kg being picked up
  status: BookingStatus;
  bookedAt: string;
  confirmedAt?: string;
  pickedUpAt?: string;
  cancelledAt?: string;
  expiredAt?: string;
  pickupDeadline: string;
  pickupLocation: Coordinates;
  pickupAddress: string;
}

// --- Notification ---
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  userId: string;
}

// --- Impact ---
export interface ImpactData {
  totalKgSaved: number;
  totalPortions: number;
  totalCO2eSaved: number; // kg CO₂e (1 kg food ≈ 2.5 kg CO₂e)
  totalTransactions: number;
  totalProviders: number;
  totalRecipients: number;
  treeEquivalent: number; // 1 tree absorbs ~22 kg CO₂/year
}

export interface ImpactTimeline {
  date: string;
  kgSaved: number;
  transactions: number;
  co2eSaved: number;
}

// --- Filter & Sort ---
export type SortOption = 'nearest' | 'newest' | 'cheapest' | 'expiring';

export interface FilterState {
  category: FoodCategory | 'all';
  maxDistance: number; // km
  priceRange: 'all' | 'free' | 'paid';
  sortBy: SortOption;
  searchQuery: string;
}

// --- App State ---
export interface AppState {
  currentUser: User | null;
  isAuthenticated: boolean;
  notifications: Notification[];
  unreadCount: number;
}

// --- Food Category Labels ---
export const FOOD_CATEGORY_LABELS: Record<FoodCategory, string> = {
  nasi: 'Nasi & Karbohidrat',
  lauk: 'Lauk Pauk',
  sayur: 'Sayur & Salad',
  roti: 'Roti & Pastry',
  kue: 'Kue & Snack',
  buah: 'Buah-buahan',
  minuman: 'Minuman',
  lainnya: 'Lainnya',
};

export const FOOD_CATEGORY_EMOJI: Record<FoodCategory, string> = {
  nasi: '🍚',
  lauk: '🍗',
  sayur: '🥗',
  roti: '🍞',
  kue: '🍰',
  buah: '🍎',
  minuman: '🥤',
  lainnya: '📦',
};

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  menunggu: 'Menunggu Konfirmasi',
  dikonfirmasi: 'Dikonfirmasi',
  diambil: 'Sudah Diambil',
  dibatalkan: 'Dibatalkan',
  kedaluwarsa: 'Kedaluwarsa',
};

export const BUSINESS_TYPE_LABELS: Record<BusinessType, string> = {
  restoran: 'Restoran',
  hotel: 'Hotel',
  kafe: 'Kafe',
  katering: 'Katering',
  supermarket: 'Supermarket',
  pasar: 'Pasar',
  lainnya: 'Lainnya',
};
