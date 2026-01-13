'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Particle {
    id: number;
    size: number;
    x: number;
    y: number;
    duration: number;
    delay: number;
    opacity: number;
}

/**
 * FloatingParticles Component
 * 
 * Optimized visible floating particles - no blur/shadow for performance.
 */
export function FloatingParticles() {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        const generated = Array.from({ length: 25 }, (_, i) => ({
            id: i,
            size: Math.random() * 10 + 10, // 4-12px
            x: Math.random() * 100,
            y: Math.random() * 100,
            duration: Math.random() * 8 + 10,
            delay: Math.random() * 2,
            opacity: Math.random() * 0.3 + 0.2, // 0.2-0.5
        }));
        setParticles(generated);
    }, []);

    if (particles.length === 0) {
        return null;
    }

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full bg-[#2F6BFF]"
                    style={{
                        width: particle.size,
                        height: particle.size,
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        opacity: particle.opacity,
                    }}
                    animate={{
                        y: [-15, 15, -15],
                        x: [-8, 8, -8],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        delay: particle.delay,
                        ease: 'linear',
                    }}
                />
            ))}
        </div>
    );
}
