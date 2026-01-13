import { ReactNode } from 'react';
import { Navbar } from '@/components/Navbar';

/**
 * CV Layout
 * 
 * Layout for CV pages (editor, analyze) with app navbar.
 */
export default function CvLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Navbar />
            <main className="pt-24 min-h-screen">
                {children}
            </main>
        </>
    );
}
