'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Sparkles, X, Check, ArrowRight, Zap } from 'lucide-react';

/**
 * BeforeAfter Component
 * 
 * Premium CV transformation comparison.
 */
export function BeforeAfter() {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: '-100px' });

    const beforeIssues = [
        'Missing key industry terms',
        'Poor formatting for ATS',
        'Weak action verbs',
        'No quantified achievements',
        'Generic summary',
    ];

    const afterImprovements = [
        '18 industry keywords added',
        'ATS-friendly formatting',
        'Strong action verbs used',
        'Quantified achievements (3×)',
        'Compelling professional summary',
    ];

    return (
        <section ref={containerRef} className="py-24 bg-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-red-500/5 via-transparent to-[#3CE0B1]/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-6 relative">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    className="text-center mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#3CE0B1]/10 text-[#3CE0B1] rounded-full text-sm font-medium mb-4">
                        <Zap size={14} />
                        The Transformation
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
                        See the <span className="text-gradient-primary">Difference</span> AI Makes
                    </h2>
                    <p className="text-lg text-slate-600 mt-4 max-w-2xl mx-auto">
                        Watch your CV transform from ignored to interview-ready in seconds.
                    </p>
                </motion.div>

                {/* Before/After Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto relative">
                    {/* Center Arrow */}
                    <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ delay: 0.6, type: 'spring' }}
                            className="w-16 h-16 rounded-full bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] flex items-center justify-center shadow-xl shadow-[#2F6BFF]/25"
                        >
                            <ArrowRight size={28} className="text-white" />
                        </motion.div>
                    </div>

                    {/* Before */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5 }}
                        className="relative"
                    >
                        {/* Badge */}
                        <div className="absolute -top-4 left-6 px-4 py-1.5 bg-slate-800 text-white text-sm font-semibold rounded-full shadow-lg z-10">
                            Before
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-8 border-2 border-slate-200 h-full">
                            {/* Score */}
                            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
                                <div>
                                    <span className="text-sm text-slate-500">ATS Score</span>
                                    <div className="text-4xl font-bold text-slate-400 mt-1">45</div>
                                </div>
                                <div className="w-20 h-20 rounded-full border-4 border-slate-300 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-slate-400">F</span>
                                </div>
                            </div>

                            {/* Issues */}
                            <div className="space-y-4">
                                {beforeIssues.map((issue, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                                        transition={{ delay: 0.2 + i * 0.1 }}
                                        className="flex items-center gap-3 text-slate-600"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                            <X size={14} className="text-red-500" />
                                        </div>
                                        <span>{issue}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* After */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative"
                    >
                        {/* Badge */}
                        <div className="absolute -top-4 left-6 px-4 py-1.5 bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] text-white text-sm font-semibold rounded-full shadow-lg z-10">
                            After
                        </div>

                        {/* Glow effect */}
                        <div className="absolute -inset-2 bg-gradient-to-r from-[#2F6BFF]/20 to-[#3CE0B1]/20 rounded-3xl blur-xl" />

                        <div className="relative bg-white rounded-2xl p-8 border-2 border-[#3CE0B1]/30 h-full shadow-lg">
                            {/* Score */}
                            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                                <div>
                                    <span className="text-sm text-slate-500">ATS Score</span>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={isInView ? { opacity: 1 } : {}}
                                        transition={{ delay: 0.5 }}
                                        className="text-4xl font-bold text-gradient-primary mt-1"
                                    >
                                        95
                                    </motion.div>
                                </div>
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={isInView ? { scale: 1, rotate: 0 } : {}}
                                    transition={{ delay: 0.6, type: 'spring' }}
                                    className="w-20 h-20 rounded-full bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] flex items-center justify-center shadow-lg shadow-[#3CE0B1]/25"
                                >
                                    <span className="text-2xl font-bold text-white">A+</span>
                                </motion.div>
                            </div>

                            {/* Improvements */}
                            <div className="space-y-4">
                                {afterImprovements.map((improvement, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                                        transition={{ delay: 0.4 + i * 0.1 }}
                                        className="flex items-center gap-3 text-slate-700"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={isInView ? { scale: 1 } : {}}
                                            transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
                                            className="w-6 h-6 rounded-full bg-[#3CE0B1]/20 flex items-center justify-center flex-shrink-0"
                                        >
                                            <Check size={14} className="text-[#3CE0B1]" />
                                        </motion.div>
                                        <span>{improvement}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 1 }}
                    className="text-center mt-12"
                >
                    <p className="text-slate-600 mb-4">
                        <span className="text-[#3CE0B1] font-bold">+50 points</span> improvement in seconds
                    </p>
                    <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="inline-flex items-center gap-2 text-[#2F6BFF] font-semibold"
                    >
                        <Sparkles size={18} />
                        Powered by AI
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
