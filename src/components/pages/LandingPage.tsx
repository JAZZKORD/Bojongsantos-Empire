'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Clock,
  MapPin,
  Shield,
  Leaf,
  Volume2,
  VolumeX,
  ChevronRight,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { getActiveSurplus, calculateImpact } from '@/lib/data';
import { formatCountdown, formatPrice } from '@/lib/utils';
import type { SurplusItem, ImpactData } from '@/types';

export function LandingPage() {
  const [activeItems, setActiveItems] = useState<SurplusItem[]>([]);
  const [impact, setImpact] = useState<ImpactData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Video state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    setActiveItems(getActiveSurplus());
    setImpact(calculateImpact());
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const categories = [
    { id: 'all', label: 'SEMUA SURPLUS' },
    { id: 'nasi', label: 'KULINER UTAMA' },
    { id: 'roti', label: 'PATISSERIE & ROTI' },
    { id: 'sayur', label: 'HASIL BUMI SEGAR' },
    { id: 'minuman', label: 'BOTANICAL DRINKS' },
  ];

  const getCategoryPhoto = (category: string) => {
    switch (category) {
      case 'roti':
        return '/images/surplus-bakery.jpg';
      case 'sayur':
        return '/images/surplus-produce.jpg';
      case 'minuman':
        return '/images/surplus-beverage.jpg';
      case 'nasi':
      default:
        return '/images/surplus-gourmet.jpg';
    }
  };

  const filteredItems =
    selectedCategory === 'all'
      ? activeItems
      : activeItems.filter((i) => i.foodCategory === selectedCategory);

  return (
    <div className="w-full bg-white overflow-hidden selection:bg-black selection:text-white">
      {/* ============================================================
          SECTION 1: HAUTE EDITORIAL HERO SPLIT-SCREEN
          Left: Cinema-Grade Moving Video (Bakery & Fine Prep)
          Right: Pure Deep Black (#000000) Luxury Card with Cormorant/Playfair
          ============================================================ */}
      <section className="w-full min-h-[580px] lg:h-[calc(100vh-68px)] lg:max-h-[760px] grid grid-cols-1 lg:grid-cols-2 bg-black">
        {/* LEFT COLUMN: Moving Video */}
        <div className="relative w-full h-[380px] sm:h-[460px] lg:h-full bg-[#0a0a0a] overflow-hidden group">
          <video
            ref={videoRef}
            src="/videos/hero-food.webm"
            poster="/images/hero-video-poster.jpg"
            autoPlay
            muted={isMuted}
            loop
            playsInline
            className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
          />

          {/* Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

          {/* Top-Left Chapter Stamp */}
          <div className="absolute top-6 left-6 z-10">
            <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/80 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-[2px] border border-white/15">
              01 / DARI DAPUR ARTISAN TERVERIFIKASI
            </div>
          </div>

          {/* Bottom-Right Minimalist Mute Button */}
          <div className="absolute bottom-6 right-6 z-10">
            <button
              onClick={toggleMute}
              className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/80 hover:border-white/40 transition-all focus:outline-none"
              title={isMuted ? 'Nyalakan Audio' : 'Bisukan Audio'}
              aria-label="Toggle Audio"
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Pure Black Luxury Editorial Card */}
        <div className="w-full h-full bg-[#000000] text-white flex flex-col justify-center px-8 sm:px-14 lg:px-20 py-16 lg:py-0">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl"
          >
            {/* Eyebrow */}
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8e8e93] mb-5 flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
              <span>KURASI SURPLUS HOTEL & RESTORAN BINTANG LIMA</span>
            </div>

            {/* Headline with Playfair Display & Cormorant Garamond Italic */}
            <h1 className="font-luxury-headline text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08] mb-6">
              Tiada pangan <br />
              <span className="font-luxury-italic font-normal italic text-[#eeeeee]">
                yang tersia.
              </span>
            </h1>

            {/* Editorial Narrative */}
            <p className="text-[15px] sm:text-[16px] leading-[1.65] text-[#bfbfbf] font-normal mb-8 max-w-lg">
              Dari perjamuan hotel bintang lima hingga kedai artisan lokal. AksesPangan
              mengalirkan surplus hidangan istimewa langsung ke tangan penikmat dan komunitas
              secara real-time—terjaga kesegarannya, bermartabat, dan tanpa jejak emisi.
            </p>

            {/* Peak Design Style Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <a href="#/penerima" className="btn-peak-white group">
                <span>AMBIL SURPLUS SEKARANG</span>
                <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
              </a>

              <a href="#/penyedia" className="btn-peak-outline">
                GABUNG SEBAGAI MITRA
              </a>
            </div>

            {/* Subtle Luxury Trust Line */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-[10px] uppercase tracking-[0.14em] text-[#86868b] font-medium">
              <span>SOP HIGIENE 4 JAM</span>
              <span>•</span>
              <span>JAMINAN MUTU 100%</span>
              <span>•</span>
              <span>DISTRIBUSI REAL-TIME</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================
          SECTION 2: EDITORIAL CATALOG (Curated Photography, No Cheap Emojis)
          ============================================================ */}
      <section className="w-full py-20 px-6 sm:px-12 bg-[#fafafc] border-b border-[rgba(0,0,0,0.06)]">
        <div className="max-w-[1440px] mx-auto">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-5 border-b border-[rgba(0,0,0,0.08)]">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#86868b] font-semibold block mb-1.5 font-mono">
                INVENTARIS SURPLUS AKTIF HARI INI
              </span>
              <h2 className="font-luxury-headline text-3xl sm:text-4xl font-bold tracking-tight text-[#111111]">
                Katalog Pangan <span className="font-luxury-italic italic font-normal text-[#555555]">Tersedia.</span>
              </h2>
              <p className="text-[14px] text-[#666666] m-0 mt-1">
                Hidangan siap santap pilihan dari restoran terakreditasi, siap diambil sebelum batas waktu berakhir.
              </p>
            </div>

            <a
              href="#/penerima"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-black hover:opacity-70 transition-opacity mt-4 sm:mt-0 no-underline"
            >
              <span>BUKA PETA GEOLOCATION</span>
              <ArrowRight size={13} />
            </a>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-10">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-[11px] font-semibold tracking-[0.1em] rounded-[3px] transition-all cursor-pointer whitespace-nowrap uppercase ${
                  selectedCategory === cat.id
                    ? 'bg-black text-white'
                    : 'bg-white text-[#666666] border border-[rgba(0,0,0,0.1)] hover:border-black hover:text-black'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* High-End Editorial Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-[4px] border border-[rgba(0,0,0,0.08)] overflow-hidden flex flex-col justify-between hover:border-black transition-all duration-300 group hover:shadow-lg"
              >
                <div>
                  {/* Photo Container with subtle zoom */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#f0f0f0]">
                    <img
                      src={getCategoryPhoto(item.foodCategory)}
                      alt={item.name}
                      className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Minimalist Price Tag */}
                    <div className="absolute top-3 right-3 z-10">
                      <span
                        className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-[2px] ${
                          item.isFree
                            ? 'bg-[#1b8a36] text-white'
                            : 'bg-black text-white'
                        }`}
                      >
                        {item.isFree ? 'GRATIS' : formatPrice(item.price)}
                      </span>
                    </div>

                    {/* Remaining Portions Tag */}
                    <div className="absolute bottom-3 left-3 z-10">
                      <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-[2px] bg-black/60 backdrop-blur-md text-white border border-white/20">
                        {item.quantity} kg · {item.portionCount} porsi
                      </span>
                    </div>
                  </div>

                  {/* Content Padding */}
                  <div className="p-6">
                    <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#86868b] mb-1.5 flex items-center gap-1">
                      <MapPin size={11} className="text-black" />
                      <span className="truncate">{item.providerBusinessName} • {item.address}</span>
                    </div>

                    <h3 className="font-luxury-headline text-[19px] font-bold text-[#111111] mb-2 line-clamp-1">
                      {item.name}
                    </h3>

                    <p className="text-[13px] text-[#555555] leading-relaxed mb-4 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-6 py-4 bg-[#fafafc] border-t border-[rgba(0,0,0,0.06)] flex items-center justify-between">
                  <div className="text-[11px] text-[#b25e00] font-medium flex items-center gap-1.5 font-mono">
                    <Clock size={12} />
                    <span>Sisa {formatCountdown(item.expiryTime)}</span>
                  </div>

                  <a
                    href="#/penerima"
                    className="text-[11px] font-bold uppercase tracking-[0.1em] py-2 px-3.5 bg-black text-white hover:bg-[#262626] transition-colors rounded-[2px] no-underline"
                  >
                    Klaim Porsi →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 3: THREE PILLARS (Haute Minimalist Luxury)
          ============================================================ */}
      <section className="w-full py-24 px-6 sm:px-12 bg-black text-white">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#86868b] block mb-2.5 font-mono">
              PROTOKOL KEAMANAN & INTEGRITAS
            </span>
            <h2 className="font-luxury-headline text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Cepat. Higienis. Tepat Sasaran.
            </h2>
            <p className="text-[#a1a1a6] text-[15px] leading-relaxed m-0">
              Sistem penyelamatan makanan terotomatisasi yang menjaga kehormatan hidangan dan menjamin keamanan konsumsi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-[4px] bg-[#111111] border border-white/10 flex flex-col justify-between">
              <div>
                <span className="font-luxury-headline text-3xl font-bold text-[#555555] block mb-4">
                  01
                </span>
                <h3 className="text-[18px] font-bold text-white mb-2 tracking-tight">Unggah Surplus 60 Detik</h3>
                <p className="text-xs text-[#a1a1a6] leading-relaxed mb-6">
                  Restoran dan bakery terverifikasi mengunggah hidangan berlebih, porsi aman, dan batas kadaluwarsa melalui antarmuka khusus tanpa hambatan birokrasi.
                </p>
              </div>
              <a href="#/penyedia" className="text-[11px] font-bold uppercase tracking-[0.14em] text-white inline-flex items-center gap-1 hover:underline no-underline">
                Alur Mitra Penyedia <ChevronRight size={12} />
              </a>
            </div>

            <div className="p-8 rounded-[4px] bg-[#111111] border border-white/10 flex flex-col justify-between">
              <div>
                <span className="font-luxury-headline text-3xl font-bold text-[#555555] block mb-4">
                  02
                </span>
                <h3 className="text-[18px] font-bold text-white mb-2 tracking-tight">SOP Countdown 4 Jam</h3>
                <p className="text-xs text-[#a1a1a6] leading-relaxed mb-6">
                  Algoritma ketat menjaga rentang waktu konsumsi makanan. Setiap item yang melewati batas aman secara otomatis ditarik dari katalog publik.
                </p>
              </div>
              <a href="#/terms" className="text-[11px] font-bold uppercase tracking-[0.14em] text-white inline-flex items-center gap-1 hover:underline no-underline">
                Panduan Keamanan Pangan <ChevronRight size={12} />
              </a>
            </div>

            <div className="p-8 rounded-[4px] bg-[#111111] border border-white/10 flex flex-col justify-between">
              <div>
                <span className="font-luxury-headline text-3xl font-bold text-[#555555] block mb-4">
                  03
                </span>
                <h3 className="text-[18px] font-bold text-white mb-2 tracking-tight">Reduksi Emisi Metana Nyata</h3>
                <p className="text-xs text-[#a1a1a6] leading-relaxed mb-6">
                  Setiap kilogram makanan yang terselamatkan diverifikasi dalam laporan iklim ESG: 1 kg pangan setara pencegahan 2.5 kg gas rumah kaca CO₂e.
                </p>
              </div>
              <a href="#/dashboard" className="text-[11px] font-bold uppercase tracking-[0.14em] text-white inline-flex items-center gap-1 hover:underline no-underline">
                Telemetri Karbon <ChevronRight size={12} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 4: REAL IMPACT & ESG METRICS
          ============================================================ */}
      <section className="w-full py-24 px-6 sm:px-12 bg-white border-b border-[rgba(0,0,0,0.06)]">
        <div className="max-w-[1440px] mx-auto text-center">
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#86868b] block mb-2 font-mono">
            PEMANTAU DAMPAK REAL-TIME
          </span>
          <h2 className="font-luxury-headline text-3xl sm:text-4xl font-bold tracking-tight text-[#111111] mb-14">
            Dampak Nyata, <span className="font-luxury-italic italic font-normal text-[#555555]">Bukan Sekadar Wacana.</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto mb-14">
            <div className="p-8 bg-[#fafafc] rounded-[4px] text-left border border-[rgba(0,0,0,0.06)]">
              <div className="font-luxury-headline text-3xl sm:text-4xl font-bold text-black mb-1">
                {impact?.totalKgSaved || 130} <span className="text-sm font-normal text-[#86868b] font-sans">kg</span>
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#86868b] font-mono">
                Pangan Diselamatkan
              </div>
            </div>

            <div className="p-8 bg-[#fafafc] rounded-[4px] text-left border border-[rgba(0,0,0,0.06)]">
              <div className="font-luxury-headline text-3xl sm:text-4xl font-bold text-[#1b8a36] mb-1">
                {impact?.totalPortions || 325} <span className="text-sm font-normal text-[#86868b] font-sans">porsi</span>
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#86868b] font-mono">
                Porsi Didistribusikan
              </div>
            </div>

            <div className="p-8 bg-[#fafafc] rounded-[4px] text-left border border-[rgba(0,0,0,0.06)]">
              <div className="font-luxury-headline text-3xl sm:text-4xl font-bold text-black mb-1">
                {impact?.totalCO2eSaved || 325} <span className="text-sm font-normal text-[#86868b] font-sans">kg</span>
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#86868b] font-mono">
                CO₂e Tercegah
              </div>
            </div>

            <div className="p-8 bg-[#fafafc] rounded-[4px] text-left border border-[rgba(0,0,0,0.06)]">
              <div className="font-luxury-headline text-3xl sm:text-4xl font-bold text-black mb-1">
                {impact?.treeEquivalent || 15} <span className="text-sm font-normal text-[#86868b] font-sans">pohon</span>
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#86868b] font-mono">
                Ekuivalensi Pohon
              </div>
            </div>
          </div>

          <a href="#/dashboard" className="btn-peak-white !bg-black !text-white hover:!bg-[#222222]">
            BUKA LAPORAN DAMPAK LENGKAP →
          </a>
        </div>
      </section>

      {/* ============================================================
          SECTION 5: FOOTER (Haute Minimalism)
          ============================================================ */}
      <footer className="w-full bg-[#0a0a0a] text-white py-20 px-6 sm:px-12 border-t border-white/10">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#86868b] mb-5 font-mono">
                Katalog & Pangan
              </h4>
              <ul className="list-none p-0 m-0 space-y-3 text-xs text-[#b5b5b5]">
                <li><a href="#/penerima" className="hover:text-white no-underline text-[#b5b5b5]">Cari Surplus Terdekat</a></li>
                <li><a href="#/penerima" className="hover:text-white no-underline text-[#b5b5b5]">Peta Geolocation GPS</a></li>
                <li><a href="#/penerima" className="hover:text-white no-underline text-[#b5b5b5]">Kategori Makanan</a></li>
                <li><a href="#/terms" className="hover:text-white no-underline text-[#b5b5b5]">SOP Higiene 4 Jam</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#86868b] mb-5 font-mono">
                Mitra Penyedia
              </h4>
              <ul className="list-none p-0 m-0 space-y-3 text-xs text-[#b5b5b5]">
                <li><a href="#/register" className="hover:text-white no-underline text-[#b5b5b5]">Daftarkan Usaha Kuliner</a></li>
                <li><a href="#/penyedia" className="hover:text-white no-underline text-[#b5b5b5]">Dashboard Manajemen Stok</a></li>
                <li><a href="#/penyedia/surplus" className="hover:text-white no-underline text-[#b5b5b5]">Unggah Makanan Berlebih</a></li>
                <li><a href="#/penyedia/booking" className="hover:text-white no-underline text-[#b5b5b5]">Konfirmasi Penjemputan</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#86868b] mb-5 font-mono">
                Dampak Lingkungan
              </h4>
              <ul className="list-none p-0 m-0 space-y-3 text-xs text-[#b5b5b5]">
                <li><a href="#/dashboard" className="hover:text-white no-underline text-[#b5b5b5]">Telemetri Karbon CO₂e</a></li>
                <li><a href="#/dashboard" className="hover:text-white no-underline text-[#b5b5b5]">Ekuivalensi Serapan Pohon</a></li>
                <li><a href="#/admin" className="hover:text-white no-underline text-[#b5b5b5]">Audit Microservices</a></li>
                <li><a href="#/dashboard" className="hover:text-white no-underline text-[#b5b5b5]">Laporan ESG Transparan</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#86868b] mb-5 font-mono">
                Platform & Legalitas
              </h4>
              <ul className="list-none p-0 m-0 space-y-3 text-xs text-[#b5b5b5]">
                <li><a href="#/terms" className="hover:text-white no-underline text-[#b5b5b5]">Syarat & Ketentuan</a></li>
                <li><a href="#/terms" className="hover:text-white no-underline text-[#b5b5b5]">Kebijakan Higiene Pangan</a></li>
                <li><a href="#/login" className="hover:text-white no-underline text-[#b5b5b5]">Akses Masuk Akun</a></li>
                <li><a href="#/register" className="hover:text-white no-underline text-[#b5b5b5]">Registrasi Akun Baru</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#86868b]">
            <p className="m-0 mb-3 sm:mb-0">
              © 2026 AksesPangan Inc. Gerakan Penyelamatan Makanan Indonesia.
            </p>
            <div className="flex gap-6">
              <a href="#/terms" className="text-[#86868b] hover:text-white no-underline">Privasi</a>
              <a href="#/terms" className="text-[#86868b] hover:text-white no-underline">Ketentuan</a>
              <a href="#/terms" className="text-[#86868b] hover:text-white no-underline">Standar Mutu</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
