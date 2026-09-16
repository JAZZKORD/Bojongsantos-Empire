// ============================================================
// AksesPangan — Auth & Identity Microservice Client
// ============================================================

import { requestApi } from './apiClient';
import type { LoginRequest, LoginResponse, RegisterRequest } from '@/types/api';
import type { User } from '@/types';
import * as localData from '@/lib/data';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const res = await requestApi<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      // Synchronize with local storage for offline resilience
      localData.setCurrentUser(res.user);
      return res;
    } catch {
      // Offline fallback
      const localRes = localData.login(credentials.email, credentials.password || '');
      if (!localRes.success || !localRes.user) {
        throw new Error(localRes.error || 'Login gagal');
      }
      return {
        user: localRes.user,
        token: `local_token_${Date.now()}`,
      };
    }
  },

  async register(data: RegisterRequest): Promise<LoginResponse> {
    try {
      const res = await requestApi<LoginResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      localData.setCurrentUser(res.user);
      return res;
    } catch {
      // Offline fallback
      const newUser = localData.createUser({
        name: data.name,
        email: data.email,
        password: 'password123',
        role: data.role,
        phone: data.phone,
        businessName: data.businessName,
        businessAddress: data.businessAddress,
        businessType: (data.businessType as any) || 'lainnya',
        location: data.lat && data.lng ? { lat: data.lat, lng: data.lng } : undefined,
      });
      localData.setCurrentUser(newUser);
      return {
        user: newUser,
        token: `local_token_${Date.now()}`,
      };
    }
  },

  async getProfile(userId: string): Promise<User> {
    try {
      return await requestApi<User>(`/api/auth/me?userId=${encodeURIComponent(userId)}`);
    } catch {
      const user = localData.getUserById(userId);
      if (!user) throw new Error('Pengguna tidak ditemukan');
      return user;
    }
  },

  logout(): void {
    localData.logout();
  },
};
