import { NextResponse } from 'next/server';
import { getServerStore } from '@/lib/serverStore';
import type { ApiResponse, CreateBookingRequest } from '@/types/api';
import type { Booking } from '@/types';

export async function GET(request: Request): Promise<NextResponse<ApiResponse<Booking[]>>> {
  const { searchParams } = new URL(request.url);
  const recipientId = searchParams.get('recipientId');
  const providerId = searchParams.get('providerId');

  const store = getServerStore();
  let bookings = store.bookings;

  if (recipientId) {
    bookings = bookings.filter((b) => b.recipientId === recipientId);
  } else if (providerId) {
    bookings = bookings.filter((b) => b.providerId === providerId);
  }

  return NextResponse.json({
    success: true,
    data: bookings,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: Request): Promise<NextResponse<ApiResponse<Booking>>> {
  try {
    const body: CreateBookingRequest = await request.json();
    const store = getServerStore();

    const surplus = store.surplusItems.find((s) => s.id === body.surplusId);
    if (!surplus) {
      return NextResponse.json(
        {
          success: false,
          error: 'Item surplus makanan tidak ditemukan',
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    if (surplus.status !== 'active') {
      return NextResponse.json(
        {
          success: false,
          error: 'Item surplus ini sudah tidak aktif atau sudah dibooking',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const bookingQty = body.quantity || surplus.quantity;
    const deadline = new Date(Math.min(Date.now() + 2 * 3600000, new Date(surplus.expiryTime).getTime())).toISOString();

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      surplusId: surplus.id,
      surplusName: surplus.name,
      surplusPhoto: surplus.photo,
      providerId: surplus.providerId,
      providerBusinessName: surplus.providerBusinessName,
      recipientId: body.recipientId,
      recipientName: body.recipientName,
      recipientPhone: body.recipientPhone || '08123456789',
      quantity: bookingQty,
      status: 'menunggu',
      bookedAt: new Date().toISOString(),
      pickupDeadline: deadline,
      pickupLocation: surplus.location,
      pickupAddress: surplus.address,
    };

    // Update surplus item status
    surplus.status = 'booked';
    store.bookings.unshift(newBooking);

    return NextResponse.json(
      {
        success: true,
        message: 'Booking berhasil dibuat. Silakan ambil sebelum batas waktu.',
        data: newBooking,
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
