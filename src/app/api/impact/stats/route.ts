import { NextResponse } from 'next/server';
import { calculateServerImpact } from '@/lib/serverStore';
import type { ApiResponse } from '@/types/api';
import type { ImpactData } from '@/types';

export async function GET(): Promise<NextResponse<ApiResponse<ImpactData>>> {
  try {
    const impact = calculateServerImpact();
    return NextResponse.json({
      success: true,
      data: impact,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Internal Server Error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
