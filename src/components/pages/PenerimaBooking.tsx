'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Phone,
  ArrowLeft,
  Navigation,
  QrCode,
  ShoppingBag,
  ChevronRight,
  ShieldCheck,
  PackageCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { getBookingsByRecipient, updateBookingStatus } from '@/lib/data';
import { bookingService } from '@/services/bookingService';
import { formatCountdown, getRelativeTime, formatDateTime } from '@/lib/utils';
import { BOOKING_STATUS_LABELS } from '@/types';
import type { Booking, BookingStatus } from '@/types';

type OrderFilter = 'semua' | 'menunggu' | 'siap' | 'selesai' | 'dibatalkan';

export function PenerimaBooking() {
  const { user, login } = useAuth();
  const { success, warning } = useNotification();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeFilter, setActiveFilter] = useState<OrderFilter>('semua');
  const [selectedTicket, setSelectedTicket] = useState<Booking | null>(null);

  const refresh = async () => {
    if (!user) return;
    try {
      const data = await bookingService.getByRecipient(user.id);
      setBookings(data.sort((a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime()));
    } catch {
      setBookings(getBookingsByRecipient(user.id).sort((a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime()));
    }
  };

  useEffect(() => {
    refresh();
  }, [user]);

  const handleConfirmPickup = async (booking: Booking) => {
    try {
      await bookingService.updateStatus(booking.id, 'diambil');
    } catch {
      updateBookingStatus(booking.id, 'diambil');
    }
    success('Pengambilan Selesai! 🎉', `Terima kasih telah menyelamatkan ${booking.quantity} kg makanan.`);
    if (selectedTicket?.id === booking.id) setSelectedTicket(null);
    refresh();
  };

  const handleCancel = async (booking: Booking) => {
    try {
      await bookingService.updateStatus(booking.id, 'dibatalkan');
    } catch {
      updateBookingStatus(booking.id, 'dibatalkan');
    }
    warning('Pesanan Dibatalkan', `Pesanan ${booking.surplusName} telah dibatalkan.`);
    if (selectedTicket?.id === booking.id) setSelectedTicket(null);
    refresh();
  };

  if (!user) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center bg-[#f5f5f7]">
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#1d1d1f] mb-4 border border-[rgba(0,0,0,0.08)] shadow-sm">
          <Clock size={32} />
        </div>
        <h2 className="text-display-md text-[#1d1d1f] mb-2">Pesanan & Status Penyelamatan Saya</h2>
        <p className="text-body-apple text-[#86868b] max-w-md mb-6">
          Silakan masuk ke akun Anda untuk melihat status pesanan aktif dan tiket penjemputan makanan.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => login('penerima@aksespangan.id', 'penerima123')}
            className="btn-apple-primary text-sm py-2.5 px-5"
          >
            ⚡ Masuk Akun Demo Penerima (1-Klik)
          </button>
          <a href="#/login" className="btn-apple-secondary text-sm py-2.5 px-5">
            Masuk dengan Email
          </a>
        </div>
      </div>
    );
  }

  // Filter bookings based on active filter tab
  const filteredBookings = bookings.filter((b) => {
    if (activeFilter === 'semua') return true;
    if (activeFilter === 'menunggu') return b.status === 'menunggu';
    if (activeFilter === 'siap') return b.status === 'dikonfirmasi';
    if (activeFilter === 'selesai') return b.status === 'diambil';
    if (activeFilter === 'dibatalkan') return ['dibatalkan', 'kedaluwarsa'].includes(b.status);
    return true;
  });

  const activeCount = bookings.filter((b) => ['menunggu', 'dikonfirmasi'].includes(b.status)).length;
  const completedCount = bookings.filter((b) => b.status === 'diambil').length;

  const renderStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'menunggu':
        return <span className="badge-apple badge-apple-warning">⌛ Menunggu Konfirmasi</span>;
      case 'dikonfirmasi':
        return <span className="badge-apple badge-apple-info">🛵 Siap / Sedang Diambil</span>;
      case 'diambil':
        return <span className="badge-apple badge-apple-success">🎉 Selesai Diambil</span>;
      case 'dibatalkan':
        return <span className="badge-apple badge-apple-neutral text-[#ff3b30]">Dibatalkan</span>;
      case 'kedaluwarsa':
        return <span className="badge-apple badge-apple-neutral">Kedaluwarsa</span>;
      default:
        return <span className="badge-apple badge-apple-neutral">{BOOKING_STATUS_LABELS[status] || status}</span>;
    }
  };

  const getStepProgress = (status: BookingStatus) => {
    if (status === 'menunggu') return 1;
    if (status === 'dikonfirmasi') return 2;
    if (status === 'diambil') return 3;
    return 0; // cancelled or expired
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] py-8 px-4 sm:px-8">
      <div className="apple-container">
        {/* Top Navigation & Title Bar */}
        <div className="mb-6">
          <a href="#/penerima" className="link-apple text-xs mb-2 inline-flex items-center gap-1">
            <ArrowLeft size={14} /> Kembali ke Katalog Makanan
          </a>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-display-lg text-[#1d1d1f] mb-1">
                Pesanan & Status Penyelamatan Saya
              </h1>
              <p className="text-body-apple text-[#86868b] m-0">
                Pantau proses verifikasi mitra, estimasi penjemputan, dan tiket QR serah terima.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto bg-white px-4 py-2 rounded-full border border-[rgba(0,0,0,0.08)] shadow-sm">
              <ShoppingBag size={16} className="text-[#1d1d1f]" />
              <span className="text-xs font-semibold text-[#1d1d1f]">
                {activeCount} Pesanan Aktif
              </span>
            </div>
          </div>
        </div>

        {/* Shopee-Style Category Filter Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-[rgba(0,0,0,0.08)]">
          <button
            onClick={() => setActiveFilter('semua')}
            className={`apple-chip text-xs py-2 px-4 ${
              activeFilter === 'semua' ? 'apple-chip-active' : ''
            }`}
          >
            Semua Pesanan ({bookings.length})
          </button>
          <button
            onClick={() => setActiveFilter('menunggu')}
            className={`apple-chip text-xs py-2 px-4 ${
              activeFilter === 'menunggu' ? 'apple-chip-active' : ''
            }`}
          >
            Menunggu Konfirmasi ({bookings.filter((b) => b.status === 'menunggu').length})
          </button>
          <button
            onClick={() => setActiveFilter('siap')}
            className={`apple-chip text-xs py-2 px-4 ${
              activeFilter === 'siap' ? 'apple-chip-active' : ''
            }`}
          >
            🛵 Siap / Sedang Diambil ({bookings.filter((b) => b.status === 'dikonfirmasi').length})
          </button>
          <button
            onClick={() => setActiveFilter('selesai')}
            className={`apple-chip text-xs py-2 px-4 ${
              activeFilter === 'selesai' ? 'apple-chip-active' : ''
            }`}
          >
            🎉 Selesai ({completedCount})
          </button>
          <button
            onClick={() => setActiveFilter('dibatalkan')}
            className={`apple-chip text-xs py-2 px-4 ${
              activeFilter === 'dibatalkan' ? 'apple-chip-active' : ''
            }`}
          >
            Dibatalkan ({bookings.filter((b) => ['dibatalkan', 'kedaluwarsa'].includes(b.status)).length})
          </button>
        </div>

        {/* Orders List / Empty State */}
        {filteredBookings.length === 0 ? (
          <div className="card-apple-utility bg-white p-12 text-center max-w-md mx-auto">
            <div className="text-4xl mb-3">🛍️</div>
            <h3 className="text-body-strong text-[#1d1d1f] mb-1">
              Tidak Ada Pesanan {activeFilter !== 'semua' ? `Status "${activeFilter.toUpperCase()}"` : ''}
            </h3>
            <p className="text-caption-apple text-[#86868b] mb-6">
              Jelajahi restoran dan toko di katalog untuk menyelamatkan makanan berlebih hari ini.
            </p>
            <a href="#/penerima" className="btn-apple-primary text-xs py-2.5 px-5">
              Cari Makanan di Katalog
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((b) => {
              const currentStep = getStepProgress(b.status);

              return (
                <motion.div
                  key={b.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="card-apple-utility bg-white p-6 sm:p-8 space-y-5"
                >
                  {/* Top Order Meta Info (Store Name & Status) */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[rgba(0,0,0,0.06)]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[12px] bg-[#f5f5f7] flex items-center justify-center text-lg font-bold text-[#1d1d1f]">
                        🏬
                      </div>
                      <div>
                        <div className="text-body-strong text-[#1d1d1f] flex items-center gap-2">
                          <span>{b.providerBusinessName}</span>
                          <span className="text-fine-print text-[#86868b] font-mono">
                            ID: #{b.id.slice(0, 8)}
                          </span>
                        </div>
                        <div className="text-fine-print text-[#86868b]">
                          Dipesan pada: {formatDateTime(b.bookedAt)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      {renderStatusBadge(b.status)}
                    </div>
                  </div>

                  {/* E-Commerce Status Tracking Progress Bar (Shopee Stepper) */}
                  {['menunggu', 'dikonfirmasi', 'diambil'].includes(b.status) && (
                    <div className="p-5 sm:p-6 rounded-[20px] bg-[#f8f8fa] border border-[rgba(0,0,0,0.06)] shadow-xs">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#1d1d1f] mb-6">
                        <span className="flex items-center gap-2 text-sm font-bold">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#34c759] animate-pulse" />
                          Status Penyelamatan Makanan
                        </span>
                        {b.status === 'dikonfirmasi' && (
                          <span className="text-[#ff9500] font-bold flex items-center gap-1.5 bg-white py-1.5 px-3.5 rounded-full border border-[rgba(0,0,0,0.08)] shadow-xs text-xs">
                            <Clock size={14} /> Sisa Waktu Ambil: {formatCountdown(b.pickupDeadline)}
                          </span>
                        )}
                        {b.status === 'menunggu' && (
                          <span className="text-[#ff9500] font-medium text-xs bg-[#ff9500]/10 px-3 py-1 rounded-full">
                            ⏳ Menunggu konfirmasi toko
                          </span>
                        )}
                        {b.status === 'diambil' && (
                          <span className="text-[#34c759] font-medium text-xs bg-[#34c759]/10 px-3 py-1 rounded-full">
                            🎉 Selesai Diselamatkan
                          </span>
                        )}
                      </div>

                      {/* Flex Stepper with Connected Lines Between Nodes */}
                      <div className="flex items-start justify-between w-full relative px-2 sm:px-4">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center z-10 min-w-[70px]">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                              currentStep >= 1
                                ? 'bg-[#1d1d1f] text-white ring-4 ring-[#1d1d1f]/10'
                                : 'bg-white text-[#86868b] border border-[rgba(0,0,0,0.15)]'
                            }`}
                          >
                            {currentStep > 1 ? <CheckCircle2 size={16} /> : '1'}
                          </div>
                          <span className="text-[12px] font-semibold text-[#1d1d1f] mt-2.5 text-center">
                            Dipesan
                          </span>
                          <span className="text-[10px] text-[#86868b] mt-0.5">
                            {formatDateTime(b.bookedAt).split(',')[1] || ''}
                          </span>
                        </div>

                        {/* Connector Line 1 -> 2 */}
                        <div className="flex-1 h-[3px] mx-2 mt-4 bg-[#e5e5ea] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#1d1d1f] transition-all duration-500 rounded-full"
                            style={{ width: currentStep >= 2 ? '100%' : '0%' }}
                          />
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center z-10 min-w-[90px]">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                              currentStep >= 2
                                ? 'bg-[#1d1d1f] text-white ring-4 ring-[#1d1d1f]/10'
                                : 'bg-white text-[#86868b] border border-[rgba(0,0,0,0.15)]'
                            }`}
                          >
                            {currentStep > 2 ? <CheckCircle2 size={16} /> : '2'}
                          </div>
                          <span className="text-[12px] font-semibold text-[#1d1d1f] mt-2.5 text-center">
                            Konfirmasi Mitra
                          </span>
                          <span className="text-[10px] text-[#86868b] mt-0.5">
                            {currentStep >= 2 ? 'Disetujui' : 'Menunggu'}
                          </span>
                        </div>

                        {/* Connector Line 2 -> 3 */}
                        <div className="flex-1 h-[3px] mx-2 mt-4 bg-[#e5e5ea] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#34c759] transition-all duration-500 rounded-full"
                            style={{ width: currentStep >= 3 ? '100%' : '0%' }}
                          />
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center z-10 min-w-[70px]">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                              currentStep >= 3
                                ? 'bg-[#34c759] text-white ring-4 ring-[#34c759]/20'
                                : 'bg-white text-[#86868b] border border-[rgba(0,0,0,0.15)]'
                            }`}
                          >
                            {currentStep === 3 ? <CheckCircle2 size={16} /> : '3'}
                          </div>
                          <span className="text-[12px] font-semibold text-[#1d1d1f] mt-2.5 text-center">
                            Sudah Diambil
                          </span>
                          <span className="text-[10px] text-[#86868b] mt-0.5">
                            {currentStep === 3 ? 'Selesai' : 'Siap Diambil'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Food Item Details Row */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-[12px] bg-[#f5f5f7] flex items-center justify-center text-2xl flex-shrink-0">
                        🍽️
                      </div>
                      <div>
                        <h4 className="text-body-strong text-[#1d1d1f] mb-0.5">
                          {b.surplusName}
                        </h4>
                        <div className="text-caption-apple text-[#86868b] space-y-0.5">
                          <div className="flex items-center gap-1 text-[#1d1d1f]">
                            <MapPin size={13} className="text-[#1d1d1f]" />
                            <span>{b.pickupAddress}</span>
                          </div>
                          <div>
                            Jumlah: <span className="font-semibold text-[#1d1d1f]">{b.quantity} kg</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* QR Code Ticket Button & Actions */}
                    <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[rgba(0,0,0,0.06)] justify-end">
                      {['menunggu', 'dikonfirmasi'].includes(b.status) && (
                        <button
                          onClick={() => setSelectedTicket(b)}
                          className="btn-apple-secondary btn-apple-sm text-xs py-2 px-3.5 flex items-center gap-1.5"
                        >
                          <QrCode size={14} /> Tiket Ambil QR
                        </button>
                      )}

                      {b.status === 'menunggu' && (
                        <button
                          onClick={() => handleCancel(b)}
                          className="btn-apple-secondary btn-apple-sm text-xs py-2 px-3.5 text-[#ff3b30] border-[#ff3b30] hover:bg-[#ff3b30]/10"
                        >
                          Batalkan
                        </button>
                      )}

                      {b.status === 'dikonfirmasi' && (
                        <button
                          onClick={() => handleConfirmPickup(b)}
                          className="btn-apple-primary btn-apple-sm text-xs py-2 px-4 flex items-center gap-1.5"
                        >
                          <PackageCheck size={15} /> Konfirmasi Makanan Diterima
                        </button>
                      )}

                      {b.status === 'diambil' && (
                        <div className="text-xs text-[#34c759] font-semibold flex items-center gap-1">
                          <CheckCircle2 size={16} /> Diselamatkan Selesai
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Digital Pickup Ticket & QR Code Simulator Modal */}
        <AnimatePresence>
          {selectedTicket && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-[24px] max-w-md w-full p-6 sm:p-8 border border-[rgba(0,0,0,0.08)] shadow-2xl relative text-center"
              >
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#86868b] hover:text-[#1d1d1f]"
                >
                  <X size={16} />
                </button>

                <div className="w-12 h-12 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
                  <QrCode size={24} />
                </div>

                <h3 className="text-tagline font-bold text-[#1d1d1f] mb-1">
                  Tiket Digital Penjemputan
                </h3>
                <p className="text-fine-print text-[#86868b] mb-4">
                  Tunjukkan kode QR / ID tiket ini kepada staf restoran saat serah terima.
                </p>

                {/* Simulated High-Res QR Code Card */}
                <div className="p-6 bg-[#f5f5f7] rounded-[20px] border border-[rgba(0,0,0,0.08)] mb-5 inline-block w-full">
                  <div className="w-44 h-44 bg-white p-3 rounded-[16px] mx-auto mb-3 border border-[rgba(0,0,0,0.06)] shadow-inner flex flex-col items-center justify-center relative overflow-hidden">
                    {/* Simulated Barcode / Matrix Pattern */}
                    <div className="grid grid-cols-6 gap-1 w-full h-full opacity-90">
                      {Array.from({ length: 36 }).map((_, i) => (
                        <div
                          key={i}
                          className={`rounded-[2px] ${
                            (i * 7) % 3 === 0 ? 'bg-[#1d1d1f]' : 'bg-[#e5e5ea]'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="text-xs font-mono font-bold text-[#1d1d1f] uppercase tracking-widest bg-white py-1.5 px-3 rounded-full border border-[rgba(0,0,0,0.08)] inline-block">
                    KODE: #{selectedTicket.id.slice(0, 8)}
                  </div>
                </div>

                {/* Ticket Details */}
                <div className="text-left bg-[#f5f5f7] p-4 rounded-[14px] space-y-2 text-xs mb-6">
                  <div className="flex justify-between">
                    <span className="text-[#86868b]">Makanan:</span>
                    <span className="font-semibold text-[#1d1d1f] truncate max-w-[200px]">
                      {selectedTicket.surplusName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#86868b]">Penyedia:</span>
                    <span className="font-semibold text-[#1d1d1f]">
                      {selectedTicket.providerBusinessName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#86868b]">Alamat Ambil:</span>
                    <span className="font-semibold text-[#1d1d1f] truncate max-w-[200px]">
                      {selectedTicket.pickupAddress}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#86868b]">Sisa Batas Waktu:</span>
                    <span className="font-bold text-[#ff9500]">
                      {formatCountdown(selectedTicket.pickupDeadline)} lagi
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="btn-apple-secondary flex-1 text-xs py-2.5"
                  >
                    Tutup
                  </button>
                  {selectedTicket.status === 'dikonfirmasi' && (
                    <button
                      onClick={() => handleConfirmPickup(selectedTicket)}
                      className="btn-apple-primary flex-1 text-xs py-2.5"
                    >
                      Konfirmasi Selesai
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
