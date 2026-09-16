'use client';

import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  MapPin,
  ShoppingBag,
  BarChart3,
  Users,
  Receipt,
  FileText,
} from 'lucide-react';
import { NAV_ITEMS } from '@/lib/constants';

const iconComponents: Record<string, React.ComponentType<{ size?: number }>> = {
  LayoutDashboard,
  Package,
  ClipboardList,
  MapPin,
  ShoppingBag,
  BarChart3,
  Users,
  Receipt,
  FileText,
};

export function BottomNav() {
  const { user } = useAuth();
  if (!user) return null;

  const roleItems = NAV_ITEMS[user.role as keyof typeof NAV_ITEMS] || [];
  const items = [...roleItems, ...NAV_ITEMS.shared.slice(0, 1)];
  const visibleItems = items.slice(0, 5);

  return (
    <motion.div
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden frosted-glass-light border-t border-[rgba(0,0,0,0.08)] py-1.5 px-3"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {visibleItems.map((item) => {
          const hash = `#${item.href}`;
          const isActive =
            typeof window !== 'undefined' &&
            (window.location.hash === hash || window.location.hash.startsWith(hash));
          const Icon = iconComponents[item.icon] || LayoutDashboard;

          return (
            <a
              key={item.href}
              href={hash}
              className="flex flex-col items-center gap-1 py-1 px-2 no-underline relative transition-transform active:scale-95"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  isActive ? 'bg-[#0066cc] text-white' : 'text-[#86868b]'
                }`}
              >
                <Icon size={18} />
              </div>
              <span
                className={`text-[11px] font-medium tracking-tight ${
                  isActive ? 'text-[#0066cc] font-semibold' : 'text-[#86868b]'
                }`}
              >
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </motion.div>
  );
}
