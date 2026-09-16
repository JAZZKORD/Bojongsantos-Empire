import { NextResponse } from 'next/server';
import type { ApiResponse } from '@/types/api';
import type { ImpactTimeline } from '@/types';
import { CO2E_FACTOR } from '@/lib/constants';

export async function GET(): Promise<NextResponse<ApiResponse<ImpactTimeline[]>>> {
  const dates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    dates.push(
      d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
      })
    );
  }

  const baseKg = [18, 24, 15, 32, 28, 35, 42];
  const baseTrx = [4, 6, 3, 8, 7, 9, 11];

  const timeline: ImpactTimeline[] = dates.map((date, i) => ({
    date,
    kgSaved: baseKg[i],
    transactions: baseTrx[i],
    co2eSaved: Math.round(baseKg[i] * CO2E_FACTOR * 10) / 10,
  }));

  return NextResponse.json({
    success: true,
    data: timeline,
    timestamp: new Date().toISOString(),
  });
}
