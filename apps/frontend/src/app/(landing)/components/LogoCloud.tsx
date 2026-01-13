'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';

// Company logos (using placeholder text - you can replace with actual logos)
const partners = [
    { name: 'Google', logo: '🔵' },
    { name: 'Microsoft', logo: '🟦' },
    { name: 'Amazon', logo: '🟠' },
    { name: 'Meta', logo: '🔷' },
    { name: 'Apple', logo: '⚪' },
    { name: 'Netflix', logo: '🔴' },
];

/**
 * LogoCloud Component
 * 
 * Scrolling logo carousel showing where users got hired.
 */
export function LogoCloud() {
    return (
        <section className="py-16 bg-white border-y border-slate-100 overflow-hidden">
            <div className="container mx-auto px-6">
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center text-sm text-slate-500 mb-8"
                >
                    Our users have been hired at
                </motion.p>

                {/* Infinite scroll animation */}
                <div className="relative">
                    <div className="flex gap-12 animate-scroll">
                        {[...partners, ...partners].map((partner, i) => (
                            <div
                                key={`${partner.name}-${i}`}
                                className="flex items-center gap-3 text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                            >
                                <span className="text-2xl">{partner.logo}</span>
                                <span className="text-lg font-semibold">{partner.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
        </section>
    );
}
