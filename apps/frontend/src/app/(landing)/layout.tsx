import { ReactNode } from 'react';
import type { Metadata } from 'next';

/**
 * Metadata for landing page
 */
export const metadata: Metadata = {
    title: 'Super CV - AI-Powered Resume Optimization',
    description: 'Transform your resume into an ATS-optimized masterpiece. Get hired 3× faster with AI-powered insights.',
    keywords: ['resume', 'cv', 'ats', 'ai', 'optimization', 'career'],
};

/**
 * Landing Layout
 * 
 * Layout for the 3D landing page with preload hints.
 */
export default function LandingLayout({ children }: { children: ReactNode }) {
    return (
        <>
            {/* Preload critical resources */}
            <link
                rel="preload"
                href="/_next/static/chunks/three-vendor.js"
                as="script"
            />

            {/* Main content */}
            {children}
        </>
    );
}
