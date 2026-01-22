'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface TextSplitProps {
    children: string;
    className?: string;
    delay?: number;
    wordDelay?: number;
}

/**
 * TextSplit Component
 * 
 * Animates text word by word.
 */
export function TextSplit({ children, className = '', delay = 0, wordDelay = 0.05 }: TextSplitProps) {
    const words = children.split(' ');

    return (
        <span>
            {words.map((word, index) => (
                <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.5,
                        delay: delay + index * wordDelay,
                        ease: [0.25, 0.1, 0.25, 1],
                    }}
                    className={`inline-block mr-[0.25em] ${className}`}
                >
                    {word}
                </motion.span>
            ))}
        </span>
    );
}
