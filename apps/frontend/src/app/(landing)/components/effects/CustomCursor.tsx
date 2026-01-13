'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * CustomCursor Component
 * 
 * Custom branded cursor with instant follow - no delay.
 */
export function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Much faster spring for responsive feel
    const springConfig = { stiffness: 500, damping: 28, mass: 0.5 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            setIsVisible(true);
        };

        const handleMouseEnter = (e: MouseEvent) => {
            const target = e.target as Element;
            if (target.closest('a, button, [role="button"], input, textarea, select')) {
                setIsHovering(true);
            }
        };

        const handleMouseLeave = (e: MouseEvent) => {
            const target = e.target as Element;
            if (target.closest('a, button, [role="button"], input, textarea, select')) {
                setIsHovering(false);
            }
        };

        const handleMouseOut = () => {
            setIsVisible(false);
        };

        window.addEventListener('mousemove', moveCursor);
        document.addEventListener('mouseover', handleMouseEnter);
        document.addEventListener('mouseout', handleMouseLeave);
        document.addEventListener('mouseleave', handleMouseOut);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.removeEventListener('mouseover', handleMouseEnter);
            document.removeEventListener('mouseout', handleMouseLeave);
            document.removeEventListener('mouseleave', handleMouseOut);
        };
    }, [cursorX, cursorY]);

    // Hide on touch devices
    if (typeof window !== 'undefined' && 'ontouchstart' in window) {
        return null;
    }

    return (
        <>
            {/* Main cursor dot - follows instantly */}
            <motion.div
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    scale: isHovering ? 1.5 : 1,
                    opacity: isVisible ? 1 : 0,
                }}
                transition={{ scale: { duration: 0.1 } }}
                className="fixed top-0 left-0 w-3 h-3 bg-[#2F6BFF] rounded-full pointer-events-none z-[9999] mix-blend-difference"
            />

            {/* Outer ring - slightly trails */}
            <motion.div
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    scale: isHovering ? 1.8 : 1,
                    opacity: isVisible ? 0.4 : 0,
                }}
                transition={{ scale: { duration: 0.15 } }}
                className="fixed top-0 left-0 w-6 h-6 border border-[#2F6BFF] rounded-full pointer-events-none z-[9998]"
            />

            {/* Hide default cursor globally */}
            <style jsx global>{`
        body {
          cursor: none;
        }
        a, button, [role="button"], input, textarea, select {
          cursor: none;
        }
      `}</style>
        </>
    );
}
