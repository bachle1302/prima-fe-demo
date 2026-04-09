'use client';
import { getMe } from '@/auth/auth.service';
import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
interface User {
    id: number;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const pathname = usePathname();
    const [loading, setLoading] = useState(pathname !== "/login");

useEffect(() => {
    if (pathname === "/login" || pathname === "/" || pathname === "/register") return;

    setLoading(true); // Bắt đầu gọi API thì mới set loading
    getMe()
        .then(setUser)
        .finally(() => setLoading(false));
}, [pathname]);

    return (
        <AuthContext.Provider value={{ user, loading, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext)!;
};
