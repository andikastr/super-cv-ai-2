'use client';

import { motion } from 'framer-motion';

/**
 * GlowOrbs Component
 * 
 * Large glowing orbs that add depth and visual interest.
 */
export function GlowOrbs() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Main blue orb */}
            <motion.div
                animate={{
                    x: [0, 50, 0],
                    y: [0, -30, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-[#2F6BFF]/20 rounded-full blur-[100px]"
            />

            {/* Green orb */}
            <motion.div
                animate={{
                    x: [0, -40, 0],
                    y: [0, 40, 0],
                    scale: [1, 1.15, 1],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="absolute top-1/3 -right-32 w-[400px] h-[400px] bg-[#3CE0B1]/15 rounded-full blur-[80px]"
            />

            {/* Purple accent orb */}
            <motion.div
                animate={{
                    x: [0, 30, 0],
                    y: [0, -20, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="absolute bottom-20 left-1/4 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[60px]"
            />
        </div>
    );
}
