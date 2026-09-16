'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User, UserRole } from '@/types';
import * as db from '@/lib/data';

import { authService } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize seed data and check for existing session
    db.seedData();
    const currentUser = db.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await authService.login({ email, password });
      setUser(res.user);
      return { success: true };
    } catch (err: any) {
      const result = db.login(email, password);
      if (result.success && result.user) {
        setUser(result.user);
        return { success: true };
      }
      return { success: false, error: err.message || result.error || 'Login gagal' };
    }
  }, []);

  const register = useCallback(async (userData: Omit<User, 'id' | 'createdAt'>) => {
    try {
      const res = await authService.register({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role === 'admin' ? 'penyedia' : userData.role,
        businessName: userData.businessName,
        businessAddress: userData.businessAddress,
        businessType: userData.businessType,
        lat: userData.location?.lat,
        lng: userData.location?.lng,
      });
      setUser(res.user);
      return { success: true, user: res.user };
    } catch (err: any) {
      const existing = db.getUserByEmail(userData.email);
      if (existing) {
        return { success: false, error: 'Email sudah terdaftar' };
      }
      const newUser = db.createUser(userData);
      db.setCurrentUser(newUser);
      setUser(newUser);
      return { success: true, user: newUser };
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback((updates: Partial<User>) => {
    if (!user) return;
    const updated = db.updateUser(user.id, updates);
    if (updated) {
      setUser(updated);
      db.setCurrentUser(updated);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useRequireAuth(requiredRole?: UserRole): AuthContextType {
  const auth = useAuth();
  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      window.location.hash = '#/login';
    }
    if (requiredRole && auth.user && auth.user.role !== requiredRole) {
      window.location.hash = '#/';
    }
  }, [auth.isLoading, auth.isAuthenticated, auth.user, requiredRole]);
  return auth;
}
