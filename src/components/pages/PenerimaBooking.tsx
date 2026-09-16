'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, MapPin, Phone, ArrowLeft, Navigation } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { getBookingsByRecipient, updateBookingStatus } from '@/lib/data';
import { bookingService } from '@/services/bookingService';
import { formatCountdown, getRelativeTime, formatDateTime } from '@/lib/utils';
import { BOOKING_STATUS_LABELS } from '@/types';
import type { Booking } from '@/types';

export function PenerimaBooking() {
  const { user } = useAuth();
  const { success } = useNotification();
  const [bookings, setBookings] = useState<Booking[]>([]);

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
    refresh();
  };

  const handleCancel = async (booking: Booking) => {
    try {
      await bookingService.updateStatus(booking.id, 'dibatalkan');
    } catch {
      updateBookingStatus(booking.id, 'dibatalkan');
    }
    refresh();
  };

  if (!user) return null;

  const active = bookings.filter((b) => ['menunggu', 'dikonfirmasi'].includes(b.status));
  const past = bookings.filter((b) => ['diambil', 'dibatalkan', 'kedaluwarsa'].includes(b.status));

  return (
    <div className="min-h-screen bg-[#f5f5f7] py-8 px-4 sm:px-8">
      <div className="apple-container">
        {/* Top Header */}
        <div className="mb-8">
          <a href="#/penerima" className="link-apple text-xs mb-2 inline-flex items-center gap-1">
            <ArrowLeft size={14} /> Kembali ke Katalog Makanan
          </a>
          <h1 className="text-display-lg text-[#1d1d1f]">Pesanan & Pengambilan Saya</h1>
          <p className="text-body-apple text-[#86868b] m-0">
            Pantau status verifikasi dan jadwal penjemputan makanan surplus Anda.
          </p>
        </div>

        {/* Active Bookings Section */}
        <div className="card-apple-utility bg-white p-6 sm:p-8 mb-8">
          <h2 className="text-tagline text-[#1d1d1f] mb-4 flex items-center gap-2">
            <span>Pesanan Aktif Menunggu</span>
            <span className="badge-apple badge-apple-info text-xs">{active.length}</span>
          </h2>

          {active.length === 0 ? (
            <div className="text-center py-10 text-[#86868b]">
              <div className="text-3xl mb-2">🍽️</div>
              <p className="text-body-apple m-0">Tidak ada pesanan aktif saat ini.</p>
              <a href="#/penerima" className="btn-apple-primary btn-apple-sm mt-4 inline-flex">
                Cari Makanan di Peta
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {active.map((b) => (
                <div key={b.id} className="p-6 rounded-[18px] bg-[#f5f5f7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="text-tagline text-[#1d1d1f]">{b.surplusName}</h3>
                      <span className={`badge-apple ${
                        b.status === 'dikonfirmasi' ? 'badge-apple-success' : 'badge-apple-warning'
                      }`}>
                        {BOOKING_STATUS_LABELS[b.status] || b.status}
                      </span>
                    </div>

                    <div className="text-caption-apple text-[#86868b] space-y-1">
                      <div className="flex items-center gap-1 text-[#1d1d1f]">
                        <MapPin size={14} className="text-[#0066cc]" />
                        <span>{b.providerBusinessName} • {b.pickupAddress}</span>
                      </div>
                      <div>Jumlah: <span className="font-semibold text-[#1d1d1f]">{b.quantity} kg</span></div>
                      <div className="text-[#ff9500] font-medium flex items-center gap-1">
                        <Clock size={13} /> Sisa batas waktu ambil: {formatCountdown(b.pickupDeadline)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      onClick={() => handleCancel(b)}
                      className="btn-apple-secondary btn-apple-sm text-xs py-2 px-3 border-[#ff3b30] text-[#ff3b30] hover:bg-[#ff3b30]/10"
                    >
                      Batalkan
                    </button>
                    {b.status === 'dikonfirmasi' && (
                      <button
                        onClick={() => handleConfirmPickup(b)}
                        className="btn-apple-primary btn-apple-sm text-xs py-2 px-4"
                      >
                        Konfirmasi Telah Diambil
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past History */}
        <div className="card-apple-utility bg-white p-6 sm:p-8">
          <h2 className="text-tagline text-[#1d1d1f] mb-4">Riwayat Penyelamatan Pangan</h2>

          {past.length === 0 ? (
            <p className="text-caption-apple text-[#86868b] text-center py-8">Belum ada riwayat transaksi selesai.</p>
          ) : (
            <div className="divide-y divide-[rgba(0,0,0,0.06)]">
              {past.map((b) => (
                <div key={b.id} className="py-4 flex items-center justify-between">
                  <div>
                    <div className="text-body-strong text-[#1d1d1f] mb-0.5">{b.surplusName}</div>
                    <div className="text-caption-apple text-[#86868b]">
                      Mitra: {b.providerBusinessName} • Jumlah: {b.quantity} kg • {formatDateTime(b.bookedAt)}
                    </div>
                  </div>
                  <span className={`badge-apple ${
                    b.status === 'diambil' ? 'badge-apple-success' : 'badge-apple-neutral'
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
