import { NextResponse } from 'next/server';
import { getServerStore } from '@/lib/serverStore';
import type { ApiResponse } from '@/types/api';
import type { Notification } from '@/types';

export async function GET(request: Request): Promise<NextResponse<ApiResponse<Notification[]>>> {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  const store = getServerStore();
  let notifications = store.notifications;

  if (userId) {
    notifications = notifications.filter((n) => n.userId === userId);
  }

  return NextResponse.json({
    success: true,
    data: notifications,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: Request): Promise<NextResponse<ApiResponse<Notification>>> {
  try {
    const body = await request.json();
    const store = getServerStore();

    const notif: Notification = {
      id: `notif-${Date.now()}`,
      userId: body.userId,
      title: body.title,
      message: body.message,
      type: body.type || 'info',
      read: false,
      createdAt: new Date().toISOString(),
    };

    store.notifications.unshift(notif);

    return NextResponse.json(
      {
        success: true,
        data: notif,
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
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
