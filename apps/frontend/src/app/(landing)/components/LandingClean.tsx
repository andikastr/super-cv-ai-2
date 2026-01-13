'use client';

import { Navbar } from '@/components/Navbar';
import { HeroClean } from './HeroClean';
import { Features3D } from './Features3D';
import { AIEngine } from './AIEngine';
import { CTA3D } from './CTA3D';

/**
 * LandingClean Component
 * 
 * Clean landing page with CSS animations instead of Three.js.
 * Performance-optimized for 60fps on all devices.
 */
export default function LandingClean() {
    return (
        <>
            {/* Navbar */}
            <Navbar />

            <main>
                {/* Hero with floating CV */}
                <HeroClean />

                {/* Features */}
                <Features3D />

                {/* AI Engine workflow */}
                <AIEngine />

                {/* Call to Action */}
                <CTA3D />
            </main>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-slate-100">
                <div className="container mx-auto text-center">
                    <p className="text-slate-500 text-sm">
                        © 2026 Super CV. Powered by AI.
                    </p>
                </div>
            </footer>
        </>
    );
}
