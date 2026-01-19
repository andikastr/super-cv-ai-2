import { ReactNode } from 'react';

/**
 * Auth Layout
 * 
 * Clean layout for auth pages (login, register) without navbar.
 * Auth pages have their own branding on the left panel.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <main className="min-h-screen">
            {children}
        </main>
    );
}
