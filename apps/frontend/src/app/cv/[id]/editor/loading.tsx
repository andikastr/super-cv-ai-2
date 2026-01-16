"use client";

import { motion } from "framer-motion";
import { FileEdit, Wand2, Layout, Type, Palette, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

const features = [
    { icon: Wand2, label: "AI Suggestions", delay: 0 },
    { icon: Layout, label: "Smart Layout", delay: 0.2 },
    { icon: Type, label: "Typography", delay: 0.4 },
    { icon: Palette, label: "Color Themes", delay: 0.6 },
];

const steps = [
    "Initializing editor",
    "Loading your CV data",
    "Preparing AI suggestions",
    "Ready to edit!",
];

export default function EditorLoading() {
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);

    // Simulate step progression
    useEffect(() => {
        const stepInterval = setInterval(() => {
            setCurrentStep((prev) => {
                if (prev < steps.length - 1) {
                    return prev + 1;
                }
                return prev;
            });
        }, 1500);

        return () => clearInterval(stepInterval);
    }, []);

    // Simulate progress
    useEffect(() => {
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev < 95) {
                    return prev + Math.random() * 4;
                }
                return prev;
            });
        }, 150);

        return () => clearInterval(progressInterval);
    }, []);

    return (
        <div className="fixed inset-0 bg-gradient-to-b from-slate-50 to-white z-[100] flex flex-col items-center justify-center overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)`,
                        backgroundSize: '32px 32px',
                    }}
                />

                {/* Animated gradient orb */}
                <motion.div
                    animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360], opacity: [0.15, 0.25, 0.15] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-conic from-[#2F6BFF]/10 via-[#3CE0B1]/5 to-[#2F6BFF]/10 rounded-full blur-[100px]"
                />

                <motion.div
                    animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#3CE0B1]/10 rounded-full blur-[80px]"
                />
            </div>

            <div className="relative z-10 flex flex-col items-center max-w-md mx-auto px-6">
                {/* Floating document illustration */}
                <motion.div
                    animate={{ rotateY: [-10, 10, -10], rotateX: [5, -5, 5] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative mb-10"
                    style={{ perspective: 1000 }}
                >
                    {/* Glow behind */}
                    <div className="absolute inset-0 w-36 h-44 bg-gradient-to-br from-[#2F6BFF]/30 to-[#3CE0B1]/30 rounded-2xl blur-2xl" />

                    {/* Document card */}
                    <div className="relative w-36 h-44 bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
                        {/* Header bar */}
                        <div className="h-8 bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] flex items-center px-3 gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-white/30" />
                            <div className="w-2 h-2 rounded-full bg-white/30" />
                            <div className="w-2 h-2 rounded-full bg-white/30" />
                        </div>

                        {/* Animated lines */}
                        <div className="flex-1 p-4 space-y-2">
                            <motion.div animate={{ width: ["60%", "80%", "60%"] }} transition={{ duration: 2, repeat: Infinity }} className="h-2 bg-slate-100 rounded" />
                            <motion.div animate={{ width: ["80%", "50%", "80%"] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }} className="h-2 bg-slate-100 rounded" />
                            <motion.div animate={{ width: ["50%", "70%", "50%"] }} transition={{ duration: 2.2, repeat: Infinity, delay: 0.6 }} className="h-2 bg-slate-100 rounded" />
                            <motion.div animate={{ width: ["70%", "40%", "70%"] }} transition={{ duration: 1.8, repeat: Infinity, delay: 0.9 }} className="h-2 bg-slate-100 rounded" />
                        </div>

                        {/* Sparkle animation */}
                        <motion.div
                            animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                            className="absolute bottom-4 right-4"
                        >
                            <Sparkles size={20} className="text-[#2F6BFF]" />
                        </motion.div>
                    </div>

                    {/* Floating edit badge */}
                    <motion.div
                        animate={{ y: [-5, 5, -5], rotate: [0, 10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-[#2F6BFF] to-[#3CE0B1] rounded-xl flex items-center justify-center shadow-lg shadow-[#2F6BFF]/30"
                    >
                        <FileEdit size={24} className="text-white" />
                    </motion.div>
                </motion.div>

                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mb-8"
                >
                    <h2 className="text-3xl font-bold text-slate-900 mb-3">
                        Preparing Your Editor
                    </h2>
                    <p className="text-slate-500 text-base">
                        Setting up your professional workspace
                    </p>
                </motion.div>

                {/* Progress bar */}
                <div className="w-full mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600">{steps[currentStep]}</span>
                        <span className="text-sm font-bold text-[#2F6BFF]">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] rounded-full relative"
                        >
                            <motion.div
                                animate={{ x: ["-100%", "200%"] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                            />
                        </motion.div>
                    </div>
                </div>

                {/* Feature icons */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    {features.map((feature, i) => {
                        const isActive = i <= currentStep;
                        return (
                            <motion.div
                                key={feature.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + feature.delay }}
                                className="flex flex-col items-center gap-2"
                            >
                                <motion.div
                                    animate={isActive ? {
                                        scale: [1, 1.1, 1],
                                        boxShadow: ["0 0 0 rgba(47,107,255,0)", "0 0 20px rgba(47,107,255,0.4)", "0 0 0 rgba(47,107,255,0)"]
                                    } : {}}
                                    transition={{ duration: 2, repeat: Infinity, delay: feature.delay }}
                                    className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-300 ${isActive
                                            ? "bg-gradient-to-br from-[#2F6BFF]/10 to-[#3CE0B1]/10 border-[#2F6BFF]/30"
                                            : "bg-slate-50 border-slate-200"
                                        }`}
                                >
                                    <feature.icon
                                        size={20}
                                        className={isActive ? "text-[#2F6BFF]" : "text-slate-300"}
                                    />
                                </motion.div>
                                <span className={`text-[10px] font-medium uppercase tracking-wider transition-colors ${isActive ? "text-[#2F6BFF]" : "text-slate-400"
                                    }`}>
                                    {feature.label}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Step indicators */}
                <div className="flex items-center gap-2">
                    {steps.map((step, i) => (
                        <motion.div
                            key={step}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.8 + i * 0.1 }}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${i < currentStep ? "bg-[#3CE0B1]" :
                                    i === currentStep ? "bg-[#2F6BFF] w-6" :
                                        "bg-slate-200"
                                }`}
                        />
                    ))}
                </div>

                {/* Fun tip */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="text-xs text-slate-400 mt-8 text-center"
                >
                    💡 Tip: Use our AI suggestions to optimize each section of your CV
                </motion.p>
            </div>
        </div>
    );
}
