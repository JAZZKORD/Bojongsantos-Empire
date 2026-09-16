'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  User,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { getBookingsByRecipient } from '@/lib/data';

interface NavbarProps {
  currentRoute?: string;
}

export function Navbar({ currentRoute }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const { info } = useNotification();
  const [mobileMenuOpen, setMenuOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState(currentRoute || '/');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBookingsCount, setActiveBookingsCount] = useState(0);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      setActiveRoute(hash);
      setMenuOpen(false);
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    if (user && user.role === 'penerima') {
      const bookings = getBookingsByRecipient(user.id);
      const active = bookings.filter((b) => ['menunggu', 'dikonfirmasi'].includes(b.status));
      setActiveBookingsCount(active.length);
    } else {
      setActiveBookingsCount(0);
    }
  }, [user, activeRoute]);

  const handleLogout = () => {
    logout();
    info('Sampai jumpa!', 'Anda telah keluar dari akun');
    window.location.hash = '#/';
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.hash = '#/penerima';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[rgba(0,0,0,0.06)] transition-all">
      {/* SINGLE LUXURY EDITORIAL NAVIGATION BAR (68px) */}
      <nav className="w-full h-[68px] px-6 sm:px-10 flex items-center justify-between">
        <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between gap-8">
          {/* Left: Luxury Brand Mark + Editorial Navigation */}
          <div className="flex items-center gap-10">
            {/* Peak Design Style Monogram */}
            <a href="#/" className="flex items-center gap-3 no-underline text-black group">
              <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-[3px] transition-transform duration-300 group-hover:scale-105">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2.5L3.5 8.5L12 14.5L20.5 8.5L12 2.5Z" fill="#ffffff" />
                  <path d="M3.5 13.5L12 19.5L20.5 13.5" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-[13px] tracking-[0.2em] text-black uppercase leading-none">
                  Akses<span className="font-light text-[#777777]">Pangan</span>
                </span>
                <span className="text-[9px] tracking-[0.25em] text-[#999999] uppercase font-mono mt-0.5">
                  Surplus Network
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-8 text-[12px] font-medium tracking-[0.08em] uppercase text-[#666666]">
              <a
                href="#/penerima"
                className={`transition-colors no-underline hover:text-black py-1 relative ${
                  activeRoute.startsWith('/penerima') ? 'text-black font-semibold' : ''
                }`}
              >
                Katalog Surplus
                {activeRoute.startsWith('/penerima') && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-black" />
                )}
              </a>

              <a
                href="#/penyedia"
                className={`transition-colors no-underline hover:text-black py-1 relative ${
                  activeRoute.startsWith('/penyedia') ? 'text-black font-semibold' : ''
                }`}
              >
                Untuk Penyedia
                {activeRoute.startsWith('/penyedia') && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-black" />
                )}
              </a>

              <a
                href="#/dashboard"
                className={`transition-colors no-underline hover:text-black py-1 relative ${
                  activeRoute.startsWith('/dashboard') ? 'text-black font-semibold' : ''
                }`}
              >
                Dampak ESG
                {activeRoute.startsWith('/dashboard') && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-black" />
                )}
              </a>

              <a
                href="#/terms"
                className={`transition-colors no-underline hover:text-black py-1 relative ${
                  activeRoute.startsWith('/terms') ? 'text-black font-semibold' : ''
                }`}
              >
                Standar Mutu
                {activeRoute.startsWith('/terms') && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-black" />
                )}
              </a>

              {user?.role === 'admin' && (
                <a
                  href="#/admin"
                  className="transition-colors no-underline text-black font-semibold flex items-center gap-1 py-1"
                >
                  <Shield size={13} className="text-black" />
                  Admin
                </a>
              )}
            </div>
          </div>

          {/* Center: Peak Design Ultra-Clean Search Input */}
          <div className="hidden md:flex flex-1 max-w-sm mx-4">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari hidangan surplus, bakery, hotel..."
                className="w-full h-[36px] pl-9 pr-12 text-[12px] rounded-[3px] border border-[rgba(0,0,0,0.12)] bg-[#fafafc] text-black placeholder-[#999999] focus:bg-white focus:border-black focus:outline-none transition-all"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono text-[#888888] bg-white px-1.5 py-0.5 rounded border border-[rgba(0,0,0,0.1)]">
                ⌘K
              </span>
            </form>
          </div>

          {/* Right: High-End Actions */}
          <div className="flex items-center gap-6 text-[12px] font-medium tracking-[0.06em] uppercase">
            {/* Support Link */}
            <a
              href="#/terms"
              className="hidden sm:inline-block text-[#666666] hover:text-black transition-colors no-underline"
            >
              Bantuan
            </a>

            {/* Account Status */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <a
                  href={user.role === 'penyedia' ? '#/penyedia' : '#/penerima'}
                  className="flex items-center gap-1.5 text-black no-underline font-semibold"
                >
                  <User size={15} />
                  <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
                </a>
                <button
                  onClick={handleLogout}
                  className="text-xs text-[#888888] hover:text-black transition-colors p-1"
                  title="Keluar"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <a
                href="#/login"
                className="flex items-center gap-1.5 text-black hover:opacity-70 transition-opacity no-underline font-semibold"
              >
                <User size={15} />
                <span className="hidden sm:inline">Masuk</span>
              </a>
            )}

            {/* Claim Bag / Cart Icon */}
            <a
              href={user?.role === 'penyedia' ? '#/penyedia/booking' : '#/penerima/booking'}
              className="relative p-1.5 text-black hover:opacity-70 transition-opacity no-underline"
              title="Pesanan / Klaim Surplus"
            >
              <ShoppingBag size={17} />
              {activeBookingsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {activeBookingsCount}
                </span>
              )}
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-black p-1 hover:opacity-75 focus:outline-none"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white text-black px-6 py-6 border-b border-[rgba(0,0,0,0.08)] shadow-xl"
          >
            <form onSubmit={handleSearchSubmit} className="mb-6">
              <div className="relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888888]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari hidangan surplus..."
                  className="w-full h-[38px] pl-10 pr-4 text-xs rounded-[3px] border border-[rgba(0,0,0,0.15)] bg-[#f8f8fa] text-black focus:outline-none"
                />
              </div>
            </form>

            <div className="flex flex-col gap-4 text-[14px] font-medium tracking-[0.06em] uppercase">
              <a
                href="#/"
                onClick={() => setMenuOpen(false)}
                className="text-black hover:opacity-70 no-underline py-1.5 border-b border-gray-100"
              >
                Beranda
              </a>
              <a
                href="#/penerima"
                onClick={() => setMenuOpen(false)}
                className="text-black hover:opacity-70 no-underline py-1.5 border-b border-gray-100"
              >
                Katalog Surplus
              </a>
              <a
                href="#/penyedia"
                onClick={() => setMenuOpen(false)}
                className="text-black hover:opacity-70 no-underline py-1.5 border-b border-gray-100"
              >
                Untuk Penyedia
              </a>
              <a
                href="#/dashboard"
                onClick={() => setMenuOpen(false)}
                className="text-black hover:opacity-70 no-underline py-1.5 border-b border-gray-100"
              >
                Dampak ESG
              </a>
              <a
                href="#/terms"
                onClick={() => setMenuOpen(false)}
                className="text-black hover:opacity-70 no-underline py-1.5 border-b border-gray-100"
              >
                Standar Mutu
              </a>

              <div className="pt-4 flex flex-col gap-3 normal-case tracking-normal">
                {isAuthenticated && user ? (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#888888]">{user.name}</span>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                      className="text-xs font-semibold uppercase tracking-wider py-1.5 px-3 border border-black rounded-[3px]"
                    >
                      Keluar
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <a
                      href="#/login"
                      onClick={() => setMenuOpen(false)}
                      className="text-xs font-bold uppercase tracking-wider py-2.5 text-center flex-1 border border-black rounded-[3px] text-black no-underline"
                    >
                      Masuk
                    </a>
                    <a
                      href="#/register"
                      onClick={() => setMenuOpen(false)}
                      className="text-xs font-bold uppercase tracking-wider py-2.5 text-center flex-1 bg-black text-white rounded-[3px] no-underline"
                    >
                      Daftar Akun
                    </a>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
