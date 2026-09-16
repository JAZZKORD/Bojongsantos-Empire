import { NextResponse } from 'next/server';
import { getServerStore } from '@/lib/serverStore';
import type { ApiResponse } from '@/types/api';
import type { Booking } from '@/types';

export async function GET(): Promise<NextResponse<ApiResponse<Booking[]>>> {
  const store = getServerStore();
  return NextResponse.json({
    success: true,
    data: store.bookings,
    timestamp: new Date().toISOString(),
  });
}
