'use client';

import { motion } from 'framer-motion';
import { Brain, Sparkles, Cpu, Zap } from 'lucide-react';

/**
 * AIEngine Component
 * 
 * AI engine showcase section explaining how the analysis works.
 */
export function AIEngine() {
    const steps = [
        {
            icon: Cpu,
            title: 'Upload Your CV',
            description: 'Our system accepts PDF, DOC, and DOCX files.',
        },
        {
            icon: Brain,
            title: 'AI Analysis',
            description: 'Deep learning models analyze structure and content.',
        },
        {
            icon: Sparkles,
            title: 'Get Insights',
            description: 'Receive personalized recommendations instantly.',
        },
        {
            icon: Zap,
            title: 'Optimize & Apply',
            description: 'Apply changes and land more interviews.',
        },
    ];

    return (
        <section className="relative py-24 px-4 z-10">
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
                        How our <span className="text-gradient-primary">AI Engine</span> works
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Advanced neural networks analyze your CV in seconds,
                        providing actionable insights to improve your chances.
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="relative"
                        >
                            {/* Connector line */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-[#2F6BFF]/30 to-transparent" />
                            )}

                            <div className="glass-panel rounded-2xl p-6 h-full">
                                {/* Step number */}
                                <div className="w-8 h-8 rounded-full bg-[#2F6BFF] text-white flex items-center justify-center text-sm font-bold mb-4">
                                    {index + 1}
                                </div>

                                {/* Icon */}
                                <div className="w-12 h-12 rounded-xl bg-[#2F6BFF]/10 flex items-center justify-center mb-4">
                                    <step.icon size={22} className="text-[#2F6BFF]" />
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">
                                    {step.title}
                                </h3>

                                {/* Description */}
                                <p className="text-slate-600 dark:text-slate-400 text-sm">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
