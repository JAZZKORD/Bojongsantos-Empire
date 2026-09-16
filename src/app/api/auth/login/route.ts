import { NextResponse } from 'next/server';
import { getServerStore } from '@/lib/serverStore';
import type { LoginRequest, ApiResponse, LoginResponse } from '@/types/api';

export async function POST(request: Request): Promise<NextResponse<ApiResponse<LoginResponse>>> {
  try {
    const body: LoginRequest = await request.json();
    if (!body.email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email harus diisi',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const store = getServerStore();
    const user = store.users.find((u) => u.email.toLowerCase() === body.email.toLowerCase());

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Pengguna dengan email ini tidak ditemukan',
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    if (body.password && user.password !== body.password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Kata sandi tidak sesuai',
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    // Return sanitized user profile and simulated JWT token
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    const token = `jwt_token_${user.id}_${Date.now()}`;

    return NextResponse.json({
      success: true,
      message: 'Autentikasi berhasil',
      data: {
        user: safeUser as typeof user,
        token,
      },
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
