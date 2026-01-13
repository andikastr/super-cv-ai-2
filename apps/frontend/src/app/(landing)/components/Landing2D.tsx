'use client';

import { StaticHero } from './2D/StaticHero';
import { Features2D } from './2D/Features2D';
import { SimpleCTA } from './2D/SimpleCTA';

/**
 * Landing2D Component
 * 
 * Complete 2D fallback landing page for mobile/low-power devices.
 * This component is loaded when canUse3D() returns false.
 * 
 * Bundle Optimization:
 * - No Three.js imports
 * - CSS-only animations
 * - Minimal JavaScript
 * - Target bundle size: < 250KB gzipped
 */
export default function Landing2D() {
    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <StaticHero />

            {/* Features Section */}
            <Features2D />

            {/* CTA Section */}
            <SimpleCTA />
        </main>
    );
}
