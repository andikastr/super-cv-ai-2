'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface TypewriterProps {
    text: string;
    className?: string;
    speed?: number;
    delay?: number;
}

/**
 * Typewriter Component
 * 
 * Text that types out letter by letter.
 */
export function Typewriter({ text, className = '', speed = 50, delay = 0 }: TypewriterProps) {
    const [displayText, setDisplayText] = useState('');
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const startTimer = setTimeout(() => setStarted(true), delay);
        return () => clearTimeout(startTimer);
    }, [delay]);

    useEffect(() => {
        if (!started) return;

        let index = 0;
        const interval = setInterval(() => {
            if (index < text.length) {
                setDisplayText(text.slice(0, index + 1));
                index++;
            } else {
                clearInterval(interval);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [started, text, speed]);

    return (
        <span className={className}>
            {displayText}
            <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="inline-block w-[3px] h-[1em] bg-current ml-1"
            />
        </span>
    );
}
