import { ReactNode } from 'react';
import { Navbar } from '@/components/Navbar';

/**
 * Auth Layout
 * 
 * Layout for auth pages (login, register) with app navbar.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Navbar />
            <main className="pt-24 min-h-screen">
                {children}
            </main>
        </>
    );
}
