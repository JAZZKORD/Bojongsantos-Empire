'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, AlertTriangle, Shield, BookOpen, ThermometerSun, Clock, CheckCircle, Info } from 'lucide-react';

export function TermsPage() {
  const [openSection, setOpenSection] = useState<number | null>(0);

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index);
  };

  const accordionItems = [
    {
      title: '1. Peran AksesPangan sebagai Platform Penghubung',
      content:
        'AksesPangan adalah platform teknologi yang mempertemukan penyedia surplus pangan (restoran, hotel, kafe, katering, supermarket) dengan penerima manfaat. Kami tidak memproduksi atau mengolah makanan secara langsung. Tanggung jawab atas mutu dan keaslian informasi makanan awal berada pada pihak penyedia terverifikasi.',
    },
    {
      title: '2. Kebijakan Keamanan Makanan 4 Jam',
      content:
        'Seluruh makanan siap santap yang diunggah wajib mematuhi protokol batas aman penyimpanan suhu ruang maksimum 4 jam sejak selesai dimasak atau dikeluarkan dari pemanas. Penerima diwajibkan segera mengonsumsi atau menyimpan makanan dalam lemari pendingin (< 4°C) sesaat setelah diambil.',
    },
    {
      title: '3. Tanggung Jawab Penerima & Verifikasi Mandiri',
      content:
        'Penerima memiliki kewajiban untuk memeriksa secara fisik kondisi makanan (aroma, tekstur, suhu kemasan) sebelum menandatangani atau mengonfirmasi pengambilan di lokasi. Jika terdapat keraguan mutu pangan, penerima berhak membatalkan pengambilan di tempat.',
    },
    {
      title: '4. Standar Kemasan & Higienitas Penyedia',
      content:
        'Penyedia makanan surplus wajib menggunakan wadah makanan food-grade sekali pakai atau kemasan tertutup rapat yang higienis. Makanan tidak boleh terkontaminasi bahan alergen silang tanpa pencantuman label peringatan yang jelas.',
    },
    {
      title: '5. Ketentuan Pembatalan & Kedaluwarsa Booking',
      content:
        'Setiap pesanan booking surplus memiliki batas waktu tunggu (pickup deadline) maksimum 2 jam. Jika tidak diambil hingga batas waktu terlewati, pesanan akan dibatalkan secara otomatis oleh sistem agar makanan dapat dialihkan kepada penerima lain yang membutuhkan.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7] py-12 px-4 sm:px-8">
      <div className="apple-container-editorial">
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <span className="text-caption-strong text-[#0066cc] uppercase tracking-wide mb-2 inline-block">
            Dokumentasi & Regulasi
          </span>
          <h1 className="text-display-lg text-[#1d1d1f] mb-3">
            Syarat Layanan & Standar Keamanan Pangan
          </h1>
          <p className="text-body-apple text-[#86868b]">
            Panduan komprehensif keselamatan konsumsi, mitigasi risiko, dan hak pengguna ekosistem AksesPangan.
          </p>
        </div>

        {/* Food Safety 4-Pillar Grid */}
        <div className="card-apple-utility bg-white p-6 sm:p-8 mb-8">
          <h2 className="text-tagline text-[#1d1d1f] mb-2 flex items-center gap-2">
            <Shield size={20} className="text-[#0066cc]" />
            4 Kaidah Utama Keamanan Makanan Siap Santap
          </h2>
          <p className="text-caption-apple text-[#86868b] mb-6">
            Protokol wajib yang harus diperhatikan oleh penerima dan penyedia.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-[14px] bg-[#f5f5f7] flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#ff9500] flex-shrink-0 shadow-sm">
                <ThermometerSun size={18} />
              </div>
              <div>
                <h4 className="text-body-strong text-[#1d1d1f] mb-1">Perhatikan Suhu Ruang</h4>
                <p className="text-caption-apple text-[#86868b] m-0">
                  Makanan siap saji tidak boleh dibiarkan lebih dari 4 jam pada rentang suhu bahaya (5°C - 60°C).
                </p>
              </div>
            </div>

            <div className="p-5 rounded-[14px] bg-[#f5f5f7] flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#0066cc] flex-shrink-0 shadow-sm">
                <Clock size={18} />
              </div>
              <div>
                <h4 className="text-body-strong text-[#1d1d1f] mb-1">Batas Waktu Pengambilan</h4>
                <p className="text-caption-apple text-[#86868b] m-0">
                  Ambil makanan sesuai jadwal pickup deadline untuk memastikan kesegaran tetap prima.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-[14px] bg-[#f5f5f7] flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#ff3b30] flex-shrink-0 shadow-sm">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h4 className="text-body-strong text-[#1d1d1f] mb-1">Kategori Berisiko Tinggi</h4>
                <p className="text-caption-apple text-[#86868b] m-0">
                  Daging olahan, hidangan laut, santan, dan saus krim memerlukan perhatian dan penciuman ekstra.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-[14px] bg-[#f5f5f7] flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#34c759] flex-shrink-0 shadow-sm">
                <CheckCircle size={18} />
              </div>
              <div>
                <h4 className="text-body-strong text-[#1d1d1f] mb-1">Pemeriksaan Visual Mandiri</h4>
                <p className="text-caption-apple text-[#86868b] m-0">
                  Periksa kemasan tertutup rapat dan pastikan tidak ada perubahan warna atau aroma yang tidak wajar.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Warning Callout Box (Apple subtle style) */}
        <div className="p-5 rounded-[14px] bg-[#fff8eb] border border-[#ffe1a8] flex items-start gap-3.5 mb-8">
          <AlertTriangle size={20} className="text-[#ff9500] flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-body-strong text-[#b25e00] mb-0.5">Catatan Penting Konsumsi</div>
            <div className="text-caption-apple text-[#8f4b00]">
              Jika setelah dibuka makanan mengeluarkan bau masam, berlendir, atau kemasan rusak, segera buang dan laporkan melalui platform. Keselamatan Anda selalu menjadi prioritas utama.
            </div>
          </div>
        </div>

        {/* Terms Accordion (Apple Support Style) */}
        <div className="card-apple-utility bg-white p-6 sm:p-8">
          <h2 className="text-tagline text-[#1d1d1f] mb-6 flex items-center gap-2">
            <BookOpen size={20} className="text-[#0066cc]" />
            Pasal Ketentuan Penggunaan Platform
          </h2>

          <div className="divide-y divide-[rgba(0,0,0,0.08)]">
            {accordionItems.map((item, index) => {
              const isOpen = openSection === index;
              return (
                <div key={index} className="py-4">
                  <button
                    onClick={() => toggleSection(index)}
                    className="w-full text-left flex items-center justify-between gap-4 font-semibold text-[17px] text-[#1d1d1f] hover:text-[#0066cc] transition-colors"
                  >
                    <span>{item.title}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-[#86868b] flex-shrink-0"
                    >
                      <ChevronDown size={18} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden pt-3 text-body-apple text-[#86868b]"
                      >
                        <p className="m-0 leading-relaxed">{item.content}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
