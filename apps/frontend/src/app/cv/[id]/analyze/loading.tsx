"use client";

import { motion } from "framer-motion";
import { Brain, ScanSearch, Target, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

const analysisSteps = [
    { icon: ScanSearch, text: "Scanning structure", duration: 2000 },
    { icon: Target, text: "Matching keywords", duration: 3000 },
    { icon: Sparkles, text: "Generating insights", duration: 4000 },
    { icon: Brain, text: "Building recommendations", duration: 5000 },
];

export default function AnalyzeLoading() {
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);

    // Simulate step progression
    useEffect(() => {
        const stepInterval = setInterval(() => {
            setCurrentStep((prev) => {
                if (prev < analysisSteps.length - 1) {
                    return prev + 1;
                }
                return prev;
            });
        }, 2500);

        return () => clearInterval(stepInterval);
    }, []);

    // Simulate progress
    useEffect(() => {
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev < 95) {
                    return prev + Math.random() * 3;
                }
                return prev;
            });
        }, 200);

        return () => clearInterval(progressInterval);
    }, []);

    return (
        <div className="fixed inset-0 bg-gradient-to-b from-slate-50 to-white z-[100] flex flex-col items-center justify-center overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)`,
                        backgroundSize: '32px 32px',
                    }}
                />

                {/* Animated orbs */}
                <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#2F6BFF]/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-[#3CE0B1]/10 rounded-full blur-[100px]"
                />
            </div>

            <div className="relative z-10 flex flex-col items-center max-w-md mx-auto px-6">
                {/* Animated brain icon */}
                <div className="relative mb-10">
                    {/* Outer rotating ring */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 w-32 h-32"
                    >
                        <div className="absolute top-0 left-1/2 w-1 h-8 bg-gradient-to-b from-[#2F6BFF] to-transparent -translate-x-1/2 rounded-full" />
                        <div className="absolute bottom-0 left-1/2 w-1 h-8 bg-gradient-to-t from-[#3CE0B1] to-transparent -translate-x-1/2 rounded-full" />
                    </motion.div>

                    {/* Pulsing ring */}
                    <motion.div
                        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 w-32 h-32 border-2 border-[#2F6BFF]/40 rounded-full"
                    />

                    {/* Main brain circle */}
                    <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="relative w-32 h-32 bg-gradient-to-br from-[#2F6BFF] via-[#5B8EFF] to-[#3CE0B1] rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(47,107,255,0.4)]"
                    >
                        {/* Inner spinning ring */}
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-3 border-2 border-white/20 rounded-full border-t-white/60 border-r-white/40"
                        />
                        <Brain size={44} className="text-white relative z-10" />
                    </motion.div>
                </div>

                {/* Title and description */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-8"
                >
                    <h2 className="text-3xl font-bold text-slate-900 mb-3">
                        Analyzing Your CV
                    </h2>
                    <p className="text-slate-500 text-base">
                        This usually takes about 30 seconds
                    </p>
                </motion.div>

                {/* Progress bar */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full mb-8"
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600">Progress</span>
                        <span className="text-sm font-bold text-[#2F6BFF]">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                            className="h-full bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] rounded-full relative"
                        >
                            {/* Shimmer effect */}
                            <motion.div
                                animate={{ x: ["-100%", "200%"] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            />
                        </motion.div>
                    </div>
                </motion.div>

                {/* Step indicators */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="w-full space-y-3"
                >
                    {analysisSteps.map((step, i) => {
                        const isCompleted = i < currentStep;
                        const isActive = i === currentStep;
                        const isPending = i > currentStep;

                        return (
                            <motion.div
                                key={step.text}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                                className={`flex items-center gap-4 px-5 py-3 rounded-xl border transition-all duration-300 ${isCompleted
                                        ? "bg-[#3CE0B1]/10 border-[#3CE0B1]/30"
                                        : isActive
                                            ? "bg-[#2F6BFF]/10 border-[#2F6BFF]/30 shadow-md"
                                            : "bg-slate-50 border-slate-100"
                                    }`}
                            >
                                {/* Status icon */}
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isCompleted
                                        ? "bg-[#3CE0B1]"
                                        : isActive
                                            ? "bg-[#2F6BFF]"
                                            : "bg-slate-200"
                                    }`}>
                                    {isCompleted ? (
                                        <CheckCircle2 size={18} className="text-white" />
                                    ) : isActive ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        >
                                            <Loader2 size={18} className="text-white" />
                                        </motion.div>
                                    ) : (
                                        <step.icon size={18} className="text-slate-400" />
                                    )}
                                </div>

                                {/* Step text */}
                                <span className={`text-sm font-medium flex-1 ${isCompleted
                                        ? "text-[#3CE0B1]"
                                        : isActive
                                            ? "text-[#2F6BFF]"
                                            : "text-slate-400"
                                    }`}>
                                    {step.text}
                                </span>

                                {/* Status indicator */}
                                {isCompleted && (
                                    <span className="text-xs text-[#3CE0B1] font-medium">Done</span>
                                )}
                                {isActive && (
                                    <motion.span
                                        animate={{ opacity: [1, 0.5, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        className="text-xs text-[#2F6BFF] font-medium"
                                    >
                                        Processing...
                                    </motion.span>
                                )}
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Fun fact / tip */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-8 text-center"
                >
                    <p className="text-xs text-slate-400">
                        💡 Tip: Tailoring your CV to each job description can increase your callback rate by 3x
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
