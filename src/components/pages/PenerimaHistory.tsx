'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, PackageCheck, Leaf, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getBookingsByRecipient } from '@/lib/data';
import { formatDateTime } from '@/lib/utils';
import { BOOKING_STATUS_LABELS } from '@/types';
import type { Booking, BookingStatus } from '@/types';

export function PenerimaHistory() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (user) {
      setBookings(
        getBookingsByRecipient(user.id)
          .filter((b) => ['diambil', 'dibatalkan', 'kedaluwarsa'].includes(b.status))
          .sort((a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime())
      );
    }
  }, [user]);

  if (!user) return null;

  const statusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'diambil':
        return <span className="badge-apple badge-apple-success">Diambil Selesai</span>;
      case 'dibatalkan':
        return <span className="badge-apple badge-apple-error">Dibatalkan</span>;
      case 'kedaluwarsa':
        return <span className="badge-apple badge-apple-warning">Kedaluwarsa</span>;
      default:
        return <span className="badge-apple badge-apple-neutral">{BOOKING_STATUS_LABELS[status] || status}</span>;
    }
  };

  const totalSaved = bookings.filter((b) => b.status === 'diambil').reduce((sum, b) => sum + b.quantity, 0);
  const co2Saved = (totalSaved * 2.5).toFixed(1);

  return (
    <div className="min-h-screen bg-[#f5f5f7] py-8 px-4 sm:px-8">
      <div className="apple-container">
        {/* Header */}
        <div className="mb-8">
          <a href="#/penerima" className="link-apple text-xs mb-2 inline-flex items-center gap-1">
            <ArrowLeft size={14} /> Kembali ke Beranda Penerima
          </a>
          <h1 className="text-display-lg text-[#1d1d1f]">Riwayat Booking</h1>
          <p className="text-body-apple text-[#86868b] m-0">
            Catatan komprehensif surplus makanan yang telah Anda klaim dan selamatkan.
          </p>
        </div>

        {/* Environmental Impact Highlight */}
        {totalSaved > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1d1d1f] text-white p-6 sm:p-8 rounded-[18px] mb-8 relative overflow-hidden"
          >
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[#a1a1a6] font-semibold mb-1 flex items-center gap-1.5">
                  <Leaf size={14} className="text-[#30d158]" /> Total Kontribusi Lingkungan
                </p>
                <div className="text-[44px] font-bold tracking-tight text-white leading-none mb-2">
                  {totalSaved} <span className="text-xl font-medium text-[#a1a1a6]">kg pangan diselamatkan</span>
                </div>
                <p className="text-body-apple text-[#a1a1a6] m-0 max-w-xl">
                  Setara dengan pemangkasan <span className="text-white font-medium">{co2Saved} kg CO₂e</span> emisi gas rumah kaca dari pembusukan pangan di tempat pembuangan akhir.
                </p>
              </div>
              <div className="flex items-center gap-3 self-start md:self-auto bg-[rgba(255,255,255,0.08)] px-5 py-3 rounded-full border border-[rgba(255,255,255,0.12)]">
                <PackageCheck size={20} className="text-[#30d158]" />
                <span className="text-sm font-semibold text-white">
                  {bookings.filter((b) => b.status === 'diambil').length} Transaksi Selesai
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* History List */}
        <div className="card-apple-utility bg-white p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-tagline text-[#1d1d1f]">Daftar Transaksi</h2>
            <span className="text-caption-apple text-[#86868b]">{bookings.length} catatan</span>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-12 text-[#86868b]">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-body-strong text-[#1d1d1f] mb-1">Belum ada riwayat booking</p>
              <p className="text-caption-apple text-[#86868b] max-w-xs mx-auto mb-4">
                Saat Anda menyelesaikan atau membatalkan pesanan, riwayatnya akan tersimpan di sini.
              </p>
              <a href="#/penerima" className="btn-apple-primary btn-apple-sm inline-flex">
                Jelajahi Surplus Makanan
              </a>
            </div>
          ) : (
            <div className="divide-y divide-[rgba(0,0,0,0.06)]">
              {bookings.map((b, i) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-body-strong text-[#1d1d1f]">{b.surplusName}</h3>
                      {statusBadge(b.status)}
                    </div>
                    <p className="text-caption-apple text-[#86868b] mb-1">
                      Mitra Penyedia: <span className="text-[#1d1d1f] font-medium">{b.providerBusinessName}</span>
                    </p>
                    <div className="flex items-center gap-4 text-xs text-[#86868b]">
                      <span className="font-semibold text-[#1d1d1f]">⚖️ {b.quantity} kg</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {formatDateTime(b.bookedAt)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right sm:self-center">
                    <span className="text-xs text-[#86868b] font-mono">ID: {b.id.slice(0, 8)}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
