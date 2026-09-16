import { NextResponse } from 'next/server';
import { getServerStore } from '@/lib/serverStore';
import type { RegisterRequest, ApiResponse, LoginResponse } from '@/types/api';
import type { User } from '@/types';

export async function POST(request: Request): Promise<NextResponse<ApiResponse<LoginResponse>>> {
  try {
    const body: RegisterRequest = await request.json();

    if (!body.name || !body.email || !body.phone || !body.role) {
      return NextResponse.json(
        {
          success: false,
          error: 'Semua kolom wajib harus diisi (nama, email, no HP, dan peran)',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const store = getServerStore();
    const existing = store.users.find((u) => u.email.toLowerCase() === body.email.toLowerCase());
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email sudah terdaftar dalam sistem',
          timestamp: new Date().toISOString(),
        },
        { status: 409 }
      );
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: body.name,
      email: body.email,
      phone: body.phone,
      password: 'password123',
      role: body.role,
      businessName: body.businessName,
      businessAddress: body.businessAddress,
      location:
        body.lat && body.lng
          ? { lat: body.lat, lng: body.lng }
          : { lat: -6.2088, lng: 106.8456 },
      createdAt: new Date().toISOString(),
    };

    store.users.push(newUser);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = newUser;
    const token = `jwt_token_${newUser.id}_${Date.now()}`;

    return NextResponse.json(
      {
        success: true,
        message: 'Registrasi berhasil',
        data: {
          user: safeUser as User,
          token,
        },
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
