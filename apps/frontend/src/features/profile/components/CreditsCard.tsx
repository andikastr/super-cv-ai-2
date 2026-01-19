"use client";

import { motion } from "framer-motion";
import { Coins, Sparkles, Zap, Plus, Gift, ArrowRight } from "lucide-react";
import Link from "next/link";

interface CreditsCardProps {
    credits: number;
}

export function CreditsCard({ credits }: CreditsCardProps) {
    const maxCredits = 10;
    const percentage = Math.min((credits / maxCredits) * 100, 100);

    const getCreditsColor = () => {
        if (credits >= 5) return { gradient: "from-[#3CE0B1] to-[#2F6BFF]", text: "text-[#3CE0B1]", glow: "shadow-[#3CE0B1]/20" };
        if (credits >= 2) return { gradient: "from-[#2F6BFF] to-[#3CE0B1]", text: "text-[#2F6BFF]", glow: "shadow-[#2F6BFF]/20" };
        if (credits >= 1) return { gradient: "from-amber-400 to-orange-500", text: "text-amber-500", glow: "shadow-amber-500/20" };
        return { gradient: "from-slate-400 to-slate-500", text: "text-slate-500", glow: "shadow-slate-500/20" };
    };

    const colors = getCreditsColor();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -2 }}
            className="group bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-lg shadow-slate-200/80 dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-800 relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[#3CE0B1]/30 h-full"
        >
            {/* Animated gradient background on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-[#3CE0B1]/5 to-[#2F6BFF]/5 rounded-2xl" />
            </div>

            {/* Decorative orb */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-[#3CE0B1]/20 to-transparent rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />

            <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: -5 }}
                            className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#3CE0B1] to-[#2F6BFF] flex items-center justify-center shadow-lg shadow-[#3CE0B1]/20"
                        >
                            <Coins size={20} className="text-white" />
                        </motion.div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Credits</h3>
                            <p className="text-xs text-slate-500">Analysis tokens</p>
                        </div>
                    </div>
                </div>

                {credits > 0 ? (
                    <>
                        {/* Credits display */}
                        <div className="flex items-baseline gap-2 mb-4">
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className={`text-5xl font-bold ${colors.text}`}
                            >
                                {credits}
                            </motion.span>
                            <span className="text-slate-400 font-medium">credits left</span>
                        </div>

                        {/* Progress bar */}
                        <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className={`h-full bg-gradient-to-r ${colors.gradient} rounded-full relative`}
                            >
                                <motion.div
                                    animate={{ x: ["-100%", "200%"] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                                />
                            </motion.div>
                        </div>

                        {/* Info */}
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                                <Sparkles size={14} className="text-[#3CE0B1]" />
                                1 credit = 1 analysis
                            </p>
                            <Link href="/pricing">
                                <motion.button
                                    whileHover={{ scale: 1.05, x: 2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-1 text-xs font-semibold text-[#2F6BFF] hover:text-[#3CE0B1] transition-colors"
                                >
                                    <Plus size={14} />
                                    Get More
                                </motion.button>
                            </Link>
                        </div>
                    </>
                ) : (
                    /* Empty credits state - opportunity, not alarm */
                    <div className="text-center py-2">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#2F6BFF]/10 to-[#3CE0B1]/10 flex items-center justify-center"
                        >
                            <Gift size={28} className="text-[#2F6BFF]" />
                        </motion.div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                            Ready for more?
                        </h4>
                        <p className="text-sm text-slate-500 mb-4">
                            Get credits to analyze more CVs
                        </p>
                        <Link href="/pricing">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-3 bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#2F6BFF]/25 hover:shadow-xl hover:shadow-[#2F6BFF]/30 transition-all flex items-center justify-center gap-2 group"
                            >
                                <Zap size={16} />
                                Get Credits
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </Link>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
