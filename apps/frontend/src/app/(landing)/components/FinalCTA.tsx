'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

/**
 * FinalCTA Component
 * 
 * Final CTA in a rounded card with gradient background.
 */
export function FinalCTA() {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: '-100px' });

    return (
        <section
            ref={containerRef}
            className="py-20 px-6 bg-slate-50"
        >
            <div className="container mx-auto">
                {/* CTA Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    className="relative rounded-3xl overflow-hidden"
                >
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2F6BFF] via-[#2558D9] to-[#3CE0B1]" />

                    {/* Decorative blobs */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-[#3CE0B1]/20 rounded-full blur-2xl" />
                    </div>

                    {/* Content */}
                    <div className="relative py-16 px-8 md:py-20 md:px-16 text-center">
                        {/* Floating icons */}
                        <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden md:block">
                            <motion.div
                                animate={{ y: [0, -10, 0], rotate: [-5, 5, -5] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg"
                            >
                                <Sparkles size={28} className="text-white" />
                            </motion.div>
                        </div>
                        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:block">
                            <motion.div
                                animate={{ y: [0, 10, 0], rotate: [5, -5, 5] }}
                                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                                className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg"
                            >
                                <div className="w-8 h-8 rounded-lg bg-white/30" />
                            </motion.div>
                        </div>

                        {/* Headline */}
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-2xl mx-auto">
                            Ready to Land Your Dream Job?
                        </h2>

                        <p className="text-lg text-white/80 mb-8 max-w-lg mx-auto">
                            Start today with a free analysis and experience the difference of AI-powered CV optimization.
                        </p>

                        {/* CTA Button */}
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                href="/app"
                                className="inline-flex items-center justify-center gap-2 bg-white text-[#2F6BFF] font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
                            >
                                Start Free Analysis
                                <ArrowRight size={18} />
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
