'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { FloatingCV } from './FloatingCV';

/**
 * HeroClean Component
 * 
 * Clean split-layout hero with content on left, floating CV on right.
 */
export function HeroClean() {
    return (
        <section className="relative min-h-screen flex items-center">
            {/* Background gradient */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30" />
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#2F6BFF]/5 to-transparent" />
            </div>

            <div className="container mx-auto px-6 py-20">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
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
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight"
                        >
                            Your CV, <br />
                            <span className="text-gradient-primary">Supercharged by AI</span>
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed"
                        >
                            Transform your resume into an ATS-optimized masterpiece.
                            Get hired <span className="font-semibold text-[#2F6BFF]">3× faster</span> with
                            AI-powered insights and instant feedback.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 mb-10"
                        >
                            <Link
                                href="/register"
                                className="btn-primary flex items-center justify-center gap-2 text-lg px-8 py-4"
                            >
                                Start Free Analysis
                                <ArrowRight size={18} />
                            </Link>

                            <Link
                                href="/login"
                                className="btn-ghost flex items-center justify-center text-lg px-8 py-4"
                            >
                                Sign In
                            </Link>
                        </motion.div>

                        {/* Benefits */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex flex-wrap gap-4"
                        >
                            {['No credit card required', 'Instant results', 'Free tier available'].map((benefit) => (
                                <div key={benefit} className="flex items-center gap-2 text-sm text-slate-500">
                                    <CheckCircle size={16} className="text-[#3CE0B1]" />
                                    {benefit}
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right: Floating CV */}
                    <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                        <FloatingCV />
                    </div>
                </div>
            </div>
        </section>
    );
}
