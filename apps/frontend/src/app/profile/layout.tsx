import { ReactNode } from 'react';
import { Navbar } from '@/components/Navbar';

/**
 * Profile Layout
 * 
 * Layout for profile page with app navbar.
 */
export default function ProfileLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Navbar />
            <main className="pt-24 min-h-screen">
                {children}
            </main>
        </>
    );
}
