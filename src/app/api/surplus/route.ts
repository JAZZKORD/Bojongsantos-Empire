import { NextResponse } from 'next/server';
import { getServerStore } from '@/lib/serverStore';
import type { ApiResponse, CreateSurplusRequest } from '@/types/api';
import type { SurplusItem } from '@/types';

export async function GET(request: Request): Promise<NextResponse<ApiResponse<SurplusItem[]>>> {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const priceFilter = searchParams.get('priceFilter');
    const providerId = searchParams.get('providerId');

    const store = getServerStore();
    const now = new Date().toISOString();

    let items = store.surplusItems;

    if (providerId) {
      items = items.filter((i) => i.providerId === providerId);
    } else {
      // For general feed, only return active and non-expired items
      items = items.filter((i) => i.status === 'active' && i.expiryTime > now);
    }

    if (category && category !== 'all') {
      items = items.filter((i) => i.foodCategory === category);
    }

    if (search) {
      const q = search.toLowerCase();
      items = items.filter((i) => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
    }

    if (priceFilter === 'free') {
      items = items.filter((i) => i.isFree);
    } else if (priceFilter === 'paid') {
      items = items.filter((i) => !i.isFree);
    }

    return NextResponse.json({
      success: true,
      data: items,
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

export async function POST(request: Request): Promise<NextResponse<ApiResponse<SurplusItem>>> {
  try {
    const body: CreateSurplusRequest = await request.json();

    if (!body.name || !body.quantity || !body.expiryTime || !body.providerId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Nama, kuantitas, waktu kedaluwarsa, dan identitas penyedia wajib diisi',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const newItem: SurplusItem = {
      id: `surplus-${Date.now()}`,
      providerId: body.providerId,
      providerName: body.providerName || 'Penyedia',
      providerBusinessName: body.providerBusinessName || 'Usaha Makanan',
      name: body.name,
      description: body.description || '',
      photo: body.photo || '',
      quantity: Number(body.quantity),
      portionCount: Number(body.portionCount) || Math.round(Number(body.quantity) * 2),
      productionTime: body.productionTime || new Date().toISOString(),
      expiryTime: body.expiryTime,
      status: 'active',
      price: Number(body.price) || 0,
      isFree: body.isFree ?? (Number(body.price) === 0),
      foodCategory: body.foodCategory || 'lainnya',
      location: { lat: Number(body.lat) || -6.2088, lng: Number(body.lng) || 106.8456 },
      address: body.address || 'Jakarta',
      createdAt: new Date().toISOString(),
    };

    const store = getServerStore();
    store.surplusItems.unshift(newItem);

    return NextResponse.json(
      {
        success: true,
        message: 'Surplus makanan berhasil dipublikasikan',
        data: newItem,
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
