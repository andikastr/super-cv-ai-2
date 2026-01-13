'use client';

import { LandingNavbar } from './LandingNavbar';
import { ScrollProgress } from './ScrollProgress';
import { StoryHero } from './StoryHero';
import { ProblemSection } from './ProblemSection';
import { ProductDemo } from './ProductDemo';
import { BeforeAfter } from './BeforeAfter';
import { Features3D } from './Features3D';
import { Testimonials } from './Testimonials';
import { Pricing } from './Pricing';
import { FAQ } from './FAQ';
import { FinalCTA } from './FinalCTA';
import { CustomCursor } from './effects';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

/**
 * StoryLanding Component
 * 
 * Main storytelling landing page with scroll-driven animations.
 * Sections flow as a journey from problem to solution.
 */
export default function StoryLanding() {
    return (
        <>
            {/* Custom Cursor */}
            <CustomCursor />

            {/* Scroll Progress Bar */}
            <ScrollProgress />

            {/* Landing Navbar (clean white) */}
            <LandingNavbar />

            <main className="overflow-x-hidden">
                {/* 1. Hero - The Starting Point */}
                <StoryHero />

                {/* 2. The Problem - Why They Need This */}
                <ProblemSection />

                {/* 4. The Solution - Product Demo */}
                <ProductDemo />

                {/* 5. The Transformation - Before/After */}
                <BeforeAfter />

                {/* 6. Features Deep Dive */}
                <Features3D />

                {/* 7. Testimonials */}
                <Testimonials />

                {/* 8. Pricing */}
                <Pricing />

                {/* 9. FAQ */}
                <FAQ />

                {/* 10. Final CTA */}
                <FinalCTA />
            </main>

            {/* Footer */}
            <footer className="pt-20 pb-8 px-6 bg-slate-50 text-slate-600 relative overflow-hidden">
                <div className="container mx-auto relative z-10">
                    {/* Main Footer Content */}
                    <div className="flex flex-col lg:flex-row gap-12 mb-16">
                        {/* Left: Brand */}
                        <div className="lg:w-1/3">
                            <Link href="/" className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2F6BFF] to-[#3CE0B1] flex items-center justify-center">
                                    <Sparkles size={16} className="text-white" />
                                </div>
                                <span className="font-bold text-xl text-slate-900">
                                    Super<span className="text-[#3CE0B1]">CV</span>
                                </span>
                            </Link>
                            <p className="text-sm max-w-xs leading-relaxed">
                                The AI-powered CV optimizer that helps you land more interviews and get hired faster.
                            </p>
                        </div>

                        {/* Right: Link Columns */}
                        <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-8">
                            {/* Product */}
                            <div>
                                <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
                                <ul className="space-y-3 text-sm">
                                    <li><a href="#demo" className="hover:text-[#2F6BFF] transition-colors">How It Works</a></li>
                                    <li><a href="#features" className="hover:text-[#2F6BFF] transition-colors">Features</a></li>
                                    <li><a href="#pricing" className="hover:text-[#2F6BFF] transition-colors">Pricing</a></li>
                                    <li><a href="#faq" className="hover:text-[#2F6BFF] transition-colors">FAQ</a></li>
                                </ul>
                            </div>

                            {/* Company */}
                            <div>
                                <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
                                <ul className="space-y-3 text-sm">
                                    <li><a href="#" className="hover:text-[#2F6BFF] transition-colors">About Us</a></li>
                                    <li><a href="#" className="hover:text-[#2F6BFF] transition-colors">Blog</a></li>
                                    <li><a href="#" className="hover:text-[#2F6BFF] transition-colors">Careers</a></li>
                                    <li><a href="#" className="hover:text-[#2F6BFF] transition-colors">Contact</a></li>
                                </ul>
                            </div>

                            {/* Support */}
                            <div>
                                <h4 className="font-semibold text-slate-900 mb-4">Support</h4>
                                <ul className="space-y-3 text-sm">
                                    <li><a href="#" className="hover:text-[#2F6BFF] transition-colors">Help Center</a></li>
                                    <li><a href="#" className="hover:text-[#2F6BFF] transition-colors">Documentation</a></li>
                                    <li><a href="#" className="hover:text-[#2F6BFF] transition-colors">Privacy</a></li>
                                    <li><a href="#" className="hover:text-[#2F6BFF] transition-colors">Terms</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="text-sm text-slate-500 mb-8">
                        © 2026 Super CV - All Rights Reserved
                    </div>
                </div>

                {/* Giant Watermark Text - Below Content */}
                <div className="relative pointer-events-none select-none overflow-hidden -mb-8">
                    <div
                        className="text-[22vw] font-black leading-none tracking-tight whitespace-nowrap bg-gradient-to-t from-[#2F6BFF]/25 via-[#3CE0B1]/15 to-transparent bg-clip-text text-transparent"
                    >
                        SuperCV
                    </div>
                </div>
            </footer>
        </>
    );
}
