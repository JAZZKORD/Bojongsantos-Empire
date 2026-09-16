import { NextResponse } from 'next/server';
import { getServerStore } from '@/lib/serverStore';
import type { ApiResponse } from '@/types/api';
import type { User } from '@/types';

export async function GET(request: Request): Promise<NextResponse<ApiResponse<User>>> {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      {
        success: false,
        error: 'Parameter userId wajib disertakan',
        timestamp: new Date().toISOString(),
      },
      { status: 400 }
    );
  }

  const store = getServerStore();
  const user = store.users.find((u) => u.id === userId);

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        error: 'Pengguna tidak ditemukan',
        timestamp: new Date().toISOString(),
      },
      { status: 404 }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...safeUser } = user;
  return NextResponse.json({
    success: true,
    data: safeUser as User,
    timestamp: new Date().toISOString(),
  });
}
