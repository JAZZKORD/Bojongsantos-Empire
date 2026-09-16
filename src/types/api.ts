// ============================================================
// AksesPangan — Microservice API Contracts & Types
// ============================================================

import type { User, SurplusItem, Booking, ImpactData, ImpactTimeline, FoodCategory, BookingStatus } from './index';

// Generic standard API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  timestamp: string;
}

// Auth Microservice Types
export interface LoginRequest {
  email: string;
  password?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  role: 'penyedia' | 'penerima';
  businessName?: string;
  businessAddress?: string;
  businessType?: string;
  lat?: number;
  lng?: number;
}

// Surplus Microservice Types
export interface CreateSurplusRequest {
  name: string;
  description: string;
  quantity: number;
  portionCount: number;
  foodCategory: FoodCategory;
  price: number;
  isFree: boolean;
  productionTime: string;
  expiryTime: string;
  address: string;
  lat: number;
  lng: number;
  providerId: string;
  providerName: string;
  providerBusinessName: string;
  photo?: string;
}

export interface SurplusFilterQuery {
  category?: FoodCategory | 'all';
  maxDistance?: number;
  userLat?: number;
  userLng?: number;
  search?: string;
  priceRange?: 'all' | 'free' | 'paid';
}

// Booking Microservice Types
export interface CreateBookingRequest {
  surplusId: string;
  quantity: number;
  recipientId: string;
  recipientName: string;
  recipientPhone: string;
}

export interface UpdateBookingStatusRequest {
  status: BookingStatus;
  notes?: string;
}

// System Health Microservice Type
export interface ServiceHealth {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  uptimeSeconds: number;
  timestamp: string;
}
