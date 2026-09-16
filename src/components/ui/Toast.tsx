'use client';

import { useNotification } from '@/contexts/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: { bg: 'var(--color-success-light)', border: 'var(--color-success)', text: '#166534', progress: 'var(--color-success)' },
  error: { bg: 'var(--color-error-light)', border: 'var(--color-error)', text: '#991b1b', progress: 'var(--color-error)' },
  warning: { bg: 'var(--color-warning-light)', border: 'var(--color-warning)', text: '#92400e', progress: 'var(--color-warning)' },
  info: { bg: 'var(--color-info-light)', border: 'var(--color-info)', text: '#1e40af', progress: 'var(--color-info)' },
};

export function ToastContainer() {
  const { toasts, removeToast } = useNotification();

  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = iconMap[toast.type];
          const colors = colorMap[toast.type];

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                backgroundColor: colors.bg,
                borderLeft: `4px solid ${colors.border}`,
                borderRadius: 'var(--radius-cards)',
                overflow: 'hidden',
              }}
            >
              <div className="flex items-start gap-3 p-4">
                <Icon size={20} style={{ color: colors.border, flexShrink: 0, marginTop: 1 }} />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm" style={{ color: colors.text, letterSpacing: '-0.5px' }}>
                    {toast.title}
                  </div>
                  {toast.message && (
                    <div className="text-xs mt-1" style={{ color: colors.text, opacity: 0.8 }}>
                      {toast.message}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                >
                  <X size={16} style={{ color: colors.text }} />
                </button>
              </div>
              <div className="toast-progress" style={{ backgroundColor: colors.border }} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
