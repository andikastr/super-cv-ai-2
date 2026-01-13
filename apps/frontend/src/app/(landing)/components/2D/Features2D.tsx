'use client';

import { motion } from 'framer-motion';
import { Target, Zap, Shield, Brain, FileCheck, TrendingUp, type LucideIcon } from 'lucide-react';

/**
 * Feature item type
 */
interface Feature {
    /** Lucide icon component */
    icon: LucideIcon;
    /** Feature title */
    title: string;
    /** Feature description */
    description: string;
    /** Accent color class */
    color: string;
}

/**
 * Features2D Component
 * 
 * 2D fallback feature showcase for mobile/low-power devices.
 * Uses simple CSS hover effects instead of 3D transforms.
 * 
 * Features:
 * - Simple hover:scale(1.02) effects
 * - CSS box-shadow instead of 3D shadows
 * - Framer Motion for entrance animations only
 * - No Three.js imports
 */
export function Features2D() {
    const features: Feature[] = [
        {
            icon: Brain,
            title: 'AI-Powered Analysis',
            description: 'Deep learning algorithms scan your CV for optimization opportunities.',
            color: 'text-[#2F6BFF] bg-[#2F6BFF]/10',
        },
        {
            icon: FileCheck,
            title: 'ATS Optimization',
            description: 'Beat applicant tracking systems with keyword-optimized content.',
            color: 'text-[#3CE0B1] bg-[#3CE0B1]/10',
        },
        {
            icon: Target,
            title: 'Job Matching',
            description: 'Tailor your CV to specific job descriptions for maximum impact.',
            color: 'text-[#FFD84D] bg-[#FFD84D]/10',
        },
        {
            icon: Zap,
            title: 'Instant Results',
            description: 'Get comprehensive feedback in seconds, not hours.',
            color: 'text-[#2F6BFF] bg-[#2F6BFF]/10',
        },
        {
            icon: Shield,
            title: 'Privacy First',
            description: 'Your data is encrypted and never shared with third parties.',
            color: 'text-[#3CE0B1] bg-[#3CE0B1]/10',
        },
        {
            icon: TrendingUp,
            title: 'Score Tracking',
            description: 'Monitor your CV score improvements over time.',
            color: 'text-[#FFD84D] bg-[#FFD84D]/10',
        },
    ];

    return (
        <section id="features" className="py-24 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Everything you need to{' '}
                        <span className="text-gradient-primary">land your dream job</span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Our AI-powered platform provides comprehensive tools to optimize your resume
                        and boost your chances of getting hired.
                    </p>
                </motion.div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="group glass-panel rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 hover:shadow-lg"
                        >
                            {/* Icon */}
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                                <feature.icon size={22} />
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">
                                {feature.title}
                            </h3>

                            {/* Description */}
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
