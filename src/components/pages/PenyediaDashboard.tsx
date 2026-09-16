'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, ClipboardList, CheckCircle, Plus, TrendingUp, ArrowRight, Store } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getSurplusByProvider, getBookingsByProvider } from '@/lib/data';
import { surplusService } from '@/services/surplusService';
import { bookingService } from '@/services/bookingService';
import { formatCountdown, formatPrice } from '@/lib/utils';
import { FOOD_CATEGORY_EMOJI } from '@/types';
import type { SurplusItem, Booking } from '@/types';

export function PenyediaDashboard() {
  const { user } = useAuth();
  const [surplus, setSurplus] = useState<SurplusItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!user) return;
    const providerId = user.id;
    async function load() {
      try {
        const [s, b] = await Promise.all([
          surplusService.getByProvider(providerId),
          bookingService.getByProvider(providerId),
        ]);
        setSurplus(s);
        setBookings(b);
      } catch {
        setSurplus(getSurplusByProvider(providerId));
        setBookings(getBookingsByProvider(providerId));
      }
    }
    load();
  }, [user]);

  if (!user) return null;

  const activeItems = surplus.filter((s) => s.status === 'active');
  const pendingBookings = bookings.filter((b) => b.status === 'menunggu');
  const completedBookings = bookings.filter((b) => b.status === 'diambil');
  const totalKg = completedBookings.reduce((sum, b) => sum + b.quantity, 0);

  const stats = [
    { label: 'Surplus Aktif', value: activeItems.length, unit: 'item', icon: Package, color: '#0066cc' },
    { label: 'Booking Masuk', value: pendingBookings.length, unit: 'pesanan', icon: ClipboardList, color: '#ff9500' },
    { label: 'Makanan Disalurkan', value: totalKg, unit: 'kg', icon: CheckCircle, color: '#34c759' },
    { label: 'Total Transaksi', value: completedBookings.length, unit: 'kali', icon: TrendingUp, color: '#1d1d1f' },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7] py-8 px-4 sm:px-8">
      <div className="apple-container">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-caption-strong text-[#0066cc] uppercase tracking-wide mb-1 inline-block">
              Portal Mitra Usaha
            </span>
            <h1 className="text-display-lg text-[#1d1d1f]">
              {user.businessName || user.name}
            </h1>
            <p className="text-body-apple text-[#86868b] m-0">
              Kelola stok makanan surplus dan pantau pesanan pengambilan masyarakat.
            </p>
          </div>

          <a href="#/penyedia/surplus" className="btn-apple-primary self-start sm:self-auto">
            <Plus size={16} /> Unggah Surplus Baru
          </a>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((st) => (
            <div key={st.label} className="card-apple-utility bg-white p-5 text-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: `${st.color}15`, color: st.color }}
              >
                <st.icon size={20} />
              </div>
              <div className="text-display-md font-semibold text-[#1d1d1f] mb-0.5">
                {st.value} <span className="text-xs font-normal text-[#86868b]">{st.unit}</span>
              </div>
              <div className="text-caption-apple text-[#86868b]">{st.label}</div>
            </div>
          ))}
        </div>

        {/* Active Surplus Items Section */}
        <div className="card-apple-utility bg-white p-6 sm:p-8 mb-8">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[rgba(0,0,0,0.06)]">
            <div>
              <h3 className="text-tagline text-[#1d1d1f] mb-0.5">Stok Surplus Aktif</h3>
              <p className="text-caption-apple text-[#86868b] m-0">Makanan yang saat ini tampil di peta pencarian</p>
            </div>
            <a href="#/penyedia/surplus" className="link-apple text-caption-strong">
              Kelola Semua ({surplus.length}) <ArrowRight size={14} />
            </a>
          </div>

          {activeItems.length === 0 ? (
            <div className="text-center py-12 text-[#86868b]">
              <div className="text-3xl mb-2">📦</div>
              <p className="text-body-apple m-0">Belum ada surplus aktif saat ini.</p>
              <a href="#/penyedia/surplus" className="link-apple text-sm mt-2 inline-block">
                + Tambah surplus makanan pertama Anda
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeItems.map((item) => (
                <div key={item.id} className="p-4 rounded-[14px] bg-[#f5f5f7] flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-2xl">{FOOD_CATEGORY_EMOJI[item.foodCategory] || '🍱'}</span>
                      <span className="badge-apple badge-apple-neutral text-xs">
                        {item.isFree ? 'Gratis' : formatPrice(item.price)}
                      </span>
                    </div>
                    <div className="text-body-strong text-[#1d1d1f] line-clamp-1 mb-1">{item.name}</div>
                    <div className="text-caption-apple text-[#86868b] mb-2">{item.quantity} kg • {item.portionCount} porsi</div>
                  </div>
                  <div className="text-fine-print text-[#ff9500] font-medium pt-2 border-t border-[rgba(0,0,0,0.06)]">
                    Sisa waktu: {formatCountdown(item.expiryTime)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Incoming Bookings Section */}
        <div className="card-apple-utility bg-white p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[rgba(0,0,0,0.06)]">
            <div>
              <h3 className="text-tagline text-[#1d1d1f] mb-0.5">Booking Menunggu Konfirmasi</h3>
              <p className="text-caption-apple text-[#86868b] m-0">Permintaan pengambilan dari penerima manfaat</p>
            </div>
            <a href="#/penyedia/booking" className="link-apple text-caption-strong">
              Lihat Riwayat Booking <ArrowRight size={14} />
            </a>
          </div>

          {pendingBookings.length === 0 ? (
            <div className="text-center py-8 text-[#86868b]">
              <div className="text-2xl mb-1">✅</div>
              <p className="text-body-apple m-0">Tidak ada booking yang menunggu konfirmasi.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingBookings.map((b) => (
                <div key={b.id} className="p-4 rounded-[14px] bg-[#f5f5f7] flex items-center justify-between">
                  <div>
                    <div className="text-body-strong text-[#1d1d1f]">{b.surplusName}</div>
                    <div className="text-caption-apple text-[#86868b]">
                      Penerima: {b.recipientName} ({b.recipientPhone}) • Jumlah: {b.quantity} kg
                    </div>
                  </div>
                  <a href="#/penyedia/booking" className="btn-apple-primary btn-apple-sm text-xs">
                    Tinjau Pesanan
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
