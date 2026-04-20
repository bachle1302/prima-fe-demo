import { ModeToggle } from '@/components/ui/toggledarkmode';
import Link from 'next/link';

export default function Home() {
    return (
        <main className='min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-6 px-4 py-10'>
            <div className='text-center space-y-4'>
                <h1 className='text-4xl font-bold text-amber-300'>
                    Welcome to My Project
                </h1>
                <p className='max-w-xl text-slate-300'>
                    Trang FE đã sẵn sàng, bạn có thể đăng nhập và tạo comic với
                    ảnh upload lên Cloudinary.
                </p>
            </div>

            <div className='flex flex-col sm:flex-row gap-3'>
                <Link
                    href='/login'
                    className='rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition'
                >
                    Đăng nhập
                </Link>
                <Link
                    href='/upload'
                    className='rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition'
                >
                    Tạo comic mới
                </Link>
                <Link
                    href='/comic'
                    className='rounded-lg bg-slate-700 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition'
                >
                    Xem danh sách comic
                </Link>
            </div>

            <ModeToggle />
        </main>
    );
}
