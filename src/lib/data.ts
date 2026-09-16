// ============================================================
// AksesPangan — Data Layer (localStorage CRUD + Seed Data)
// ============================================================

import type {
  User,
  SurplusItem,
  Booking,
  Notification,
  ImpactData,
  ImpactTimeline,
  BookingStatus,
} from '@/types';
import { STORAGE_KEYS, CO2E_FACTOR, TREE_CO2_ABSORPTION } from './constants';
import { generateId, hoursFromNow } from './utils';

// ============================================================
// Generic localStorage helpers
// ============================================================

function getStore<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

function setStore<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// ============================================================
// Users
// ============================================================

export function getUsers(): User[] {
  return getStore<User>(STORAGE_KEYS.users);
}

export function getUserById(id: string): User | undefined {
  return getUsers().find((u) => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email === email);
}

export function createUser(user: Omit<User, 'id' | 'createdAt'>): User {
  const users = getUsers();
  const newUser: User = {
    ...user,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  setStore(STORAGE_KEYS.users, users);
  return newUser;
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...updates };
  setStore(STORAGE_KEYS.users, users);
  return users[idx];
}

export function deleteUser(id: string): boolean {
  const users = getUsers();
  const filtered = users.filter((u) => u.id !== id);
  if (filtered.length === users.length) return false;
  setStore(STORAGE_KEYS.users, filtered);
  return true;
}

// ============================================================
// Current Session
// ============================================================

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEYS.currentUser);
  return raw ? JSON.parse(raw) : null;
}

export function setCurrentUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.currentUser);
  }
}

export function login(
  email: string,
  password: string
): { success: boolean; user?: User; error?: string } {
  const user = getUserByEmail(email);
  if (!user) return { success: false, error: 'Email tidak ditemukan' };
  if (user.password !== password) return { success: false, error: 'Password salah' };
  setCurrentUser(user);
  return { success: true, user };
}

export function logout(): void {
  setCurrentUser(null);
}

// ============================================================
// Surplus Items
// ============================================================

export function getBandungSeedItems(): SurplusItem[] {
  return [
    {
      id: 'surplus-bdg-1',
      providerId: 'penyedia-bdg-1',
      providerName: 'Siti Rohani',
      providerBusinessName: 'Dapur Sunda Bojongsoang',
      name: 'Nasi Liwet Komplit Ayam Bakar',
      description: 'Nasi liwet wangi kasturi, ayam bakar bumbu rujak, tahu tempe goreng, lalapan segar dan sambal terasi khas priangan.',
      photo: '/images/surplus-gourmet.jpg',
      quantity: 6,
      portionCount: 15,
      productionTime: new Date(Date.now() - 2 * 3600000).toISOString(),
      expiryTime: hoursFromNow(5),
      status: 'active',
      price: 0,
      isFree: true,
      foodCategory: 'nasi',
      location: { lat: -6.9712, lng: 107.6335 },
      address: 'Jl. Raya Bojongsoang No. 65, Bojongsoang',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'surplus-bdg-2',
      providerId: 'penyedia-bdg-2',
      providerName: 'Ahmad Dahlan',
      providerBusinessName: 'RM Minang Raya Buahbatu',
      name: 'Nasi Padang Rendang & Gulai Ayam',
      description: 'Paket nasi padang lengkap lauk rendang sapi empuk, gulai ayam, sayur nangka, dan sambal hijau segar.',
      photo: '/images/surplus-gourmet.jpg',
      quantity: 5,
      portionCount: 12,
      productionTime: new Date(Date.now() - 3 * 3600000).toISOString(),
      expiryTime: hoursFromNow(4),
      status: 'active',
      price: 0,
      isFree: true,
      foodCategory: 'nasi',
      location: { lat: -6.9530, lng: 107.6320 },
      address: 'Jl. Buahbatu No. 182, Buahbatu, Bandung',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'surplus-bdg-3',
      providerId: 'penyedia-bdg-3',
      providerName: 'Dian Permata',
      providerBusinessName: 'Katering Mitra Batununggal',
      name: 'Nasi Bento Katering Seminar',
      description: 'Nasi bento higienis isi ayam teriyaki, egg roll, salad mayones, dan nasi pulen sisa pesanan seminar.',
      photo: '/images/surplus-gourmet.jpg',
      quantity: 4,
      portionCount: 10,
      productionTime: new Date(Date.now() - 1.5 * 3600000).toISOString(),
      expiryTime: hoursFromNow(6),
      status: 'active',
      price: 8000,
      isFree: false,
      foodCategory: 'nasi',
      location: { lat: -6.9580, lng: 107.6340 },
      address: 'Jl. Batununggal Indah No. 12, Batununggal',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'surplus-bdg-4',
      providerId: 'penyedia-bdg-4',
      providerName: 'Kang Cecep',
      providerBusinessName: 'Dapur Lengkong Tradisional',
      name: 'Paket Nasi Timbel Komplit',
      description: 'Nasi timbel daun pisang, ayam goreng lengkuas, gepuk daging sapi, tahu tempe dan sambal dadak.',
      photo: '/images/surplus-gourmet.jpg',
      quantity: 7,
      portionCount: 18,
      productionTime: new Date(Date.now() - 2.5 * 3600000).toISOString(),
      expiryTime: hoursFromNow(3.5),
      status: 'active',
      price: 0,
      isFree: true,
      foodCategory: 'nasi',
      location: { lat: -6.9385, lng: 107.6210 },
      address: 'Jl. Lengkong Besar No. 40, Lengkong',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'surplus-bdg-5',
      providerId: 'penyedia-bdg-5',
      providerName: 'Habib Umar',
      providerBusinessName: 'Resto Timur Tengah Dayeuhkolot',
      name: 'Nasi Kebuli Daging Kambing',
      description: 'Nasi kebuli rempah arabian dengan potongan daging kambing empuk, acar nanas, dan kerupuk emping.',
      photo: '/images/surplus-gourmet.jpg',
      quantity: 5,
      portionCount: 14,
      productionTime: new Date(Date.now() - 4 * 3600000).toISOString(),
      expiryTime: hoursFromNow(5),
      status: 'active',
      price: 10000,
      isFree: false,
      foodCategory: 'nasi',
      location: { lat: -6.9830, lng: 107.6245 },
      address: 'Jl. Raya Dayeuhkolot No. 88, Dayeuhkolot',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'surplus-bdg-6',
      providerId: 'penyedia-bdg-6',
      providerName: 'Jeanne Marie',
      providerBusinessName: 'Artisan Bakery Buahbatu',
      name: 'Aneka Roti Manis & Butter Croissant',
      description: 'Croissant mentega Perancis, roti sobek cokelat, danish buah berry. Dipanggang pagi ini, masih renyah.',
      photo: '/images/surplus-bakery.jpg',
      quantity: 3,
      portionCount: 15,
      productionTime: new Date(Date.now() - 5 * 3600000).toISOString(),
      expiryTime: hoursFromNow(7),
      status: 'active',
      price: 5000,
      isFree: false,
      foodCategory: 'roti',
      location: { lat: -6.9460, lng: 107.6290 },
      address: 'Jl. Buahbatu No. 90, Buahbatu, Bandung',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'surplus-bdg-7',
      providerId: 'penyedia-bdg-7',
      providerName: 'Ratna Sari',
      providerBusinessName: 'Bakery Sourdough Bojongsoang',
      name: 'Roti Sourdough & Baguette Organik',
      description: 'Artisan rustic sourdough loaf dan baguette gandum organik tanpa pengawet. Sangat bergizi.',
      photo: '/images/surplus-bakery.jpg',
      quantity: 3,
      portionCount: 10,
      productionTime: new Date(Date.now() - 4 * 3600000).toISOString(),
      expiryTime: hoursFromNow(8),
      status: 'active',
      price: 0,
      isFree: true,
      foodCategory: 'roti',
      location: { lat: -6.9685, lng: 107.6360 },
      address: 'Jl. Raya Bojongsoang No. 112, Bojongsoang',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'surplus-bdg-8',
      providerId: 'penyedia-bdg-8',
      providerName: 'Hendra Gunawan',
      providerBusinessName: 'Resto Sehat Alami Batununggal',
      name: 'Capcay Seafood & Tahu Organik',
      description: 'Capcay sayur kuah kental dengan udang, bakso ikan, brokoli, wortel manis, dan tahu sutra organik.',
      photo: '/images/surplus-produce.jpg',
      quantity: 4,
      portionCount: 12,
      productionTime: new Date(Date.now() - 2 * 3600000).toISOString(),
      expiryTime: hoursFromNow(4.5),
      status: 'active',
      price: 0,
      isFree: true,
      foodCategory: 'sayur',
      location: { lat: -6.9560, lng: 107.6280 },
      address: 'Jl. Batununggal Indah IV No. 18, Bandung',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'surplus-bdg-9',
      providerId: 'penyedia-bdg-9',
      providerName: 'Pak Dedi',
      providerBusinessName: 'Kios Sayur Mitra Ciganitri',
      name: 'Paket Sayuran Segar Lembang',
      description: 'Buncis, wortel organik, sawi putih, dan tomat merah segar panenan kebun mitra Lembang.',
      photo: '/images/surplus-produce.jpg',
      quantity: 6,
      portionCount: 16,
      productionTime: new Date(Date.now() - 6 * 3600000).toISOString(),
      expiryTime: hoursFromNow(6),
      status: 'active',
      price: 4000,
      isFree: false,
      foodCategory: 'sayur',
      location: { lat: -6.9765, lng: 107.6405 },
      address: 'Jl. Ciganitri No. 25, Bojongsoang',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'surplus-bdg-10',
      providerId: 'penyedia-bdg-10',
      providerName: 'Ibu Ningsih',
      providerBusinessName: 'Kios Buah Berkah Bojongsoang',
      name: 'Semangka & Melon Potong Higienis',
      description: 'Semangka merah tanpa biji dan melon madu manis potongan segar dalam kotak food-grade tertutup.',
      photo: '/images/surplus-produce.jpg',
      quantity: 5,
      portionCount: 15,
      productionTime: new Date(Date.now() - 1 * 3600000).toISOString(),
      expiryTime: hoursFromNow(5.5),
      status: 'active',
      price: 0,
      isFree: true,
      foodCategory: 'buah',
      location: { lat: -6.9730, lng: 107.6310 },
      address: 'Jl. Raya Bojongsoang No. 34, Bojongsoang',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'surplus-bdg-11',
      providerId: 'penyedia-bdg-11',
      providerName: 'Kopi Seduh Team',
      providerBusinessName: 'Kafe Kopi Seduh Lengkong',
      name: 'Cold Brew Botanical Tea & Coffee',
      description: 'Cold brew tea melati dan kopi cold brew arabika single origin dalam botol kaca 350ml steril.',
      photo: '/images/surplus-beverage.jpg',
      quantity: 3,
      portionCount: 8,
      productionTime: new Date(Date.now() - 3 * 3600000).toISOString(),
      expiryTime: hoursFromNow(9),
      status: 'active',
      price: 5000,
      isFree: false,
      foodCategory: 'minuman',
      location: { lat: -6.9340, lng: 107.6190 },
      address: 'Jl. Lengkong Kecil No. 22, Lengkong, Bandung',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'surplus-bdg-12',
      providerId: 'penyedia-bdg-12',
      providerName: 'Ibu Eni',
      providerBusinessName: 'Kedai Segar Bojongsoang',
      name: 'Jus Jeruk Peras & Alpukat Murni',
      description: 'Jus jeruk peras murni tanpa gula pasir dan jus alpukat mentega segar dingin kemasan botol.',
      photo: '/images/surplus-beverage.jpg',
      quantity: 3,
      portionCount: 10,
      productionTime: new Date(Date.now() - 2 * 3600000).toISOString(),
      expiryTime: hoursFromNow(5),
      status: 'active',
      price: 0,
      isFree: true,
      foodCategory: 'minuman',
      location: { lat: -6.9695, lng: 107.6350 },
      address: 'Jl. Raya Bojongsoang No. 78, Bojongsoang',
      createdAt: new Date().toISOString(),
    },
  ];
}

export function getSurplusItems(): SurplusItem[] {
  let items = getStore<SurplusItem>(STORAGE_KEYS.surplusItems);
  if (!items.some((i) => i.id.startsWith('surplus-bdg'))) {
    const bdgItems = getBandungSeedItems();
    items = [...bdgItems, ...items.filter((i) => !i.id.startsWith('surplus-bdg'))];
    setStore(STORAGE_KEYS.surplusItems, items);
  }
  return items;
}

export function getActiveSurplus(): SurplusItem[] {
  const now = new Date().toISOString();
  return getSurplusItems().filter(
    (s) => s.status === 'active' && s.expiryTime > now
  );
}

export function getSurplusByProvider(providerId: string): SurplusItem[] {
  return getSurplusItems().filter((s) => s.providerId === providerId);
}

export function getSurplusById(id: string): SurplusItem | undefined {
  return getSurplusItems().find((s) => s.id === id);
}

export function createSurplus(
  item: Omit<SurplusItem, 'id' | 'createdAt' | 'status'>
): SurplusItem {
  const items = getSurplusItems();
  const newItem: SurplusItem = {
    ...item,
    id: generateId(),
    status: 'active',
    createdAt: new Date().toISOString(),
  };
  items.push(newItem);
  setStore(STORAGE_KEYS.surplusItems, items);
  return newItem;
}

export function updateSurplus(
  id: string,
  updates: Partial<SurplusItem>
): SurplusItem | null {
  const items = getSurplusItems();
  const idx = items.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...updates };
  setStore(STORAGE_KEYS.surplusItems, items);
  return items[idx];
}

export function deleteSurplus(id: string): boolean {
  const items = getSurplusItems();
  const filtered = items.filter((s) => s.id !== id);
  if (filtered.length === items.length) return false;
  setStore(STORAGE_KEYS.surplusItems, filtered);
  return true;
}

// ============================================================
// Bookings
// ============================================================

export function getBookings(): Booking[] {
  return getStore<Booking>(STORAGE_KEYS.bookings);
}

export function getBookingById(id: string): Booking | undefined {
  return getBookings().find((b) => b.id === id);
}

export function getBookingsByRecipient(recipientId: string): Booking[] {
  return getBookings().filter((b) => b.recipientId === recipientId);
}

export function getBookingsByProvider(providerId: string): Booking[] {
  return getBookings().filter((b) => b.providerId === providerId);
}

export function getBookingBySurplus(surplusId: string): Booking | undefined {
  return getBookings().find(
    (b) => b.surplusId === surplusId && !['dibatalkan', 'kedaluwarsa'].includes(b.status)
  );
}

export function createBooking(
  booking: Omit<Booking, 'id' | 'bookedAt' | 'status'>
): Booking {
  const bookings = getBookings();
  const newBooking: Booking = {
    ...booking,
    id: generateId(),
    status: 'menunggu',
    bookedAt: new Date().toISOString(),
  };
  bookings.push(newBooking);
  setStore(STORAGE_KEYS.bookings, bookings);

  // Update surplus status
  updateSurplus(booking.surplusId, { status: 'booked' });

  return newBooking;
}

export function updateBookingStatus(
  id: string,
  status: BookingStatus
): Booking | null {
  const bookings = getBookings();
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx === -1) return null;

  bookings[idx].status = status;

  // Set timestamps based on status
  const now = new Date().toISOString();
  switch (status) {
    case 'dikonfirmasi':
      bookings[idx].confirmedAt = now;
      bookings[idx].pickupDeadline = hoursFromNow(2);
      break;
    case 'diambil':
      bookings[idx].pickedUpAt = now;
      // Update surplus to completed
      updateSurplus(bookings[idx].surplusId, { status: 'completed' });
      break;
    case 'dibatalkan':
      bookings[idx].cancelledAt = now;
      // Re-activate surplus
      updateSurplus(bookings[idx].surplusId, { status: 'active' });
      break;
    case 'kedaluwarsa':
      bookings[idx].expiredAt = now;
      // Re-activate surplus
      updateSurplus(bookings[idx].surplusId, { status: 'active' });
      break;
  }

  setStore(STORAGE_KEYS.bookings, bookings);
  return bookings[idx];
}

// ============================================================
// Notifications
// ============================================================

export function getNotifications(userId: string): Notification[] {
  return getStore<Notification>(STORAGE_KEYS.notifications).filter(
    (n) => n.userId === userId
  );
}

export function addNotification(
  notification: Omit<Notification, 'id' | 'createdAt' | 'read'>
): Notification {
  const notifications = getStore<Notification>(STORAGE_KEYS.notifications);
  const newNotification: Notification = {
    ...notification,
    id: generateId(),
    read: false,
    createdAt: new Date().toISOString(),
  };
  notifications.unshift(newNotification);
  setStore(STORAGE_KEYS.notifications, notifications);
  return newNotification;
}

export function markNotificationRead(id: string): void {
  const notifications = getStore<Notification>(STORAGE_KEYS.notifications);
  const idx = notifications.findIndex((n) => n.id === id);
  if (idx !== -1) {
    notifications[idx].read = true;
    setStore(STORAGE_KEYS.notifications, notifications);
  }
}

export function getUnreadCount(userId: string): number {
  return getNotifications(userId).filter((n) => !n.read).length;
}

// ============================================================
// Impact Data Calculation
// ============================================================

export function calculateImpact(): ImpactData {
  const bookings = getBookings().filter((b) => b.status === 'diambil');
  const totalKgSaved = bookings.reduce((sum, b) => sum + b.quantity, 0);
  const totalCO2eSaved = totalKgSaved * CO2E_FACTOR;

  const providerIds = new Set(getUsers().filter(u => u.role === 'penyedia').map(u => u.id));
  const recipientIds = new Set(getUsers().filter(u => u.role === 'penerima').map(u => u.id));

  return {
    totalKgSaved,
    totalPortions: Math.round(totalKgSaved * 3), // ~3 portions per kg
    totalCO2eSaved,
    totalTransactions: bookings.length,
    totalProviders: providerIds.size,
    totalRecipients: recipientIds.size,
    treeEquivalent: Math.round((totalCO2eSaved / TREE_CO2_ABSORPTION) * 10) / 10,
  };
}

export function getImpactTimeline(): ImpactTimeline[] {
  const bookings = getBookings().filter((b) => b.status === 'diambil');
  const timeline: Record<string, ImpactTimeline> = {};

  bookings.forEach((b) => {
    const date = b.pickedUpAt
      ? new Date(b.pickedUpAt).toISOString().split('T')[0]
      : new Date(b.bookedAt).toISOString().split('T')[0];

    if (!timeline[date]) {
      timeline[date] = { date, kgSaved: 0, transactions: 0, co2eSaved: 0 };
    }
    timeline[date].kgSaved += b.quantity;
    timeline[date].transactions += 1;
    timeline[date].co2eSaved += b.quantity * CO2E_FACTOR;
  });

  return Object.values(timeline).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

// ============================================================
// Expiry Checker (run periodically)
// ============================================================

export function checkAndExpireItems(): void {
  const now = new Date().toISOString();

  // Expire surplus items past their expiry time
  const items = getSurplusItems();
  let itemsChanged = false;
  items.forEach((item) => {
    if (item.status === 'active' && item.expiryTime <= now) {
      item.status = 'expired';
      itemsChanged = true;
    }
  });
  if (itemsChanged) setStore(STORAGE_KEYS.surplusItems, items);

  // Expire bookings past their pickup deadline
  const bookings = getBookings();
  let bookingsChanged = false;
  bookings.forEach((booking) => {
    if (
      booking.status === 'dikonfirmasi' &&
      booking.pickupDeadline &&
      booking.pickupDeadline <= now
    ) {
      booking.status = 'kedaluwarsa';
      booking.expiredAt = now;
      bookingsChanged = true;
      // Re-activate the surplus item
      const item = items.find((i) => i.id === booking.surplusId);
      if (item && item.expiryTime > now) {
        item.status = 'active';
        itemsChanged = true;
      }
    }
  });
  if (bookingsChanged) setStore(STORAGE_KEYS.bookings, bookings);
  if (itemsChanged) setStore(STORAGE_KEYS.surplusItems, items);
}

// ============================================================
// Seed Data
// ============================================================

export function seedData(): void {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem(STORAGE_KEYS.isSeeded)) return;

  // --- Seed Users ---
  const users: User[] = [
    {
      id: 'penyedia-1',
      name: 'Ahmad Fauzi',
      email: 'restoran@demo.com',
      password: 'demo123',
      role: 'penyedia',
      phone: '081234567890',
      businessName: 'Restoran Minang Jaya',
      businessType: 'restoran',
      businessAddress: 'Jl. Sudirman No. 45, Jakarta Pusat',
      location: { lat: -6.2088, lng: 106.8456 },
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    },
    {
      id: 'penyedia-2',
      name: 'Siti Rahayu',
      email: 'bakery@demo.com',
      password: 'demo123',
      role: 'penyedia',
      phone: '081298765432',
      businessName: 'Bakery Makmur',
      businessType: 'kafe',
      businessAddress: 'Jl. Thamrin No. 12, Jakarta Pusat',
      location: { lat: -6.1950, lng: 106.8230 },
      createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    },
    {
      id: 'penyedia-3',
      name: 'Budi Santoso',
      email: 'hotel@demo.com',
      password: 'demo123',
      role: 'penyedia',
      phone: '081311223344',
      businessName: 'Hotel Nusantara',
      businessType: 'hotel',
      businessAddress: 'Jl. Gatot Subroto No. 88, Jakarta Selatan',
      location: { lat: -6.2350, lng: 106.8270 },
      createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    },
    {
      id: 'penyedia-4',
      name: 'Dewi Lestari',
      email: 'katering@demo.com',
      password: 'demo123',
      role: 'penyedia',
      phone: '081455667788',
      businessName: 'Katering Nusantara',
      businessType: 'katering',
      businessAddress: 'Jl. Kemang Raya No. 33, Jakarta Selatan',
      location: { lat: -6.2600, lng: 106.8130 },
      createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    },
    {
      id: 'penyedia-5',
      name: 'Eko Prasetyo',
      email: 'supermarket@demo.com',
      password: 'demo123',
      role: 'penyedia',
      phone: '081599887766',
      businessName: 'Supermarket Fresh',
      businessType: 'supermarket',
      businessAddress: 'Jl. Rasuna Said No. 5, Jakarta Selatan',
      location: { lat: -6.2210, lng: 106.8510 },
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    },
    {
      id: 'penerima-1',
      name: 'Rina Wulandari',
      email: 'penerima@demo.com',
      password: 'demo123',
      role: 'penerima',
      phone: '082112345678',
      location: { lat: -6.2100, lng: 106.8400 },
      createdAt: new Date(Date.now() - 28 * 86400000).toISOString(),
    },
    {
      id: 'penerima-2',
      name: 'Yoga Pratama',
      email: 'yoga@demo.com',
      password: 'demo123',
      role: 'penerima',
      phone: '082198765432',
      location: { lat: -6.2200, lng: 106.8500 },
      createdAt: new Date(Date.now() - 22 * 86400000).toISOString(),
    },
    {
      id: 'admin-1',
      name: 'Admin AksesPangan',
      email: 'admin@demo.com',
      password: 'admin123',
      role: 'admin',
      phone: '080000000001',
      createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    },
  ];

  // --- Seed Surplus Items ---
  const surplusItems: SurplusItem[] = [
    {
      id: 'surplus-1',
      providerId: 'penyedia-1',
      providerName: 'Ahmad Fauzi',
      providerBusinessName: 'Restoran Minang Jaya',
      name: 'Nasi Padang Sisa Catering',
      description: 'Nasi padang lengkap dengan rendang, gulai ayam, dan sayur nangka. Masih hangat dan segar dari catering acara kantor.',
      photo: '',
      quantity: 5,
      portionCount: 15,
      productionTime: new Date(Date.now() - 3 * 3600000).toISOString(),
      expiryTime: hoursFromNow(4),
      status: 'active',
      price: 0,
      isFree: true,
      foodCategory: 'nasi',
      location: { lat: -6.2088, lng: 106.8456 },
      address: 'Jl. Sudirman No. 45, Jakarta Pusat',
      createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    },
    {
      id: 'surplus-2',
      providerId: 'penyedia-2',
      providerName: 'Siti Rahayu',
      providerBusinessName: 'Bakery Makmur',
      name: 'Roti & Pastry Sisa Hari Ini',
      description: 'Aneka roti tawar, roti manis, croissant, dan danish pastry. Produksi hari ini, masih sangat layak konsumsi.',
      photo: '',
      quantity: 3,
      portionCount: 12,
      productionTime: new Date(Date.now() - 8 * 3600000).toISOString(),
      expiryTime: hoursFromNow(6),
      status: 'active',
      price: 5000,
      isFree: false,
      foodCategory: 'roti',
      location: { lat: -6.1950, lng: 106.8230 },
      address: 'Jl. Thamrin No. 12, Jakarta Pusat',
      createdAt: new Date(Date.now() - 1 * 3600000).toISOString(),
    },
    {
      id: 'surplus-3',
      providerId: 'penyedia-3',
      providerName: 'Budi Santoso',
      providerBusinessName: 'Hotel Nusantara',
      name: 'Sayur & Lauk Prasmanan',
      description: 'Sisa prasmanan makan siang hotel: capcay, ayam teriyaki, tumis kangkung, tahu goreng. Masih dalam kondisi baik.',
      photo: '',
      quantity: 8,
      portionCount: 24,
      productionTime: new Date(Date.now() - 4 * 3600000).toISOString(),
      expiryTime: hoursFromNow(3),
      status: 'active',
      price: 0,
      isFree: true,
      foodCategory: 'sayur',
      location: { lat: -6.2350, lng: 106.8270 },
      address: 'Jl. Gatot Subroto No. 88, Jakarta Selatan',
      createdAt: new Date(Date.now() - 1.5 * 3600000).toISOString(),
    },
    {
      id: 'surplus-4',
      providerId: 'penyedia-1',
      providerName: 'Ahmad Fauzi',
      providerBusinessName: 'Restoran Minang Jaya',
      name: 'Kue Tradisional Camilan',
      description: 'Klepon, onde-onde, lemper, dan kue lapis. Dibuat pagi ini untuk acara yang batal.',
      photo: '',
      quantity: 2,
      portionCount: 20,
      productionTime: new Date(Date.now() - 5 * 3600000).toISOString(),
      expiryTime: hoursFromNow(5),
      status: 'active',
      price: 3000,
      isFree: false,
      foodCategory: 'kue',
      location: { lat: -6.2088, lng: 106.8456 },
      address: 'Jl. Sudirman No. 45, Jakarta Pusat',
      createdAt: new Date(Date.now() - 4.5 * 3600000).toISOString(),
    },
    {
      id: 'surplus-5',
      providerId: 'penyedia-5',
      providerName: 'Eko Prasetyo',
      providerBusinessName: 'Supermarket Fresh',
      name: 'Buah Potong Segar',
      description: 'Campuran buah potong: semangka, melon, pepaya, dan nanas. Potongan segar dengan packaging higienis.',
      photo: '',
      quantity: 4,
      portionCount: 10,
      productionTime: new Date(Date.now() - 2 * 3600000).toISOString(),
      expiryTime: hoursFromNow(8),
      status: 'active',
      price: 10000,
      isFree: false,
      foodCategory: 'buah',
      location: { lat: -6.2210, lng: 106.8510 },
      address: 'Jl. Rasuna Said No. 5, Jakarta Selatan',
      createdAt: new Date(Date.now() - 1 * 3600000).toISOString(),
    },
    {
      id: 'surplus-6',
      providerId: 'penyedia-3',
      providerName: 'Budi Santoso',
      providerBusinessName: 'Hotel Nusantara',
      name: 'Ayam Goreng & Nasi Box',
      description: 'Nasi box ayam goreng kremes lengkap dengan lalapan dan sambal. Sisa event meeting room.',
      photo: '',
      quantity: 6,
      portionCount: 18,
      productionTime: new Date(Date.now() - 3 * 3600000).toISOString(),
      expiryTime: hoursFromNow(2),
      status: 'active',
      price: 0,
      isFree: true,
      foodCategory: 'lauk',
      location: { lat: -6.2350, lng: 106.8270 },
      address: 'Jl. Gatot Subroto No. 88, Jakarta Selatan',
      createdAt: new Date(Date.now() - 2.5 * 3600000).toISOString(),
    },
    {
      id: 'surplus-7',
      providerId: 'penyedia-4',
      providerName: 'Dewi Lestari',
      providerBusinessName: 'Katering Nusantara',
      name: 'Soto Betawi Porsi Besar',
      description: 'Soto betawi dengan kuah santan kental, daging sapi, dan pelengkap. Porsi besar untuk 10+ orang.',
      photo: '',
      quantity: 3,
      portionCount: 10,
      productionTime: new Date(Date.now() - 4 * 3600000).toISOString(),
      expiryTime: hoursFromNow(3),
      status: 'active',
      price: 8000,
      isFree: false,
      foodCategory: 'lauk',
      location: { lat: -6.2600, lng: 106.8130 },
      address: 'Jl. Kemang Raya No. 33, Jakarta Selatan',
      createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    },
    {
      id: 'surplus-8',
      providerId: 'penyedia-2',
      providerName: 'Siti Rahayu',
      providerBusinessName: 'Bakery Makmur',
      name: 'Jus Buah Segar',
      description: 'Jus jeruk, mangga, dan alpukat yang baru dibuat. Dalam botol 500ml, masih dingin.',
      photo: '',
      quantity: 2,
      portionCount: 8,
      productionTime: new Date(Date.now() - 1 * 3600000).toISOString(),
      expiryTime: hoursFromNow(5),
      status: 'active',
      price: 5000,
      isFree: false,
      foodCategory: 'minuman',
      location: { lat: -6.1950, lng: 106.8230 },
      address: 'Jl. Thamrin No. 12, Jakarta Pusat',
      createdAt: new Date(Date.now() - 0.5 * 3600000).toISOString(),
    },
    {
      id: 'surplus-9',
      providerId: 'penyedia-4',
      providerName: 'Dewi Lestari',
      providerBusinessName: 'Katering Nusantara',
      name: 'Nasi Tumpeng Sisa Acara',
      description: 'Nasi tumpeng komplit dengan ayam goreng, perkedel, urap, telur pindang, dan sambal goreng. Sisa acara ulang tahun.',
      photo: '',
      quantity: 10,
      portionCount: 30,
      productionTime: new Date(Date.now() - 5 * 3600000).toISOString(),
      expiryTime: hoursFromNow(2),
      status: 'active',
      price: 0,
      isFree: true,
      foodCategory: 'nasi',
      location: { lat: -6.2600, lng: 106.8130 },
      address: 'Jl. Kemang Raya No. 33, Jakarta Selatan',
      createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    },
    {
      id: 'surplus-10',
      providerId: 'penyedia-5',
      providerName: 'Eko Prasetyo',
      providerBusinessName: 'Supermarket Fresh',
      name: 'Salad Bowl Segar',
      description: 'Mixed green salad dengan dressing terpisah: caesar, thousand island, balsamic. Packaging individual.',
      photo: '',
      quantity: 1.5,
      portionCount: 6,
      productionTime: new Date(Date.now() - 3 * 3600000).toISOString(),
      expiryTime: hoursFromNow(6),
      status: 'active',
      price: 12000,
      isFree: false,
      foodCategory: 'sayur',
      location: { lat: -6.2210, lng: 106.8510 },
      address: 'Jl. Rasuna Said No. 5, Jakarta Selatan',
      createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    },
  ];

  // --- Seed completed bookings for impact data ---
  const bookings: Booking[] = [
    {
      id: 'booking-hist-1',
      surplusId: 'surplus-hist-1',
      surplusName: 'Nasi Goreng Sisa Event',
      surplusPhoto: '',
      providerId: 'penyedia-1',
      providerBusinessName: 'Restoran Minang Jaya',
      recipientId: 'penerima-1',
      recipientName: 'Rina Wulandari',
      recipientPhone: '082112345678',
      quantity: 4,
      status: 'diambil',
      bookedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      confirmedAt: new Date(Date.now() - 7 * 86400000 + 1800000).toISOString(),
      pickedUpAt: new Date(Date.now() - 7 * 86400000 + 3600000).toISOString(),
      pickupDeadline: new Date(Date.now() - 7 * 86400000 + 7200000).toISOString(),
      pickupLocation: { lat: -6.2088, lng: 106.8456 },
      pickupAddress: 'Jl. Sudirman No. 45',
    },
    {
      id: 'booking-hist-2',
      surplusId: 'surplus-hist-2',
      surplusName: 'Roti Tawar & Selai',
      surplusPhoto: '',
      providerId: 'penyedia-2',
      providerBusinessName: 'Bakery Makmur',
      recipientId: 'penerima-2',
      recipientName: 'Yoga Pratama',
      recipientPhone: '082198765432',
      quantity: 2,
      status: 'diambil',
      bookedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      confirmedAt: new Date(Date.now() - 5 * 86400000 + 900000).toISOString(),
      pickedUpAt: new Date(Date.now() - 5 * 86400000 + 2700000).toISOString(),
      pickupDeadline: new Date(Date.now() - 5 * 86400000 + 7200000).toISOString(),
      pickupLocation: { lat: -6.1950, lng: 106.8230 },
      pickupAddress: 'Jl. Thamrin No. 12',
    },
    {
      id: 'booking-hist-3',
      surplusId: 'surplus-hist-3',
      surplusName: 'Sayur Lodeh & Tempe',
      surplusPhoto: '',
      providerId: 'penyedia-3',
      providerBusinessName: 'Hotel Nusantara',
      recipientId: 'penerima-1',
      recipientName: 'Rina Wulandari',
      recipientPhone: '082112345678',
      quantity: 6,
      status: 'diambil',
      bookedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      confirmedAt: new Date(Date.now() - 3 * 86400000 + 1200000).toISOString(),
      pickedUpAt: new Date(Date.now() - 3 * 86400000 + 3000000).toISOString(),
      pickupDeadline: new Date(Date.now() - 3 * 86400000 + 7200000).toISOString(),
      pickupLocation: { lat: -6.2350, lng: 106.8270 },
      pickupAddress: 'Jl. Gatot Subroto No. 88',
    },
    {
      id: 'booking-hist-4',
      surplusId: 'surplus-hist-4',
      surplusName: 'Nasi Kuning Komplit',
      surplusPhoto: '',
      providerId: 'penyedia-4',
      providerBusinessName: 'Katering Nusantara',
      recipientId: 'penerima-2',
      recipientName: 'Yoga Pratama',
      recipientPhone: '082198765432',
      quantity: 8,
      status: 'diambil',
      bookedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      confirmedAt: new Date(Date.now() - 2 * 86400000 + 600000).toISOString(),
      pickedUpAt: new Date(Date.now() - 2 * 86400000 + 1800000).toISOString(),
      pickupDeadline: new Date(Date.now() - 2 * 86400000 + 7200000).toISOString(),
      pickupLocation: { lat: -6.2600, lng: 106.8130 },
      pickupAddress: 'Jl. Kemang Raya No. 33',
    },
    {
      id: 'booking-hist-5',
      surplusId: 'surplus-hist-5',
      surplusName: 'Buah Segar Campur',
      surplusPhoto: '',
      providerId: 'penyedia-5',
      providerBusinessName: 'Supermarket Fresh',
      recipientId: 'penerima-1',
      recipientName: 'Rina Wulandari',
      recipientPhone: '082112345678',
      quantity: 3,
      status: 'diambil',
      bookedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      confirmedAt: new Date(Date.now() - 1 * 86400000 + 900000).toISOString(),
      pickedUpAt: new Date(Date.now() - 1 * 86400000 + 2400000).toISOString(),
      pickupDeadline: new Date(Date.now() - 1 * 86400000 + 7200000).toISOString(),
      pickupLocation: { lat: -6.2210, lng: 106.8510 },
      pickupAddress: 'Jl. Rasuna Said No. 5',
    },
  ];

  setStore(STORAGE_KEYS.users, users);
  setStore(STORAGE_KEYS.surplusItems, surplusItems);
  setStore(STORAGE_KEYS.bookings, bookings);
  setStore(STORAGE_KEYS.notifications, []);
  localStorage.setItem(STORAGE_KEYS.isSeeded, 'true');
}
