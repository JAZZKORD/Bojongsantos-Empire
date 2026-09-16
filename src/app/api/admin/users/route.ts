import { NextResponse } from 'next/server';
import { getServerStore } from '@/lib/serverStore';
import type { ApiResponse } from '@/types/api';
import type { User } from '@/types';

export async function GET(): Promise<NextResponse<ApiResponse<User[]>>> {
  const store = getServerStore();
  // Return users without passwords
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const safeUsers = store.users.map(({ password, ...u }) => u as User);

  return NextResponse.json({
    success: true,
    data: safeUsers,
    timestamp: new Date().toISOString(),
  });
}

export async function DELETE(request: Request): Promise<NextResponse<ApiResponse<{ deletedId: string }>>> {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      {
        success: false,
        error: 'userId diperlukan',
        timestamp: new Date().toISOString(),
      },
      { status: 400 }
    );
  }

  const store = getServerStore();
  const initialLen = store.users.length;
  store.users = store.users.filter((u) => u.id !== userId);

  if (store.users.length === initialLen) {
    return NextResponse.json(
      {
        success: false,
        error: 'Pengguna tidak ditemukan',
        timestamp: new Date().toISOString(),
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Pengguna berhasil dihapus dari platform',
    data: { deletedId: userId },
    timestamp: new Date().toISOString(),
  });
}
