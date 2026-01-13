'use client';

import { motion } from 'framer-motion';
import { Upload, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import Link from 'next/link';

/**
 * CTA3D Component
 * 
 * Call-to-action section for 3D landing page.
 * Features upload zone and action buttons.
 */
export function CTA3D() {
    return (
        <section className="relative py-24 px-4 z-10">
            {/* Background gradient */}
            <div className="absolute inset-0 -z-10">
                <div
                    className="absolute inset-0 opacity-50"
                    style={{
                        background: 'linear-gradient(135deg, rgba(47, 107, 255, 0.05) 0%, rgba(60, 224, 177, 0.05) 100%)',
                    }}
                />
            </div>

            <div className="max-w-4xl mx-auto text-center">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to <span className="text-gradient-primary">supercharge</span> your CV?
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Join thousands of professionals who landed their dream jobs.
                    </p>
                </motion.div>

                {/* Upload Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="glass-panel rounded-2xl p-8 mb-8"
                >
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-[#2F6BFF]/10 flex items-center justify-center">
                            <Upload size={32} className="text-[#2F6BFF]" />
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-2">Upload Your CV</h3>
                            <p className="text-slate-500 text-sm">Get instant AI-powered analysis</p>
                        </div>

                        <Link
                            href="/register"
                            className="btn-primary flex items-center gap-2 text-lg px-8 py-4"
                        >
                            <Sparkles size={18} />
                            Start Free Analysis
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </motion.div>

                {/* Benefits */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex flex-wrap items-center justify-center gap-6"
                >
                    {['No credit card required', 'Instant results', '100% free tier'].map((benefit) => (
                        <div key={benefit} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <CheckCircle size={16} className="text-[#3CE0B1]" />
                            {benefit}
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
