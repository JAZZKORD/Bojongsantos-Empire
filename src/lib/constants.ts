// ============================================================
// AksesPangan — Constants & Configuration
// ============================================================

import type { Coordinates } from '@/types';

// App info
export const APP_NAME = 'AksesPangan';
export const APP_TAGLINE = 'Dari Surplus ke Solusi — Menyelamatkan Makanan, Mengurangi Kelaparan, Menekan Emisi';
export const APP_DESCRIPTION = 'Platform penghubung surplus makanan dari pelaku usaha dengan masyarakat secara real-time.';

// Default coordinates (Bandung / Bojongsoang area)
export const DEFAULT_CENTER: Coordinates = {
  lat: -6.9692,
  lng: 107.6325,
};

// Map settings
export const MAP_CONFIG = {
  defaultZoom: 13,
  minZoom: 10,
  maxZoom: 18,
  tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
};

// CO₂e calculation factor
export const CO2E_FACTOR = 2.5; // 1 kg food waste ≈ 2.5 kg CO₂e
export const TREE_CO2_ABSORPTION = 22; // 1 tree absorbs ~22 kg CO₂/year

// Booking settings
export const PICKUP_WINDOW_HOURS = 2; // hours after confirmation to pick up
export const BOOKING_CHECK_INTERVAL = 30000; // check booking status every 30s

// Max distances for filter
export const DISTANCE_OPTIONS = [
  { label: '1 km', value: 1 },
  { label: '3 km', value: 3 },
  { label: '5 km', value: 5 },
  { label: '10 km', value: 10 },
  { label: '20 km', value: 20 },
  { label: 'Semua', value: 999 },
];

// Animation durations
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
  countUp: 2000,
  stagger: 100,
  pageTransition: 300,
};

// localStorage keys
export const STORAGE_KEYS = {
  users: 'aksespangan_users',
  surplusItems: 'aksespangan_surplus',
  bookings: 'aksespangan_bookings',
  notifications: 'aksespangan_notifications',
  currentUser: 'aksespangan_current_user',
  impactData: 'aksespangan_impact',
  isSeeded: 'aksespangan_seeded',
};

// Navigation items
export const NAV_ITEMS = {
  penyedia: [
    { label: 'Dashboard', href: '/penyedia', icon: 'LayoutDashboard' },
    { label: 'Surplus Saya', href: '/penyedia/surplus', icon: 'Package' },
    { label: 'Booking Masuk', href: '/penyedia/booking', icon: 'ClipboardList' },
    { label: 'Riwayat', href: '/penyedia/history', icon: 'History' },
  ],
  penerima: [
    { label: 'Cari Makanan', href: '/penerima', icon: 'MapPin' },
    { label: 'Booking Saya', href: '/penerima/booking', icon: 'ShoppingBag' },
    { label: 'Riwayat', href: '/penerima/history', icon: 'History' },
  ],
  admin: [
    { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
    { label: 'Pengguna', href: '/admin/users', icon: 'Users' },
    { label: 'Transaksi', href: '/admin/transactions', icon: 'Receipt' },
  ],
  shared: [
    { label: 'Dampak', href: '/dashboard', icon: 'BarChart3' },
    { label: 'Syarat', href: '/terms', icon: 'FileText' },
  ],
};

// Food safety high-risk categories
export const HIGH_RISK_FOODS = ['lauk']; // Initially limit high-risk foods
export const FOOD_SAFETY_WARNING = 'Makanan ini termasuk kategori berisiko tinggi. Pastikan untuk segera dikonsumsi setelah pengambilan dan perhatikan kondisi makanan sebelum dikonsumsi.';

// Demo user credentials
export const DEMO_CREDENTIALS = {
  penyedia: { email: 'restoran@demo.com', password: 'demo123' },
  penerima: { email: 'penerima@demo.com', password: 'demo123' },
  admin: { email: 'admin@demo.com', password: 'admin123' },
};
