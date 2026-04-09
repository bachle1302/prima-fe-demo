// app/api/auth/token/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { refreshToken } = body;

  if (!refreshToken) {
    return NextResponse.json({ message: 'Missing token' }, { status: 400 });
  }

  const response = NextResponse.json({ success: true });

  // Tự set cookie cho domain hiện tại (localhost hoặc domain FE sau này)
  const cookieStore = await cookies();
  cookieStore.set('refreshTokenNextjs', refreshToken, {
    httpOnly: true,    // Middleware đọc được, nhưng JS client thì không
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',   // Quan trọng: Cùng domain nên để Lax là chạy mượt nhất
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 ngày
  });

  return response;
}