'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, List, Map, Filter, Clock, Search, X, CheckCircle2, ChevronRight, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { getActiveSurplus, getBookingBySurplus } from '@/lib/data';
import { surplusService } from '@/services/surplusService';
import { bookingService } from '@/services/bookingService';
import { formatCountdown, formatPrice, calculateDistance } from '@/lib/utils';
import { FOOD_CATEGORY_LABELS, FOOD_CATEGORY_EMOJI } from '@/types';
import { DEFAULT_CENTER } from '@/lib/constants';
import type { SurplusItem, FoodCategory, Coordinates } from '@/types';
import { CheckoutModal } from '@/components/surplus/CheckoutModal';
import dynamic from 'next/dynamic';

// Dynamic import for Leaflet (SSR incompatible)
const MapComponent = dynamic(() => import('@/components/surplus/SurplusMap'), { ssr: false });

export function PenerimaDashboard() {
  const { user } = useAuth();
  const { success, warning } = useNotification();
  const [items, setItems] = useState<SurplusItem[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [userLocation, setUserLocation] = useState<Coordinates>(DEFAULT_CENTER);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'all'>('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [selectedItem, setSelectedItem] = useState<SurplusItem | null>(null);
  const [isBookingLoading, setIsBookingLoading] = useState(false);

  const refreshItems = async () => {
    try {
      const data = await surplusService.getAll();
      setItems(data);
    } catch {
      setItems(getActiveSurplus());
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation(user?.location || DEFAULT_CENTER)
      );
    }
    refreshItems();
  }, [user]);

  // Filter & sort items by distance
  const filteredItems = useMemo(() => {
    return items
      .map((item) => ({
        ...item,
        distance: calculateDistance(userLocation, item.location),
      }))
      .filter((item) => {
        if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) && !item.description.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        if (selectedCategory !== 'all' && item.foodCategory !== selectedCategory) return false;
        if (priceFilter === 'free' && !item.isFree) return false;
        if (priceFilter === 'paid' && item.isFree) return false;
        return true;
      })
      .sort((a, b) => a.distance - b.distance);
  }, [items, userLocation, searchQuery, selectedCategory, priceFilter]);

  const handleBook = async (item: SurplusItem) => {
    if (!user) {
      window.location.hash = '#/login';
      return;
    }

    setIsBookingLoading(true);
    try {
      await bookingService.create({
        surplusId: item.id,
        quantity: item.quantity,
        recipientId: user.id,
        recipientName: user.name,
        recipientPhone: user.phone || '08123456789',
      });

      success('Pemesanan Berhasil! 🎉', `${item.name} telah dipesan. Dialihkan ke tiket pesanan Anda...`);
      setSelectedItem(null);
      refreshItems();
      setTimeout(() => {
        window.location.hash = '#/penerima/booking';
      }, 500);
    } catch (err: any) {
      warning('Perhatian', err.message || 'Item tidak dapat dipesan saat ini');
      refreshItems();
    } finally {
      setIsBookingLoading(false);
    }
  };

  const categories: { id: FoodCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'Semua Kategori' },
    { id: 'nasi', label: '🍱 Nasi & Lauk' },
    { id: 'roti', label: '🥐 Roti & Pastry' },
    { id: 'sayur', label: '🥗 Sayuran' },
    { id: 'buah', label: '🍎 Buah-buahan' },
    { id: 'minuman', label: '🧃 Minuman' },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7] py-8 px-4 sm:px-8">
      <div className="apple-container-wide">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-display-lg text-[#1d1d1f] mb-1">
            Katalog Makanan Surplus
          </h1>
          <p className="text-body-apple text-[#86868b]">
            Makanan layak konsumsi siap diselamatkan dari restoran dan toko terdekat.
          </p>
        </div>

        {/* Search Bar & View Controls (Apple Search Pill + Segmented Switcher) */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Apple Search Input */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari makanan, restoran, atau alamat..."
              className="apple-search-pill"
            />
          </div>

          {/* Segmented View Switcher */}
          <div className="flex items-center bg-white border border-[rgba(0,0,0,0.08)] rounded-full p-1 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-[#1d1d1f] text-white'
                  : 'text-[#1d1d1f] hover:text-[#86868b]'
              }`}
            >
              <List size={16} /> Daftar ({filteredItems.length})
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                viewMode === 'map'
                  ? 'bg-[#1d1d1f] text-white'
                  : 'text-[#1d1d1f] hover:text-[#86868b]'
              }`}
            >
              <Map size={16} /> Peta
            </button>
          </div>
        </div>

        {/* Category Option Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`apple-chip ${
                selectedCategory === cat.id ? 'apple-chip-active' : ''
              }`}
            >
              {cat.label}
            </button>
          ))}

          <div className="h-5 w-[1px] bg-[rgba(0,0,0,0.12)] mx-1" />

          {/* Price Quick Filter */}
          <button
            onClick={() => setPriceFilter(priceFilter === 'free' ? 'all' : 'free')}
            className={`apple-chip ${
              priceFilter === 'free' ? 'apple-chip-active' : ''
            }`}
          >
            ✨ Hanya Gratis
          </button>
        </div>

        {/* Content View: List or Map */}
        {viewMode === 'map' ? (
          <div className="w-full h-[580px] rounded-[18px] overflow-hidden border border-[rgba(0,0,0,0.08)] bg-white product-hero-shadow relative">
            <MapComponent
              items={filteredItems}
              center={userLocation}
              onItemClick={(item) => setSelectedItem(item)}
              selectedCategory={selectedCategory}
            />
          </div>
        ) : (
          <div>
            {filteredItems.length === 0 ? (
              <div className="bg-white rounded-[18px] p-12 text-center border border-[rgba(0,0,0,0.08)] max-w-md mx-auto">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="text-body-strong mb-1">Tidak Ada Makanan Ditemukan</h3>
                <p className="text-caption-apple text-[#86868b] mb-4">
                  Coba ubah kata kunci atau ganti filter kategori.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setPriceFilter('all');
                  }}
                  className="btn-apple-secondary text-sm"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="card-apple-utility flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Meta Bar */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-[#f5f5f7] rounded-[14px] flex items-center justify-center text-2xl">
                          {FOOD_CATEGORY_EMOJI[item.foodCategory] || '🍽️'}
                        </div>
                        <span
                          className={`badge-apple ${
                            item.isFree ? 'badge-apple-success' : 'badge-apple-info'
                          }`}
                        >
                          {item.isFree ? 'GRATIS' : formatPrice(item.price)}
                        </span>
                      </div>

                      {/* Title & Provider */}
                      <h3 className="text-body-strong text-[#1d1d1f] mb-1 line-clamp-1">
                        {item.name}
                      </h3>
                      <div className="text-caption-apple text-[#86868b] mb-3 flex items-center gap-1.5">
                        <MapPin size={13} className="text-[#1d1d1f]" />
                        <span className="line-clamp-1">
                          {item.providerBusinessName} • {Math.round(item.distance * 10) / 10} km
                        </span>
                      </div>

                      <p className="text-caption-apple text-[#1d1d1f] mb-6 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    {/* Bottom Action Area */}
                    <div className="pt-4 border-t border-[rgba(0,0,0,0.06)] flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-fine-print text-[#86868b]">Waktu Habis</span>
                        <div className="text-caption-strong text-[#ff9500] flex items-center gap-1">
                          <Clock size={13} />
                          <span>{formatCountdown(item.expiryTime)}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedItem(item)}
                        className="btn-apple-primary btn-apple-sm text-xs"
                      >
                        Detail & Pesan
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Interactive E-Commerce Checkout Modal with Safety Specs */}
      <CheckoutModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onConfirmCheckout={handleBook}
        isLoading={isBookingLoading}
      />
    </div>
  );
}
