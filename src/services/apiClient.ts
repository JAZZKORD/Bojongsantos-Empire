// ============================================================
// AksesPangan — Typed Microservices Client & Resilient Fetcher
// ============================================================

import type { ApiResponse } from '@/types/api';

export class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

export async function requestApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : endpoint;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  const json: ApiResponse<T> = await res.json();

  if (!res.ok || !json.success) {
    throw new ApiError(json.error || json.message || 'Request failed', res.status);
  }

  return json.data as T;
}
