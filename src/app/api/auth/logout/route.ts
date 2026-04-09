import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  
  // Xóa cookie của Next.js (Dọn dẹp cho Middleware)
  cookieStore.delete('refreshTokenNextjs');

  // Trả về phản hồi thành công
  return NextResponse.json({ message: 'Nextjs cookie cleared' });
}