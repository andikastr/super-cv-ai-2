'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, Quote, Users, Award, TrendingUp } from 'lucide-react';

const testimonials = [
    {
        name: 'Sarah Mitchell',
        role: 'Software Engineer',
        company: 'Google',
        image: 'https://randomuser.me/api/portraits/women/44.jpg',
        content: 'After using Super CV, I got 5 interview calls in one week. The AI suggestions were spot-on for tech roles.',
        rating: 5,
        highlight: '5 interviews in 1 week',
    },
    {
        name: 'James Chen',
        role: 'Product Manager',
        company: 'Meta',
        image: 'https://randomuser.me/api/portraits/men/46.jpg',
        content: 'The ATS optimization feature is a game-changer. My application success rate went from 10% to 60%.',
        rating: 5,
        highlight: '10% → 60% success rate',
    },
    {
        name: 'Emily Rodriguez',
        role: 'Marketing Director',
        company: 'Shopify',
        image: 'https://randomuser.me/api/portraits/women/68.jpg',
        content: 'I was skeptical at first, but the before/after difference was incredible. Landed my dream job in 2 weeks.',
        rating: 5,
        highlight: 'Dream job in 2 weeks',
    },
];

const stats = [
    { icon: Users, value: '10,000+', label: 'CVs Optimized', color: '#2F6BFF' },
    { icon: Star, value: '4.9/5', label: 'User Rating', color: '#F59E0B' },
    { icon: TrendingUp, value: '95%', label: 'ATS Pass Rate', color: '#3CE0B1' },
    { icon: Award, value: '3×', label: 'More Interviews', color: '#8B5CF6' },
];

/**
 * Testimonials Component
 * 
 * Premium social proof section.
 */
export function Testimonials() {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: '-100px' });

    return (
        <section
            ref={containerRef}
            className="py-24 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden"
        >
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#2F6BFF]/5 rounded-full blur-3xl -translate-y-1/2" />
                <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#3CE0B1]/5 rounded-full blur-3xl -translate-y-1/2" />
            </div>

            <div className="container mx-auto px-6 relative">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    className="text-center mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#F59E0B]/10 text-[#F59E0B] rounded-full text-sm font-medium mb-4">
                        <Star size={14} className="fill-current" />
                        Testimonials
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
                        Loved by <span className="text-gradient-primary">Job Seekers</span> Worldwide
                    </h2>
                    <p className="text-lg text-slate-600 mt-4 max-w-2xl mx-auto">
                        Join thousands of professionals who transformed their careers with Super CV.
                    </p>
                </motion.div>

                {/* Testimonial Cards */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: index * 0.15 }}
                            className="group relative"
                        >
                            {/* Hover glow */}
                            <div className="absolute -inset-2 bg-gradient-to-r from-[#2F6BFF]/20 to-[#3CE0B1]/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />

                            <div className="relative bg-white rounded-2xl p-8 border border-slate-100 h-full transition-all duration-300 group-hover:border-transparent group-hover:shadow-2xl">
                                {/* Quote icon */}
                                <div className="absolute -top-4 right-6 w-10 h-10 rounded-xl bg-gradient-to-br from-[#2F6BFF] to-[#3CE0B1] flex items-center justify-center shadow-lg">
                                    <Quote size={18} className="text-white" />
                                </div>

                                {/* Stars */}
                                <div className="flex gap-1 mb-4">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                            transition={{ delay: 0.3 + index * 0.1 + i * 0.05 }}
                                        >
                                            <Star size={18} className="fill-[#F59E0B] text-[#F59E0B]" />
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Highlight badge */}
                                <div className="inline-flex px-3 py-1 bg-[#3CE0B1]/10 text-[#3CE0B1] rounded-full text-xs font-semibold mb-4">
                                    {testimonial.highlight}
                                </div>

                                {/* Content */}
                                <p className="text-slate-600 mb-6 leading-relaxed text-lg">
                                    "{testimonial.content}"
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] rounded-full opacity-50 blur-sm" />
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="relative w-14 h-14 rounded-full object-cover border-2 border-white"
                                        />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">{testimonial.name}</div>
                                        <div className="text-sm text-slate-500">
                                            {testimonial.role} at <span className="text-[#2F6BFF]">{testimonial.company}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Trust Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.6 }}
                    className="flex flex-wrap justify-center gap-6 mt-16"
                >
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ delay: 0.7 + i * 0.1 }}
                            className="flex items-center gap-3 px-6 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-shadow"
                        >
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ backgroundColor: `${stat.color}15` }}
                            >
                                <stat.icon size={20} style={{ color: stat.color }} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                                <div className="text-xs text-slate-500">{stat.label}</div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
