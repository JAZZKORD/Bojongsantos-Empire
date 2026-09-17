'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { ToastContainer } from '@/components/ui/Toast';
import { Navbar } from '@/components/layout/Navbar';
import { BottomNav } from '@/components/layout/BottomNav';
import { LandingPage } from '@/components/pages/LandingPage';
import { LoginPage } from '@/components/pages/LoginPage';
import { RegisterPage } from '@/components/pages/RegisterPage';
import { PenyediaDashboard } from '@/components/pages/PenyediaDashboard';
import { PenyediaSurplus } from '@/components/pages/PenyediaSurplus';
import { PenyediaBooking } from '@/components/pages/PenyediaBooking';
import { PenyediaHistory } from '@/components/pages/PenyediaHistory';
import { PenerimaDashboard } from '@/components/pages/PenerimaDashboard';
import { PenerimaBooking } from '@/components/pages/PenerimaBooking';
import { PenerimaHistory } from '@/components/pages/PenerimaHistory';
import { ImpactDashboard } from '@/components/pages/ImpactDashboard';
import { AdminDashboard } from '@/components/pages/AdminDashboard';
import { TermsPage } from '@/components/pages/TermsPage';
import { checkAndExpireItems } from '@/lib/data';

function AppRouter() {
  const [route, setRoute] = useState('/');
  const { user, isAuthenticated, isLoading } = useAuth();

  // Hash-based routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      setRoute(hash);
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Periodically check for expired items
  useEffect(() => {
    const interval = setInterval(() => {
      checkAndExpireItems();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-canvas-parchment)' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-4xl mb-3">🍽️</div>
          <div className="text-display-md font-semibold text-[#1d1d1f]">AksesPangan</div>
          <div className="mt-2 text-caption-apple text-[#86868b]">Memuat ekosistem penyelamatan pangan...</div>
        </motion.div>
      </div>
    );
  }

  // Show Apple 2-row navigation across app, except clean full-screen auth pages
  const isAuthPage = ['/login', '/register'].includes(route);
  const showNav = !isAuthPage;
  const showMobileDock = isAuthenticated && !isAuthPage;

  const renderPage = () => {
    switch (route) {
      case '/':
        return <LandingPage />;
      case '/login':
        return <LoginPage />;
      case '/register':
        return <RegisterPage />;
      case '/penyedia':
        return <PenyediaDashboard />;
      case '/penyedia/surplus':
        return <PenyediaSurplus />;
      case '/penyedia/booking':
        return <PenyediaBooking />;
      case '/penyedia/history':
        return <PenyediaHistory />;
      case '/penerima':
        return <PenerimaDashboard />;
      case '/penerima/booking':
        return <PenerimaBooking />;
      case '/penerima/history':
        return <PenerimaHistory />;
      case '/dashboard':
        return <ImpactDashboard />;
      case '/admin':
        return <AdminDashboard />;
      case '/terms':
        return <TermsPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen text-[#1d1d1f] antialiased bg-white selection:bg-[#1d1d1f] selection:text-white">
      {showNav && <Navbar currentRoute={route} />}
      <AnimatePresence mode="wait">
        <motion.main
          key={route}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={`w-full ${showMobileDock ? 'pb-24 md:pb-0' : ''}`}
          style={{ paddingTop: showNav ? '68px' : '0' }}
        >
          {renderPage()}
        </motion.main>
      </AnimatePresence>
      {showMobileDock && <BottomNav />}
      <ToastContainer />
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppRouter />
      </NotificationProvider>
    </AuthProvider>
  );
}
