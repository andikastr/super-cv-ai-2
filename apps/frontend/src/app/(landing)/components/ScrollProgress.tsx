'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

/**
 * ScrollProgress Component
 * 
 * Animated scroll progress bar at top of page.
 */
export function ScrollProgress() {
    const scaleX = useSpring(0, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    useEffect(() => {
        const updateProgress = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = window.scrollY;
            const progress = scrollHeight > 0 ? scrolled / scrollHeight : 0;
            scaleX.set(progress);
        };

        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();

        return () => window.removeEventListener('scroll', updateProgress);
    }, [scaleX]);

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1 z-[60] origin-left"
            style={{
                scaleX,
                background: 'linear-gradient(90deg, #2F6BFF 0%, #3CE0B1 100%)',
            }}
        />
    );
}
