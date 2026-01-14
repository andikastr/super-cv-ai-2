'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { FloatingCV } from './FloatingCV';
import { AnimatedGradient, FloatingParticles, TextSplit, GlowOrbs, GridPattern } from './effects';

/**
 * StoryHero Component
 * 
 * Premium scroll-driven hero with creative buttons.
 */
export function StoryHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    const y = useTransform(scrollYProgress, [0, 0.3], [0, -50]);
    const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

    return (
        <AnimatedGradient className="relative min-h-screen flex items-center bg-gradient-to-b from-white via-slate-50 to-white">
            <section ref={containerRef} className="w-full py-20 lg:py-0">
                {/* Background Effects */}
                <GlowOrbs />
                <GridPattern />
                <FloatingParticles />

                <motion.div
                    style={{ opacity, y, scale }}
                    className="container mx-auto px-6"
                >
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Left: Content */}
                        <div className="order-2 lg:order-1">
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-[#2F6BFF]/10 rounded-full text-[#2F6BFF] text-sm font-medium mb-6"
                            >
                                <Sparkles size={14} />
                                <span>AI-Powered CV Optimization</span>
                            </motion.div>

                            {/* Headline */}
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                                <TextSplit delay={0.3}>
                                    Stop Getting Rejected.
                                </TextSplit>
                                <br />
                                <span className="text-gradient-primary">
                                    <TextSplit delay={0.6}>
                                        Start Getting Hired.
                                    </TextSplit>
                                </span>
                            </h1>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.8 }}
                                className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed"
                            >
                                Our AI analyzes your CV in seconds, beats ATS systems, and helps you
                                land <span className="font-semibold text-[#2F6BFF]">3× more interviews</span>.
                            </motion.p>

                            {/* Creative CTA Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 1 }}
                                className="flex flex-col sm:flex-row gap-4 mb-8"
                            >
                                {/* Primary CTA - Glowing button */}
                                <Link href="/app" className="group relative">
                                    {/* Glow effect */}
                                    <div className="absolute -inset-1 bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Button */}
                                    <div className="relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] text-white font-semibold rounded-xl overflow-hidden">
                                        {/* Shine effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                                        <span className="relative text-lg">Analyze My CV Free</span>
                                        <motion.div
                                            className="relative"
                                            animate={{ x: [0, 4, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            <ArrowRight size={20} />
                                        </motion.div>
                                    </div>
                                </Link>

                                {/* Secondary CTA - Clean outline style */}
                                <a href="#demo" className="group flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-slate-200 hover:border-[#2F6BFF] text-slate-700 hover:text-[#2F6BFF] font-semibold rounded-xl transition-all duration-300">
                                    <span className="text-lg">See How It Works</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </a>
                            </motion.div>

                            {/* Trust indicators */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 1.2 }}
                                className="flex flex-wrap gap-6"
                            >
                                {[
                                    { value: '10,000+', label: 'CVs Optimized' },
                                    { value: '95%', label: 'ATS Pass Rate' },
                                    { value: '3×', label: 'More Interviews' },
                                ].map((stat, i) => (
                                    <motion.div
                                        key={stat.label}
                                        className="text-center"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.3 + i * 0.1 }}
                                    >
                                        <div className="text-2xl font-bold text-[#2F6BFF]">{stat.value}</div>
                                        <div className="text-xs text-slate-500">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Right: Floating CV */}
                        <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                            <FloatingCV />
                        </div>
                    </div>
                </motion.div>
            </section>
        </AnimatedGradient>
    );
}
