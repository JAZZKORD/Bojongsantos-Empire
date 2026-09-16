// ============================================================
// AksesPangan — Booking & Distribution Microservice Client
// ============================================================

import { requestApi } from './apiClient';
import type { CreateBookingRequest, UpdateBookingStatusRequest } from '@/types/api';
import type { Booking, BookingStatus } from '@/types';
import * as localData from '@/lib/data';

export const bookingService = {
  async getByRecipient(recipientId: string): Promise<Booking[]> {
    try {
      return await requestApi<Booking[]>(`/api/bookings?recipientId=${encodeURIComponent(recipientId)}`);
    } catch {
      return localData.getBookingsByRecipient(recipientId);
    }
  },

  async getByProvider(providerId: string): Promise<Booking[]> {
    try {
      return await requestApi<Booking[]>(`/api/bookings?providerId=${encodeURIComponent(providerId)}`);
    } catch {
      return localData.getBookingsByProvider(providerId);
    }
  },

  async create(data: CreateBookingRequest): Promise<Booking> {
    try {
      const booking = await requestApi<Booking>('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return booking;
    } catch {
      const surplus = localData.getSurplusById(data.surplusId);
      if (!surplus) throw new Error('Item surplus tidak ditemukan');

      return localData.createBooking({
        surplusId: data.surplusId,
        surplusName: surplus.name,
        surplusPhoto: surplus.photo,
        providerId: surplus.providerId,
        providerBusinessName: surplus.providerBusinessName,
        recipientId: data.recipientId,
        recipientName: data.recipientName,
        recipientPhone: data.recipientPhone,
        quantity: data.quantity,
        pickupDeadline: new Date(Date.now() + 2 * 3600000).toISOString(),
        pickupLocation: surplus.location,
        pickupAddress: surplus.address,
      });
    }
  },

  async updateStatus(bookingId: string, status: BookingStatus): Promise<Booking> {
    try {
      const body: UpdateBookingStatusRequest = { status };
      const booking = await requestApi<Booking>(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
      localData.updateBookingStatus(bookingId, status);
      return booking;
    } catch {
      const res = localData.updateBookingStatus(bookingId, status);
      if (!res) throw new Error('Gagal memperbarui status booking');
      return res;
    }
  },
};
