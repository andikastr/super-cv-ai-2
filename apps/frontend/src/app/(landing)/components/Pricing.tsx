'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Check, Sparkles, Zap, Crown, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const plans = [
    {
        name: 'Free',
        icon: Zap,
        price: '$0',
        period: 'forever',
        description: 'Perfect for trying out',
        features: [
            '3 CV analyses per month',
            'Basic ATS score',
            'Top 5 suggestions',
            'Email support',
        ],
        cta: 'Get Started',
        href: '/register',
        popular: false,
        gradient: 'from-slate-500 to-slate-600',
    },
    {
        name: 'Pro',
        icon: Crown,
        price: '$9',
        period: '/month',
        description: 'For active job seekers',
        features: [
            'Unlimited CV analyses',
            'Advanced ATS scoring',
            'All suggestions & fixes',
            'Job description matching',
            'Multiple CV versions',
            'Priority support',
        ],
        cta: 'Start Pro Trial',
        href: '/register?plan=pro',
        popular: true,
        gradient: 'from-[#2F6BFF] to-[#3CE0B1]',
    },
    {
        name: 'Lifetime',
        icon: Shield,
        price: '$49',
        period: 'one-time',
        description: 'Best value forever',
        features: [
            'Everything in Pro',
            'Lifetime access',
            'Future updates included',
            'AI cover letter generator',
            'LinkedIn optimization',
            'VIP support',
        ],
        cta: 'Get Lifetime Access',
        href: '/register?plan=lifetime',
        popular: false,
        gradient: 'from-purple-500 to-purple-600',
    },
];

/**
 * Pricing Component
 * 
 * Premium pricing section with hover effects.
 */
export function Pricing() {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: '-100px' });
    const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

    return (
        <section
            id="pricing"
            ref={containerRef}
            className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden"
        >
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#2F6BFF]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#3CE0B1]/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-6 relative">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    className="text-center mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#2F6BFF]/10 text-[#2F6BFF] rounded-full text-sm font-medium mb-4">
                        <Sparkles size={14} />
                        Pricing
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
                        Simple, <span className="text-gradient-primary">Transparent</span> Pricing
                    </h2>
                    <p className="text-lg text-slate-600 mt-4 max-w-xl mx-auto">
                        Start free, upgrade when you're ready. No hidden fees.
                    </p>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: index * 0.1 }}
                            onMouseEnter={() => setHoveredPlan(plan.name)}
                            onMouseLeave={() => setHoveredPlan(null)}
                            className={`relative ${plan.popular ? 'md:-mt-4' : ''}`}
                        >
                            {/* Popular glow */}
                            {plan.popular && (
                                <div className="absolute -inset-2 bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] rounded-3xl opacity-20 blur-xl" />
                            )}

                            {/* Card */}
                            <motion.div
                                whileHover={{ y: -8 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                className={`relative bg-white rounded-2xl p-8 h-full transition-all duration-300 ${plan.popular
                                        ? 'border-2 border-[#2F6BFF] shadow-2xl'
                                        : 'border border-slate-200 hover:border-slate-300 hover:shadow-xl'
                                    }`}
                            >
                                {/* Popular badge */}
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <motion.div
                                            animate={{ y: [0, -3, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="px-4 py-1.5 bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] text-white text-sm font-semibold rounded-full flex items-center gap-1.5 shadow-lg"
                                        >
                                            <Sparkles size={14} />
                                            Most Popular
                                        </motion.div>
                                    </div>
                                )}

                                {/* Plan icon */}
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                                    <plan.icon size={22} className="text-white" />
                                </div>

                                {/* Plan header */}
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-5xl font-bold text-slate-900">{plan.price}</span>
                                        <span className="text-slate-500">{plan.period}</span>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-2">{plan.description}</p>
                                </div>

                                {/* Features */}
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <motion.li
                                            key={feature}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                                            transition={{ delay: 0.2 + index * 0.1 + i * 0.05 }}
                                            className="flex items-start gap-3"
                                        >
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${plan.popular ? 'bg-[#3CE0B1]/20' : 'bg-slate-100'
                                                }`}>
                                                <Check size={12} className={plan.popular ? 'text-[#3CE0B1]' : 'text-slate-400'} />
                                            </div>
                                            <span className="text-slate-600">{feature}</span>
                                        </motion.li>
                                    ))}
                                </ul>

                                {/* CTA */}
                                <Link
                                    href={plan.href}
                                    className={`group flex items-center justify-center gap-2 w-full py-4 px-6 rounded-xl font-semibold transition-all ${plan.popular
                                            ? 'bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] text-white hover:shadow-lg hover:shadow-[#2F6BFF]/25'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        }`}
                                >
                                    {plan.cta}
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>

                {/* Money back guarantee */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.6 }}
                    className="flex flex-wrap items-center justify-center gap-6 mt-12"
                >
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Shield size={16} className="text-[#3CE0B1]" />
                        30-day money-back guarantee
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Check size={16} className="text-[#3CE0B1]" />
                        Cancel anytime
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Zap size={16} className="text-[#2F6BFF]" />
                        Instant access
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
