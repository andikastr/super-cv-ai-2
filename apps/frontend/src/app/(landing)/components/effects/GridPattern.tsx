'use client';

import { motion } from 'framer-motion';

/**
 * GridPattern Component
 * 
 * Subtle animated grid pattern for tech feel.
 */
export function GridPattern() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `
            linear-gradient(to right, #2F6BFF 1px, transparent 1px),
            linear-gradient(to bottom, #2F6BFF 1px, transparent 1px)
          `,
                    backgroundSize: '60px 60px',
                }}
            />
            {/* Gradient fade */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
        </div>
    );
}
