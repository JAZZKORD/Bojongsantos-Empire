'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Receipt, BarChart3, Trash2, Search, Shield, Server, CheckCircle2, RefreshCw, Activity } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { adminService } from '@/services/adminService';
import { impactService } from '@/services/impactService';
import { formatDateTime } from '@/lib/utils';
import { BOOKING_STATUS_LABELS } from '@/types';
import type { User, Booking, BookingStatus, ImpactData } from '@/types';
import type { ServiceHealth } from '@/types/api';

export function AdminDashboard() {
  const { user } = useAuth();
  const { success, error } = useNotification();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'transactions' | 'microservices'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [impact, setImpact] = useState<ImpactData | null>(null);
  const [services, setServices] = useState<ServiceHealth[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = async () => {
    setIsRefreshing(true);
    try {
      const [u, b, imp, s] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getTransactions(),
        impactService.getStats(),
        adminService.getServicesHealth(),
      ]);
      setUsers(u);
      setBookings(b);
      setImpact(imp);
      setServices(s);
    } catch {
      error('Gagal memuat data', 'Terjadi kesalahan saat memuat data admin');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleDeleteUser = async (userId: string, name: string) => {
    if (userId === user?.id) return;
    try {
      await adminService.deleteUser(userId);
      success('Pengguna Dihapus', `${name} telah dihapus dari sistem`);
      refresh();
    } catch {
      error('Gagal menghapus', 'Terjadi kesalahan saat menghapus pengguna');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-[#f5f5f7]">
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#86868b] mb-4 border border-[rgba(0,0,0,0.08)]">
          <Shield size={32} />
        </div>
        <h2 className="text-display-md text-[#1d1d1f] mb-2">Akses Dibatasi</h2>
        <p className="text-body-apple text-[#86868b] max-w-sm mb-6">
          Halaman ini khusus untuk administrator platform AksesPangan.
        </p>
        <a href="#/login" className="btn-apple-primary">
          Masuk Sebagai Admin
        </a>
      </div>
    );
  }

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
    { id: 'users' as const, label: 'Pengguna', icon: Users },
    { id: 'transactions' as const, label: 'Transaksi', icon: Receipt },
    { id: 'microservices' as const, label: 'Microservices', icon: Server },
  ];

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f5f5f7] py-8 px-4 sm:px-8">
      <div className="apple-container">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-display-lg text-[#1d1d1f] mb-1">Admin Governance</h1>
            <p className="text-body-apple text-[#86868b]">
              Pengawasan platform & status kesehatan seluruh microservices.
            </p>
          </div>

          <button
            onClick={refresh}
            disabled={isRefreshing}
            className="btn-apple-dark text-xs flex items-center gap-1.5 self-start sm:self-auto py-2 px-3.5"
          >
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
            <span>Sinkronisasi Data</span>
          </button>
        </div>

        {/* Apple Segmented Control Switcher */}
        <div className="flex items-center bg-[#e5e5ea] p-1 rounded-full w-full max-w-md mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-1.5 px-3 rounded-full text-xs font-semibold tracking-tight transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-[#1d1d1f] shadow-sm'
                  : 'text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* 1. Overview Tab */}
        {activeTab === 'overview' && impact && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card-apple-utility bg-white p-5 text-center">
                <div className="text-display-md font-semibold text-[#1d1d1f]">{users.length}</div>
                <div className="text-caption-apple text-[#86868b]">Total Akun Terdaftar</div>
              </div>
              <div className="card-apple-utility bg-white p-5 text-center">
                <div className="text-display-md font-semibold text-[#34c759]">{impact.totalKgSaved} kg</div>
                <div className="text-caption-apple text-[#86868b]">Makanan Terselamatkan</div>
              </div>
              <div className="card-apple-utility bg-white p-5 text-center">
                <div className="text-display-md font-semibold text-[#0066cc]">{bookings.length}</div>
                <div className="text-caption-apple text-[#86868b]">Transaksi Tercatat</div>
              </div>
              <div className="card-apple-utility bg-white p-5 text-center">
                <div className="text-display-md font-semibold text-[#ff9500]">{impact.totalCO2eSaved} kg</div>
                <div className="text-caption-apple text-[#86868b]">CO₂e Ditekan</div>
              </div>
            </div>

            <div className="card-apple-utility bg-white p-6">
              <h3 className="text-tagline text-[#1d1d1f] mb-4">Transaksi Terkini</h3>
              <div className="divide-y divide-[rgba(0,0,0,0.06)]">
                {bookings.slice(0, 5).map((b) => (
                  <div key={b.id} className="py-3.5 flex items-center justify-between">
                    <div>
                      <div className="text-body-strong text-[#1d1d1f]">{b.surplusName}</div>
                      <div className="text-caption-apple text-[#86868b]">
                        {b.recipientName} • {b.providerBusinessName} • {b.quantity} kg
                      </div>
                    </div>
                    <span className="badge-apple badge-apple-neutral text-xs">
                      {BOOKING_STATUS_LABELS[b.status] || b.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* 2. Users Tab */}
        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b]" />
              <input
                type="text"
                placeholder="Cari akun pengguna berdasarkan nama atau email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="apple-search-pill"
              />
            </div>

            <div className="card-apple-utility bg-white p-0 overflow-hidden">
              <div className="divide-y divide-[rgba(0,0,0,0.06)]">
                {filteredUsers.map((u) => (
                  <div key={u.id} className="p-4 sm:px-6 flex items-center justify-between">
                    <div>
                      <div className="text-body-strong text-[#1d1d1f] flex items-center gap-2">
                        {u.name}
                        {u.id === user.id && (
                          <span className="text-xs text-[#0066cc] font-normal">(Akun Anda)</span>
                        )}
                      </div>
                      <div className="text-caption-apple text-[#86868b]">
                        {u.email} • {u.phone} {u.businessName ? `• ${u.businessName}` : ''}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`badge-apple ${
                        u.role === 'admin' ? 'badge-apple-info' : u.role === 'penyedia' ? 'badge-apple-warning' : 'badge-apple-success'
                      }`}>
                        {u.role.toUpperCase()}
                      </span>
                      {u.id !== user.id && (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="p-1.5 text-[#ff3b30] hover:bg-[#ff3b30]/10 rounded-full transition-colors"
                          title="Hapus Pengguna"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* 3. Transactions Tab */}
        {activeTab === 'transactions' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="card-apple-utility bg-white p-0 overflow-hidden">
              <div className="divide-y divide-[rgba(0,0,0,0.06)]">
                {bookings.map((b) => (
                  <div key={b.id} className="p-4 sm:px-6 flex items-center justify-between">
                    <div>
                      <div className="text-body-strong text-[#1d1d1f] mb-0.5">{b.surplusName}</div>
                      <div className="text-caption-apple text-[#86868b]">
                        Penerima: {b.recipientName} • Restoran: {b.providerBusinessName} • Jumlah: {b.quantity} kg
                      </div>
                      <div className="text-fine-print text-[#86868b] mt-1">
                        {formatDateTime(b.bookedAt)}
                      </div>
                    </div>
                    <span className="badge-apple badge-apple-neutral text-xs">
                      {BOOKING_STATUS_LABELS[b.status] || b.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* 4. Microservices Observability Tab (Apple Server Monitoring) */}
        {activeTab === 'microservices' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div>
              <h3 className="text-tagline text-[#1d1d1f] mb-1">Status Operasional Microservices</h3>
              <p className="text-caption-apple text-[#86868b]">
                Seluruh endpoint beroperasi mandiri dengan kontrak REST API TypeScript murni.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((svc) => (
                <div key={svc.service} className="card-apple-utility bg-white p-5 flex items-start justify-between">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-[#34c759]/10 flex items-center justify-center text-[#34c759] flex-shrink-0">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <div className="text-body-strong text-[#1d1d1f] mb-0.5">{svc.service}</div>
                      <div className="flex items-center gap-2 text-xs text-[#34c759] font-medium">
                        <span className="w-2 h-2 rounded-full bg-[#34c759] animate-pulse" />
                        100% Operasional
                      </div>
                      <div className="text-fine-print text-[#86868b] mt-1.5">
                        Uptime: {Math.floor(svc.uptimeSeconds / 60)} menit • Sinkron: {new Date(svc.timestamp).toLocaleTimeString('id-ID')}
                      </div>
                    </div>
                  </div>
                  <span className="badge-apple badge-apple-success text-xs font-mono">200 OK</span>
                </div>
              ))}
            </div>

            {/* Microservice Endpoints Registry */}
            <div className="card-apple-utility bg-white p-6">
              <h4 className="text-body-strong text-[#1d1d1f] mb-3">Katalog Endpoint Terintegrasi</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-[#1d1d1f]">
                <div className="bg-[#f5f5f7] p-2.5 rounded-[8px] flex items-center justify-between">
                  <span>POST /api/auth/login</span>
                  <span className="text-[#34c759]">Active</span>
                </div>
                <div className="bg-[#f5f5f7] p-2.5 rounded-[8px] flex items-center justify-between">
                  <span>POST /api/auth/register</span>
                  <span className="text-[#34c759]">Active</span>
                </div>
                <div className="bg-[#f5f5f7] p-2.5 rounded-[8px] flex items-center justify-between">
                  <span>GET /api/surplus</span>
                  <span className="text-[#34c759]">Active</span>
                </div>
                <div className="bg-[#f5f5f7] p-2.5 rounded-[8px] flex items-center justify-between">
                  <span>POST /api/surplus</span>
                  <span className="text-[#34c759]">Active</span>
                </div>
                <div className="bg-[#f5f5f7] p-2.5 rounded-[8px] flex items-center justify-between">
                  <span>POST /api/bookings</span>
                  <span className="text-[#34c759]">Active</span>
                </div>
                <div className="bg-[#f5f5f7] p-2.5 rounded-[8px] flex items-center justify-between">
                  <span>GET /api/impact/stats</span>
                  <span className="text-[#34c759]">Active</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
