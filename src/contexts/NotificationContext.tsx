'use client';

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { NotificationType } from '@/types';

interface Toast {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
}

interface NotificationContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      const newToast: Toast = { ...toast, id };
      setToasts((prev) => [...prev, newToast]);

      // Auto-remove after duration
      const duration = toast.duration || 4000;
      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  const success = useCallback(
    (title: string, message = '') => addToast({ type: 'success', title, message }),
    [addToast]
  );
  const error = useCallback(
    (title: string, message = '') => addToast({ type: 'error', title, message }),
    [addToast]
  );
  const warning = useCallback(
    (title: string, message = '') => addToast({ type: 'warning', title, message }),
    [addToast]
  );
  const info = useCallback(
    (title: string, message = '') => addToast({ type: 'info', title, message }),
    [addToast]
  );

  return (
    <NotificationContext.Provider
      value={{ toasts, addToast, removeToast, success, error, warning, info }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
