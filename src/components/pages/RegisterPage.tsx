'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import type { UserRole, BusinessType } from '@/types';

export function RegisterPage() {
  const { register } = useAuth();
  const { success, error } = useNotification();
  const [role, setRole] = useState<UserRole>('penerima');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState<BusinessType>('restoran');
  const [businessAddress, setBusinessAddress] = useState('');

  const totalSteps = role === 'penyedia' ? 2 : 1;

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const result = await register({
        name,
        email,
        password,
        role,
        phone,
        ...(role === 'penyedia' && {
          businessName,
          businessType,
          businessAddress,
          location: {
            lat: -6.2088 + (Math.random() - 0.5) * 0.05,
            lng: 106.8456 + (Math.random() - 0.5) * 0.05,
          },
        }),
      });

      if (result.success) {
        success('Pendaftaran Berhasil! 🎉', 'Selamat datang di ekosistem AksesPangan');
        setTimeout(() => {
          if (role === 'penyedia') window.location.hash = '#/penyedia';
          else window.location.hash = '#/penerima';
        }, 500);
      } else {
        error('Pendaftaran Gagal', result.error || 'Terjadi kesalahan sistem');
      }
    } catch (err: any) {
      error('Pendaftaran Gagal', err.message || 'Terjadi kesalahan sistem');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
    else handleSubmit();
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col justify-center items-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-[480px]">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <a href="#/" className="inline-flex items-center gap-2 text-3xl mb-3 no-underline">
            🍽️
          </a>
          <h1 className="text-display-md text-[#1d1d1f] mb-1">
            Buat Akun Baru
          </h1>
          <p className="text-body-apple text-[#86868b] m-0">
            Pilih peran Anda dalam ekosistem penyelamatan makanan.
          </p>
        </div>

        {/* Apple Card */}
        <div className="bg-white rounded-[22px] p-8 border border-[rgba(0,0,0,0.08)] product-hero-shadow mb-6">
          {/* Role Picker Pills */}
          <div className="grid grid-cols-2 gap-3 mb-6 p-1 bg-[#f5f5f7] rounded-full">
            <button
              type="button"
              onClick={() => {
                setRole('penerima');
                setStep(1);
              }}
              className={`py-2 px-4 rounded-full text-xs font-semibold tracking-tight transition-all ${
                role === 'penerima'
                  ? 'bg-[#1d1d1f] text-white shadow-sm'
                  : 'text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              Penerima (Masyarakat)
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('penyedia');
                setStep(1);
              }}
              className={`py-2 px-4 rounded-full text-xs font-semibold tracking-tight transition-all ${
                role === 'penyedia'
                  ? 'bg-[#1d1d1f] text-white shadow-sm'
                  : 'text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              Penyedia (Mitra Usaha)
            </button>
          </div>

          {/* Form Step 1: Personal Info */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div>
                <label className="block text-caption-strong text-[#1d1d1f] mb-1.5">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama lengkap Anda"
                  className="apple-input"
                />
              </div>

              <div>
                <label className="block text-caption-strong text-[#1d1d1f] mb-1.5">
                  Alamat Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="apple-input"
                />
              </div>

              <div>
                <label className="block text-caption-strong text-[#1d1d1f] mb-1.5">
                  Nomor WhatsApp / Telepon
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812xxxxxxxx"
                  className="apple-input"
                />
              </div>

              <div>
                <label className="block text-caption-strong text-[#1d1d1f] mb-1.5">
                  Kata Sandi
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="apple-input"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!name || !email || !password}
                  className="btn-apple-primary w-full text-base py-3"
                >
                  {role === 'penyedia' ? 'Lanjut: Data Restoran →' : (isLoading ? 'Mendaftarkan...' : 'Selesaikan Pendaftaran')}
                </button>
              </div>
            </motion.div>
          )}

          {/* Form Step 2: Business Info (Only for Penyedia) */}
          {step === 2 && role === 'penyedia' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div>
                <label className="block text-caption-strong text-[#1d1d1f] mb-1.5">
                  Nama Usaha / Restoran / Hotel
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Contoh: Dapur Sedap Rasa"
                  className="apple-input"
                />
              </div>

              <div>
                <label className="block text-caption-strong text-[#1d1d1f] mb-1.5">
                  Jenis Usaha Makanan
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value as BusinessType)}
                  className="apple-input"
                >
                  <option value="restoran">Restoran</option>
                  <option value="hotel">Hotel</option>
                  <option value="kafe">Kafe / Kedai Kopi</option>
                  <option value="katering">Jasa Katering</option>
                  <option value="supermarket">Supermarket / Toko Roti</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-caption-strong text-[#1d1d1f] mb-1.5">
                  Alamat Lengkap Usaha (Lokasi Ambil)
                </label>
                <textarea
                  rows={3}
                  required
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  placeholder="Jalan, nomor, kelurahan, kota..."
                  className="apple-input h-auto py-2.5"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn-apple-secondary flex-1 py-3 text-sm"
                >
                  ← Kembali
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading || !businessName || !businessAddress}
                  className="btn-apple-primary flex-1 py-3 text-sm"
                >
                  {isLoading ? 'Mendaftarkan...' : 'Konfirmasi & Mulai'}
                </button>
              </div>
            </motion.div>
          )}

          <div className="mt-6 pt-5 border-t border-[rgba(0,0,0,0.06)] text-center text-caption-apple text-[#86868b]">
            Sudah memiliki akun?{' '}
            <a href="#/login" className="link-apple text-caption-strong">
              Masuk di sini
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
