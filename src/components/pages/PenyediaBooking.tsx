'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Clock, User, Phone, MapPin, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { getBookingsByProvider, updateBookingStatus, addNotification } from '@/lib/data';
import { bookingService } from '@/services/bookingService';
import { getRelativeTime, formatCountdown, formatDateTime } from '@/lib/utils';
import { BOOKING_STATUS_LABELS } from '@/types';
import type { Booking } from '@/types';

export function PenyediaBooking() {
  const { user, login } = useAuth();
  const { success, warning } = useNotification();
  const [bookings, setBookings] = useState<Booking[]>([]);

  const refresh = async () => {
    if (!user) return;
    try {
      const data = await bookingService.getByProvider(user.id);
      setBookings(data);
    } catch {
      setBookings(getBookingsByProvider(user.id));
    }
  };

  useEffect(() => {
    refresh();
  }, [user]);

  const handleConfirm = async (booking: Booking) => {
    try {
      await bookingService.updateStatus(booking.id, 'dikonfirmasi');
    } catch {
      updateBookingStatus(booking.id, 'dikonfirmasi');
    }
    addNotification({
      type: 'success',
      title: 'Booking Dikonfirmasi',
      message: `${booking.recipientName} akan mengambil ${booking.surplusName}`,
      userId: booking.recipientId,
    });
    success('Booking Dikonfirmasi ✅', `${booking.recipientName} akan segera mengambil makanan`);
    refresh();
  };

  const handleReject = async (booking: Booking) => {
    try {
      await bookingService.updateStatus(booking.id, 'dibatalkan');
    } catch {
      updateBookingStatus(booking.id, 'dibatalkan');
    }
    addNotification({
      type: 'warning',
      title: 'Booking Dibatalkan',
      message: `Booking ${booking.surplusName} telah dibatalkan`,
      userId: booking.recipientId,
    });
    warning('Booking Ditolak', 'Stok surplus telah dikembalikan ke katalog');
    refresh();
  };

  if (!user) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center bg-[#f5f5f7]">
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#1d1d1f] mb-4 border border-[rgba(0,0,0,0.08)] shadow-sm">
          <Clock size={32} />
        </div>
        <h2 className="text-display-md text-[#1d1d1f] mb-2">Daftar Pesanan & Pengambilan</h2>
        <p className="text-body-apple text-[#86868b] max-w-md mb-6">
          Silakan masuk ke akun Mitra Penyedia Anda untuk mengelola permintaan klaim makanan dari masyarakat.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => login('penyedia@aksespangan.id', 'penyedia123')}
            className="btn-apple-primary text-sm py-2.5 px-5"
          >
            ⚡ Masuk Akun Demo Penyedia (1-Klik)
          </button>
          <a href="#/login" className="btn-apple-secondary text-sm py-2.5 px-5">
            Masuk dengan Email
          </a>
        </div>
      </div>
    );
  }

  const pending = bookings.filter((b) => b.status === 'menunggu');
  const past = bookings.filter((b) => b.status !== 'menunggu');

  return (
    <div className="min-h-screen bg-[#f5f5f7] py-8 px-4 sm:px-8">
      <div className="apple-container">
        {/* Top Header */}
        <div className="mb-8">
          <a href="#/penyedia" className="link-apple text-xs mb-2 inline-flex items-center gap-1">
            <ArrowLeft size={14} /> Kembali ke Dashboard
          </a>
          <h1 className="text-display-lg text-[#1d1d1f]">Daftar Pesanan & Pengambilan</h1>
          <p className="text-body-apple text-[#86868b] m-0">
            Kelola permintaan makanan dari masyarakat dan konfirmasi serah terima.
          </p>
        </div>

        {/* Pending Requests */}
        <div className="card-apple-utility bg-white p-6 sm:p-8 mb-8">
          <h2 className="text-tagline text-[#1d1d1f] mb-4 flex items-center gap-2">
            <span>Perlu Konfirmasi Segera</span>
            <span className="badge-apple badge-apple-warning text-xs">{pending.length}</span>
          </h2>

          {pending.length === 0 ? (
            <div className="text-center py-10 text-[#86868b]">
              <div className="text-3xl mb-2">✨</div>
              <p className="text-body-apple m-0">Semua pesanan telah diproses.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pending.map((b) => (
                <div key={b.id} className="p-5 rounded-[16px] bg-[#f5f5f7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-body-strong text-[#1d1d1f] mb-1">{b.surplusName}</h3>
                    <div className="text-caption-apple text-[#86868b] space-y-0.5">
                      <div>👤 Penerima: <span className="text-[#1d1d1f] font-medium">{b.recipientName}</span> ({b.recipientPhone})</div>
                      <div>⚖️ Jumlah: {b.quantity} kg • Dipesan: {getRelativeTime(b.bookedAt)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReject(b)}
                      className="btn-apple-secondary btn-apple-sm text-xs py-2 px-3 border-[#ff3b30] text-[#ff3b30] hover:bg-[#ff3b30]/10"
                    >
                      Tolak
                    </button>
                    <button
                      onClick={() => handleConfirm(b)}
                      className="btn-apple-primary btn-apple-sm text-xs py-2 px-4"
                    >
                      Konfirmasi Pengambilan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* History / Confirmed / Completed */}
        <div className="card-apple-utility bg-white p-6 sm:p-8">
          <h2 className="text-tagline text-[#1d1d1f] mb-4">Riwayat Transaksi</h2>

          {past.length === 0 ? (
            <p className="text-caption-apple text-[#86868b] text-center py-8">Belum ada riwayat transaksi sebelumnya.</p>
          ) : (
            <div className="divide-y divide-[rgba(0,0,0,0.06)]">
              {past.map((b) => (
                <div key={b.id} className="py-4 flex items-center justify-between">
                  <div>
                    <div className="text-body-strong text-[#1d1d1f] mb-0.5">{b.surplusName}</div>
                    <div className="text-caption-apple text-[#86868b]">
                      Penerima: {b.recipientName} • {b.quantity} kg • {formatDateTime(b.bookedAt)}
                    </div>
                  </div>
                  <span className={`badge-apple ${
                    b.status === 'diambil' ? 'badge-apple-success' : b.status === 'dikonfirmasi' ? 'badge-apple-info' : 'badge-apple-neutral'
                  }`}>
                    {BOOKING_STATUS_LABELS[b.status] || b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
