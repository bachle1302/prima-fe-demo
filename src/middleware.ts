import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Danh sách các route cần bảo vệ (phải login mới vào được)
const protectedRoutes = ['/profile', '/dashboard', '/settings'];

// Danh sách các route dành cho khách (đã login rồi thì không cho vào lại)
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  // 1. Lấy token từ Cookie mà Next.js Server đã set
  const refreshToken = request.cookies.get('refreshTokenNextjs')?.value;
  const { pathname } = request.nextUrl;

  console.log(`--- Middleware Check: ${pathname} | Token: ${refreshToken ? 'YES' : 'NO'}`);

  // 2. Nếu người dùng chưa login mà cố tình vào các trang bảo mật
  if (!refreshToken && protectedRoutes.some(route => pathname.startsWith(route))) {
    const loginUrl = new URL('/login', request.url);
    // Lưu lại trang cũ để sau khi login xong có thể quay lại (tùy chọn)
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Nếu người dùng ĐÃ login mà lại cố vào trang Login/Register
  if (refreshToken && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

// 4. Cấu hình Matcher để Middleware không chạy lăng nhăng vào file tĩnh
export const config = {
  matcher: [
    /*
     * Khớp tất cả các đường dẫn trừ:
     * - api (các route API nội bộ)
     * - _next/static (file tĩnh như CSS, JS)
     * - _next/image (tối ưu hình ảnh)
     * - favicon.ico (icon trình duyệt)
     * - các file ảnh .png, .jpg, .svg...
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};