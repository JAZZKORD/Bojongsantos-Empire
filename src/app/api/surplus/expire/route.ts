import { NextResponse } from 'next/server';
import { getServerStore } from '@/lib/serverStore';
import type { ApiResponse } from '@/types/api';

export async function POST(): Promise<NextResponse<ApiResponse<{ expiredCount: number }>>> {
  const store = getServerStore();
  const now = new Date().toISOString();
  let expiredCount = 0;

  store.surplusItems = store.surplusItems.map((item) => {
    if (item.status === 'active' && item.expiryTime <= now) {
      expiredCount++;
      return { ...item, status: 'expired' as const };
    }
    return item;
  });

  return NextResponse.json({
    success: true,
    message: `Pemeriksaan selesai, ${expiredCount} item diperbarui menjadi kedaluwarsa`,
    data: { expiredCount },
    timestamp: new Date().toISOString(),
  });
}
