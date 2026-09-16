// ============================================================
// AksesPangan — Surplus Inventory Microservice Client
// ============================================================

import { requestApi } from './apiClient';
import type { CreateSurplusRequest, SurplusFilterQuery } from '@/types/api';
import type { SurplusItem } from '@/types';
import * as localData from '@/lib/data';

export const surplusService = {
  async getAll(filter?: SurplusFilterQuery): Promise<SurplusItem[]> {
    try {
      const params = new URLSearchParams();
      if (filter?.category && filter.category !== 'all') params.set('category', filter.category);
      if (filter?.search) params.set('search', filter.search);
      if (filter?.priceRange && filter.priceRange !== 'all') params.set('priceFilter', filter.priceRange);

      const qs = params.toString() ? `?${params.toString()}` : '';
      return await requestApi<SurplusItem[]>(`/api/surplus${qs}`);
    } catch {
      return localData.getActiveSurplus();
    }
  },

  async getByProvider(providerId: string): Promise<SurplusItem[]> {
    try {
      return await requestApi<SurplusItem[]>(`/api/surplus?providerId=${encodeURIComponent(providerId)}`);
    } catch {
      return localData.getSurplusByProvider(providerId);
    }
  },

  async getById(id: string): Promise<SurplusItem> {
    try {
      return await requestApi<SurplusItem>(`/api/surplus/${id}`);
    } catch {
      const item = localData.getSurplusById(id);
      if (!item) throw new Error('Item tidak ditemukan');
      return item;
    }
  },

  async create(data: CreateSurplusRequest): Promise<SurplusItem> {
    try {
      const item = await requestApi<SurplusItem>('/api/surplus', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      // Also cache in local store
      localData.createSurplus({
        providerId: data.providerId,
        providerName: data.providerName,
        providerBusinessName: data.providerBusinessName,
        name: data.name,
        description: data.description,
        photo: data.photo || '',
        quantity: data.quantity,
        portionCount: data.portionCount,
        productionTime: data.productionTime,
        expiryTime: data.expiryTime,
        price: data.price,
        isFree: data.isFree,
        foodCategory: data.foodCategory,
        location: { lat: data.lat, lng: data.lng },
        address: data.address,
      });
      return item;
    } catch {
      return localData.createSurplus({
        providerId: data.providerId,
        providerName: data.providerName,
        providerBusinessName: data.providerBusinessName,
        name: data.name,
        description: data.description,
        photo: data.photo || '',
        quantity: data.quantity,
        portionCount: data.portionCount,
        productionTime: data.productionTime,
        expiryTime: data.expiryTime,
        price: data.price,
        isFree: data.isFree,
        foodCategory: data.foodCategory,
        location: { lat: data.lat, lng: data.lng },
        address: data.address,
      });
    }
  },

  async update(id: string, updates: Partial<SurplusItem>): Promise<SurplusItem> {
    try {
      const item = await requestApi<SurplusItem>(`/api/surplus/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      localData.updateSurplus(id, updates);
      return item;
    } catch {
      const res = localData.updateSurplus(id, updates);
      if (!res) throw new Error('Gagal memperbarui item');
      return res;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await requestApi<{ deletedId: string }>(`/api/surplus/${id}`, {
        method: 'DELETE',
      });
    } catch {
      // offline fallback
    }
    localData.deleteSurplus(id);
  },

  async triggerExpirationCheck(): Promise<number> {
    try {
      const res = await requestApi<{ expiredCount: number }>('/api/surplus/expire', {
        method: 'POST',
      });
      localData.checkAndExpireItems();
      return res.expiredCount;
    } catch {
      localData.checkAndExpireItems();
      return 0;
    }
  },
};
