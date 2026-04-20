import { refreshToken } from './../../messenger/messenger-frontend/src/api/authApi';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/profile', '/dashboard', '/settings'];
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const { pathname } = request.nextUrl;

  // 1. Logic chuyển hướng cho khách (Chưa login)
  if (!refreshToken && protectedRoutes.some(route => pathname.startsWith(route))) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Logic chuyển hướng cho người dùng (Đã login)
  if (refreshToken && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  // 3. Xử lý phản hồi tiếp theo
  const response = NextResponse.next();

  // --- PHẦN QUAN TRỌNG: CHỐNG CACHE KHI NHẤN BACK/FORWARD ---
  // Header này ép trình duyệt không lưu cache trang web vào bộ nhớ tạm.
  // Nhờ đó khi nhấn Back, Middleware chắc chắn sẽ chạy lại để check token.
  response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};