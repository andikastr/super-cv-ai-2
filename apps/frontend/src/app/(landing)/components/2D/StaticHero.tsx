'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

/**
 * StaticHero Component
 * 
 * 2D fallback hero section for mobile/low-power devices.
 * Uses CSS-only animations instead of WebGL/Three.js.
 * 
 * Features:
 * - CSS keyframe animations
 * - Gradient backgrounds
 * - Framer Motion for entrance animations only
 * - No Three.js imports
 */
export function StaticHero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
            {/* CSS Background Effects */}
            <div className="absolute inset-0 -z-10">
                {/* Gradient orbs - CSS only */}
                <div
                    className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full animate-float-slow"
                    style={{
                        background: 'radial-gradient(circle, rgba(47, 107, 255, 0.15) 0%, transparent 70%)',
                        filter: 'blur(60px)',
                    }}
                />
                <div
                    className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full animate-float-slow-reverse"
                    style={{
                        background: 'radial-gradient(circle, rgba(60, 224, 177, 0.12) 0%, transparent 70%)',
                        filter: 'blur(50px)',
                        animationDelay: '-3s',
                    }}
                />
                <div
                    className="absolute top-1/2 right-1/3 w-[250px] h-[250px] rounded-full animate-pulse-slow"
                    style={{
                        background: 'radial-gradient(circle, rgba(255, 216, 77, 0.1) 0%, transparent 70%)',
                        filter: 'blur(40px)',
                    }}
                />

                {/* Grid pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(47, 107, 255, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(47, 107, 255, 0.3) 1px, transparent 1px)
            `,
                        backgroundSize: '60px 60px',
                    }}
                />
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 glass-panel rounded-full text-[#2F6BFF] text-sm font-medium mb-8"
                >
                    <Sparkles size={14} className="animate-pulse" />
                    <span>Powered by Advanced AI</span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-[clamp(2.5rem,8vw,5rem)] font-serif font-bold tracking-tight mb-6"
                >
                    Your CV,{' '}
                    <span className="relative inline-block">
                        <span className="text-gradient-primary">Supercharged by AI</span>
                        <span
                            className="absolute -inset-2 bg-gradient-to-r from-[#2F6BFF]/20 via-[#3CE0B1]/20 to-[#2F6BFF]/20 blur-xl -z-10 animate-shimmer-bg"
                        />
                    </span>
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    Transform your resume into an ATS-optimized masterpiece.
                    Get hired <span className="font-semibold text-[#2F6BFF]">3× faster</span> with AI-powered insights.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link
                        href="/register"
                        className="btn-primary flex items-center gap-2 text-lg px-8 py-4"
                    >
                        Start Free Analysis
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                        href="#features"
                        className="btn-ghost text-lg px-8 py-4"
                    >
                        Learn More
                    </Link>
                </motion.div>

                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex flex-wrap items-center justify-center gap-8 mt-16"
                >
                    {[
                        { value: '10K+', label: 'CVs Optimized' },
                        { value: '95%', label: 'ATS Pass Rate' },
                        { value: '3×', label: 'More Interviews' },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className="text-3xl font-bold text-[#2F6BFF]">{stat.value}</div>
                            <div className="text-sm text-slate-500">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
