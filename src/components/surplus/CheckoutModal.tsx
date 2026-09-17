'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Clock,
  ThermometerSun,
  Flame,
  ShieldCheck,
  ShoppingBag,
  Store,
  ChevronRight,
  Info,
} from 'lucide-react';
import { formatPrice, formatCountdown } from '@/lib/utils';
import { getSafetyGuideline } from '@/lib/safetyGuidelines';
import { FOOD_CATEGORY_EMOJI, FOOD_CATEGORY_LABELS } from '@/types';
import type { SurplusItem } from '@/types';

interface CheckoutModalProps {
  item: SurplusItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmCheckout: (item: SurplusItem) => Promise<void>;
  isLoading?: boolean;
}

export function CheckoutModal({
  item,
  isOpen,
  onClose,
  onConfirmCheckout,
  isLoading = false,
}: CheckoutModalProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [activeTab, setActiveTab] = useState<'rincian' | 'keamanan'>('rincian');

  if (!isOpen || !item) return null;

  const guideline = getSafetyGuideline(item.foodCategory);
  const emoji = FOOD_CATEGORY_EMOJI[item.foodCategory] || '🍽️';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms || isLoading) return;
    await onConfirmCheckout(item);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="bg-white rounded-[24px] max-w-2xl w-full p-6 sm:p-8 border border-[rgba(0,0,0,0.08)] shadow-2xl relative my-auto max-h-[92vh] flex flex-col justify-between overflow-hidden"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-[rgba(0,0,0,0.08)]">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center text-lg shadow-sm">
                <ShoppingBag size={20} />
              </div>
              <div>
                <h2 className="text-tagline font-bold text-[#1d1d1f] tracking-tight leading-none mb-1">
                  Checkout & Konfirmasi Pesanan
                </h2>
                <p className="text-fine-print text-[#86868b] m-0">
                  Langkah 2 dari 2: Tinjau rincian biaya & panduan mutu makanan
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#86868b] hover:text-[#1d1d1f] transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Tab Switcher for Quick Navigation */}
          <div className="flex items-center bg-[#f5f5f7] p-1 rounded-full my-4 self-center sm:self-start text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('rincian')}
              className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'rincian'
                  ? 'bg-white text-[#1d1d1f] shadow-sm'
                  : 'text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              <ShoppingBag size={14} /> Ringkasan Pesanan & Biaya
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('keamanan')}
              className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'keamanan'
                  ? 'bg-white text-[#1d1d1f] shadow-sm'
                  : 'text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              <ShieldCheck size={14} className="text-[#34c759]" /> Panduan Mutu ({guideline.categoryName})
            </button>
          </div>

          {/* Scrollable Content Container */}
          <div className="overflow-y-auto pr-1 space-y-5 my-2 max-h-[52vh]">
            {/* 1. Item Header Card */}
            <div className="p-4 sm:p-5 rounded-[18px] bg-[#f5f5f7] border border-[rgba(0,0,0,0.06)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-14 h-14 rounded-[14px] bg-white flex items-center justify-center text-3xl shadow-sm border border-[rgba(0,0,0,0.06)] flex-shrink-0">
                  {emoji}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#1d1d1f] text-white">
                      {FOOD_CATEGORY_LABELS[item.foodCategory] || item.foodCategory}
                    </span>
                    {item.isFree && (
                      <span className="text-[11px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#34c759]/15 text-[#1b8a36]">
                        Gratis
                      </span>
                    )}
                  </div>
                  <h3 className="text-body-strong text-[#1d1d1f] line-clamp-1 mb-0.5">
                    {item.name}
                  </h3>
                  <p className="text-caption-apple text-[#86868b] m-0 flex items-center gap-1">
                    <Store size={13} className="text-[#1d1d1f]" />
                    <span>{item.providerBusinessName}</span>
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right self-stretch sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[rgba(0,0,0,0.08)] flex sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                <span className="text-fine-print text-[#86868b]">Jumlah Porsi</span>
                <span className="text-body-strong text-[#1d1d1f]">
                  {item.quantity} kg ({item.portionCount} porsi)
                </span>
              </div>
            </div>

            {activeTab === 'rincian' ? (
              <>
                {/* 2. Pickup Location & Deadline Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-[16px] bg-white border border-[rgba(0,0,0,0.08)]">
                    <div className="text-fine-print uppercase font-semibold text-[#86868b] tracking-wider mb-1 flex items-center gap-1">
                      <MapPin size={13} className="text-[#1d1d1f]" /> Lokasi Penjemputan
                    </div>
                    <div className="text-caption-strong text-[#1d1d1f] line-clamp-1">
                      {item.address}
                    </div>
                    <div className="text-fine-print text-[#86868b] mt-0.5">
                      Mitra: {item.providerBusinessName}
                    </div>
                  </div>

                  <div className="p-4 rounded-[16px] bg-white border border-[rgba(0,0,0,0.08)]">
                    <div className="text-fine-print uppercase font-semibold text-[#86868b] tracking-wider mb-1 flex items-center gap-1">
                      <Clock size={13} className="text-[#ff9500]" /> Batas Waktu Ambil
                    </div>
                    <div className="text-caption-strong text-[#ff9500] font-bold">
                      {formatCountdown(item.expiryTime)} lagi
                    </div>
                    <div className="text-fine-print text-[#86868b] mt-0.5">
                      Segera ambil sebelum stok kedaluwarsa
                    </div>
                  </div>
                </div>

                {/* 3. Pricing Breakdown (Shopee E-Commerce Style) */}
                <div className="p-5 rounded-[18px] bg-white border border-[rgba(0,0,0,0.08)] space-y-3">
                  <h4 className="text-caption-strong text-[#1d1d1f] border-b border-[rgba(0,0,0,0.06)] pb-2 flex items-center justify-between">
                    <span>Rincian Pembayaran</span>
                    <span className="text-fine-print font-normal text-[#86868b]">Bebas Biaya Admin</span>
                  </h4>

                  <div className="flex justify-between text-caption-apple text-[#86868b]">
                    <span>Harga Makanan ({item.portionCount} porsi)</span>
                    <span className="text-[#1d1d1f] font-medium">
                      {item.isFree ? 'Rp 0 (Gratis)' : formatPrice(item.price)}
                    </span>
                  </div>

                  <div className="flex justify-between text-caption-apple text-[#86868b]">
                    <span>Biaya Penyelamatkan Pangan (ESG)</span>
                    <span className="text-[#34c759] font-medium">Rp 0 (Subsidi AksesPangan)</span>
                  </div>

                  <div className="pt-2 border-t border-[rgba(0,0,0,0.08)] flex justify-between items-center">
                    <div>
                      <span className="text-body-strong text-[#1d1d1f]">Total Bayar</span>
                      <p className="text-fine-print text-[#86868b] m-0">Bayar langsung di tempat jika berbayar</p>
                    </div>
                    <span className="text-display-md text-[#1d1d1f] font-bold">
                      {item.isFree ? 'GRATIS' : formatPrice(item.price)}
                    </span>
                  </div>
                </div>

                {/* Quick Quality Teaser Card */}
                <div className="p-4 rounded-[16px] bg-[#f0f9ff] border border-[#bae6fd] flex items-start gap-3">
                  <ShieldCheck size={20} className="text-[#0284c7] flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-[#0369a1]">
                    <span className="font-semibold text-[#075985]">Penjaminan Mutu Pangan:</span> {guideline.reheatingInstructions}
                    <button
                      type="button"
                      onClick={() => setActiveTab('keamanan')}
                      className="block mt-1 font-bold underline hover:opacity-80"
                    >
                      Lihat instruksi penyimpanan & Do's/Don'ts lengkap →
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* 4. Complete Dynamic Food Safety & Storage Specs Tab */
              <div className="space-y-4">
                {/* Temperature & Storage Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-[14px] bg-[#f5f5f7] border border-[rgba(0,0,0,0.06)]">
                    <div className="text-fine-print text-[#86868b] mb-1 flex items-center gap-1">
                      <ThermometerSun size={13} className="text-[#ff9500]" /> Suhu Penyimpanan
                    </div>
                    <div className="text-caption-strong text-[#1d1d1f]">
                      {guideline.storageTemp}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-[14px] bg-[#f5f5f7] border border-[rgba(0,0,0,0.06)]">
                    <div className="text-fine-print text-[#86868b] mb-1 flex items-center gap-1">
                      <Clock size={13} className="text-[#1d1d1f]" /> Maks. Suhu Ruang
                    </div>
                    <div className="text-caption-strong text-[#1d1d1f]">
                      {guideline.maxSafeHours} Jam sejak diambil
                    </div>
                  </div>

                  <div className="p-3.5 rounded-[14px] bg-[#f5f5f7] border border-[rgba(0,0,0,0.06)]">
                    <div className="text-fine-print text-[#86868b] mb-1 flex items-center gap-1">
                      <ShieldCheck size={13} className="text-[#34c759]" /> Maks. Kulkas (&lt;4°C)
                    </div>
                    <div className="text-caption-strong text-[#34c759]">
                      {guideline.maxRefrigeratedHours} Jam
                    </div>
                  </div>
                </div>

                {/* Reheating Guide Box */}
                <div className="p-4 rounded-[16px] bg-[#fff7ed] border border-[#ffedd5]">
                  <div className="text-caption-strong text-[#c2410c] mb-1 flex items-center gap-1.5">
                    <Flame size={16} /> Tata Cara Pemanasan Ulang (Reheating)
                  </div>
                  <p className="text-caption-apple text-[#9a3412] m-0 leading-relaxed">
                    {guideline.reheatingInstructions}
                  </p>
                </div>

                {/* Do's & Don'ts Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* DO'S (Boleh dilakukan) */}
                  <div className="p-4 rounded-[16px] bg-[#f0fdf4] border border-[#bbf7d0]">
                    <h5 className="text-caption-strong text-[#166534] mb-2 flex items-center gap-1.5">
                      <CheckCircle2 size={16} className="text-[#16a34a]" /> Hal yang Berhak/Boleh Dilakukan (Do's)
                    </h5>
                    <ul className="space-y-1.5 pl-0 text-xs text-[#15803d] list-none m-0">
                      {guideline.dos.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#16a34a] font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* DON'TS (Tidak Boleh dilakukan) */}
                  <div className="p-4 rounded-[16px] bg-[#fef2f2] border border-[#fecaca]">
                    <h5 className="text-caption-strong text-[#991b1b] mb-2 flex items-center gap-1.5">
                      <AlertTriangle size={16} className="text-[#dc2626]" /> Larangan & Tanda Rusak (Don'ts)
                    </h5>
                    <ul className="space-y-1.5 pl-0 text-xs text-[#b91c1c] list-none m-0">
                      {guideline.donts.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#dc2626] font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Terms Agreement Checkbox & Footer Controls */}
          <div className="pt-4 border-t border-[rgba(0,0,0,0.08)] space-y-4">
            <label className="flex items-start gap-3 cursor-pointer select-none bg-[#f5f5f7] p-3 rounded-[12px] border border-[rgba(0,0,0,0.06)]">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded accent-[#1d1d1f] cursor-pointer"
              />
              <span className="text-xs text-[#1d1d1f] leading-snug">
                Saya menyetujui panduan keselamatan mutu makanan di atas dan berkomitmen untuk mengambil makanan di lokasi sebelum batas waktu habis.
              </span>
            </label>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-apple-secondary flex-1 text-sm py-3"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!agreedToTerms || isLoading}
                className="btn-apple-primary flex-1 text-sm py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Memproses Checkout...' : 'Konfirmasi & Buat Pesanan Sekarang'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
