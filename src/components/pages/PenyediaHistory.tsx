'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, XCircle, Calendar, User, Package } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getBookingsByProvider } from '@/lib/data';
import { formatDateTime } from '@/lib/utils';
import { BOOKING_STATUS_LABELS } from '@/types';
import type { Booking, BookingStatus } from '@/types';

export function PenyediaHistory() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (user) {
      setBookings(
        getBookingsByProvider(user.id)
          .filter((b) => ['diambil', 'dibatalkan', 'kedaluwarsa'].includes(b.status))
          .sort((a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime())
      );
    }
  }, [user]);

  if (!user) return null;

  const statusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'diambil':
        return <span className="badge-apple badge-apple-success">Tersalurkan Selesai</span>;
      case 'dibatalkan':
        return <span className="badge-apple badge-apple-error">Dibatalkan</span>;
      case 'kedaluwarsa':
        return <span className="badge-apple badge-apple-warning">Kedaluwarsa</span>;
      default:
        return <span className="badge-apple badge-apple-neutral">{BOOKING_STATUS_LABELS[status] || status}</span>;
    }
  };

  const totalDistributed = bookings.filter((b) => b.status === 'diambil').reduce((sum, b) => sum + b.quantity, 0);

  return (
    <div className="min-h-screen bg-[#f5f5f7] py-8 px-4 sm:px-8">
      <div className="apple-container">
        {/* Header */}
        <div className="mb-8">
          <a href="#/penyedia" className="link-apple text-xs mb-2 inline-flex items-center gap-1">
            <ArrowLeft size={14} /> Kembali ke Dashboard Mitra Penyedia
          </a>
          <h1 className="text-display-lg text-[#1d1d1f]">Riwayat Penyaluran</h1>
          <p className="text-body-apple text-[#86868b] m-0">
            Arsip lengkap stok surplus yang berhasil diselamatkan dan diambil oleh penerima manfaat.
          </p>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="card-apple-utility bg-white p-6">
            <div className="text-[11px] uppercase font-semibold text-[#86868b] tracking-wider mb-1">
              Total Makanan Tersalurkan
            </div>
            <div className="text-display-md text-[#1d1d1f] font-bold">
              {totalDistributed} <span className="text-sm font-normal text-[#86868b]">kg</span>
            </div>
            <div className="text-caption-apple text-[#30d158] mt-1 flex items-center gap-1 font-medium">
              <CheckCircle2 size={13} /> Berhasil diselamatkan
            </div>
          </div>

          <div className="card-apple-utility bg-white p-6">
            <div className="text-[11px] uppercase font-semibold text-[#86868b] tracking-wider mb-1">
              Estimasi Emisi Dicegah
            </div>
            <div className="text-display-md text-[#1d1d1f] font-bold">
              {(totalDistributed * 2.5).toFixed(1)} <span className="text-sm font-normal text-[#86868b]">kg CO₂e</span>
            </div>
            <div className="text-caption-apple text-[#86868b] mt-1">
              Faktor emisi 2.5x bobot
            </div>
          </div>

          <div className="card-apple-utility bg-white p-6">
            <div className="text-[11px] uppercase font-semibold text-[#86868b] tracking-wider mb-1">
              Total Pesanan Selesai
            </div>
            <div className="text-display-md text-[#0066cc] font-bold">
              {bookings.filter((b) => b.status === 'diambil').length} <span className="text-sm font-normal text-[#86868b]">transaksi</span>
            </div>
            <div className="text-caption-apple text-[#86868b] mt-1">
              Dari {bookings.length} total klaim
            </div>
          </div>
        </div>

        {/* History Records List */}
        <div className="card-apple-utility bg-white p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-tagline text-[#1d1d1f]">Daftar Penyaluran Selesai</h2>
            <span className="text-caption-apple text-[#86868b]">{bookings.length} rekaman</span>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-12 text-[#86868b]">
              <div className="text-4xl mb-3">📦</div>
              <p className="text-body-strong text-[#1d1d1f] mb-1">Belum ada riwayat penyaluran</p>
              <p className="text-caption-apple text-[#86868b] max-w-xs mx-auto mb-4">
                Surplus yang telah diambil atau diselesaikan akan muncul dalam arsip ini.
              </p>
              <a href="#/penyedia/surplus" className="btn-apple-primary btn-apple-sm inline-flex">
                Kelola Stok Surplus
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
                    <p className="text-caption-apple text-[#86868b] mb-1 flex items-center gap-1">
                      <User size={13} /> Penerima: <span className="text-[#1d1d1f] font-medium">{b.recipientName}</span>
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
                    <span className="text-xs text-[#86868b] font-mono">Klaim #{b.id.slice(0, 8)}</span>
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
