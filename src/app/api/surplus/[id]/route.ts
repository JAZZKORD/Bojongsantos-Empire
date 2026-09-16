import { NextResponse } from 'next/server';
import { getServerStore } from '@/lib/serverStore';
import type { ApiResponse } from '@/types/api';
import type { SurplusItem } from '@/types';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<SurplusItem>>> {
  const { id } = await params;
  const store = getServerStore();
  const item = store.surplusItems.find((i) => i.id === id);

  if (!item) {
    return NextResponse.json(
      {
        success: false,
        error: 'Surplus item tidak ditemukan',
        timestamp: new Date().toISOString(),
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: item,
    timestamp: new Date().toISOString(),
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<SurplusItem>>> {
  const { id } = await params;
  const updates: Partial<SurplusItem> = await request.json();
  const store = getServerStore();
  const idx = store.surplusItems.findIndex((i) => i.id === id);

  if (idx === -1) {
    return NextResponse.json(
      {
        success: false,
        error: 'Item tidak ditemukan',
        timestamp: new Date().toISOString(),
      },
      { status: 404 }
    );
  }

  store.surplusItems[idx] = { ...store.surplusItems[idx], ...updates };

  return NextResponse.json({
    success: true,
    message: 'Data surplus berhasil diperbarui',
    data: store.surplusItems[idx],
    timestamp: new Date().toISOString(),
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<{ deletedId: string }>>> {
  const { id } = await params;
  const store = getServerStore();
  const initialLen = store.surplusItems.length;
  store.surplusItems = store.surplusItems.filter((i) => i.id !== id);

  if (store.surplusItems.length === initialLen) {
    return NextResponse.json(
      {
        success: false,
        error: 'Item tidak ditemukan untuk dihapus',
        timestamp: new Date().toISOString(),
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Item surplus berhasil dihapus',
    data: { deletedId: id },
    timestamp: new Date().toISOString(),
  });
}
