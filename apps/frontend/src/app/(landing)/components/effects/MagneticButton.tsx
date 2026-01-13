'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, ReactNode } from 'react';
import Link from 'next/link';

interface MagneticButtonProps {
    children: ReactNode;
    href?: string;
    onClick?: () => void;
    className?: string;
    strength?: number;
}

/**
 * MagneticButton Component
 * 
 * Button that attracts toward cursor position.
 */
export function MagneticButton({
    children,
    href,
    onClick,
    className = '',
    strength = 0.3
}: MagneticButtonProps) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const xSpring = useSpring(x, { stiffness: 150, damping: 15 });
    const ySpring = useSpring(y, { stiffness: 150, damping: 15 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = (e.clientX - centerX) * strength;
        const distY = (e.clientY - centerY) * strength;
        x.set(distX);
        y.set(distY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const content = (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: xSpring, y: ySpring }}
            className={`inline-block ${className}`}
        >
            {children}
        </motion.div>
    );

    if (href) {
        return <Link href={href}>{content}</Link>;
    }

    return <div onClick={onClick}>{content}</div>;
}
