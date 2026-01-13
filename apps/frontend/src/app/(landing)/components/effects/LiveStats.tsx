'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

/**
 * LiveStats Component
 * 
 * Shows simulated live activity with pulse effect.
 */
export function LiveStats() {
    const [count, setCount] = useState(5);
    const [showPulse, setShowPulse] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prev) => {
                const change = Math.random() > 0.5 ? 1 : -1;
                const newCount = prev + change;
                return Math.max(2, Math.min(12, newCount));
            });
            setShowPulse(true);
            setTimeout(() => setShowPulse(false), 500);
        }, 3000 + Math.random() * 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 shadow-sm"
        >
            {/* Pulse indicator */}
            <div className="relative">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <AnimatePresence>
                    {showPulse && (
                        <motion.div
                            initial={{ scale: 1, opacity: 0.8 }}
                            animate={{ scale: 2.5, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full"
                        />
                    )}
                </AnimatePresence>
            </div>

            <Users size={14} className="text-slate-500" />

            <span className="text-sm text-slate-600">
                <motion.span
                    key={count}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-semibold text-slate-900"
                >
                    {count}
                </motion.span>
                {' '}people analyzing CVs now
            </span>
        </motion.div>
    );
}
