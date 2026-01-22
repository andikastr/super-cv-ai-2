'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedGradientProps {
    children: ReactNode;
    className?: string;
}

/**
 * AnimatedGradient Component
 * 
 * Animated gradient background that slowly moves.
 */
export function AnimatedGradient({ children, className = '' }: AnimatedGradientProps) {
    return (
        <div className={`relative overflow-x-hidden ${className}`}>
            {/* Animated gradient blobs */}
            <div className="absolute inset-0 -z-10">
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="absolute top-0 -left-20 w-96 h-96 bg-[#2F6BFF]/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        x: [0, -80, 0],
                        y: [0, 80, 0],
                        scale: [1, 1.3, 1],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="absolute top-1/2 -right-20 w-80 h-80 bg-[#3CE0B1]/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        x: [0, 50, 0],
                        y: [0, -30, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl"
                />
            </div>
            {children}
        </div>
    );
}
