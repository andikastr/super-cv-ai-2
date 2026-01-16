"use client";

import { motion } from "framer-motion";
import { Coins, Sparkles, Zap, Plus } from "lucide-react";
import Link from "next/link";

interface CreditsCardProps {
    credits: number;
}

export function CreditsCard({ credits }: CreditsCardProps) {
    const maxCredits = 10; // Visual max for the progress display
    const percentage = Math.min((credits / maxCredits) * 100, 100);

    const getCreditsColor = () => {
        if (credits >= 5) return { gradient: "from-[#3CE0B1] to-[#2F6BFF]", text: "text-[#3CE0B1]" };
        if (credits >= 2) return { gradient: "from-[#2F6BFF] to-[#3CE0B1]", text: "text-[#2F6BFF]" };
        if (credits >= 1) return { gradient: "from-amber-400 to-orange-500", text: "text-amber-500" };
        return { gradient: "from-red-500 to-pink-500", text: "text-red-500" };
    };

    const colors = getCreditsColor();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-800 relative overflow-hidden"
        >
            {/* Background decoration */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-[#2F6BFF]/5 to-[#3CE0B1]/5 rounded-full blur-2xl" />

            <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2F6BFF]/10 to-[#3CE0B1]/10 flex items-center justify-center">
                            <Coins size={20} className="text-[#2F6BFF]" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Credits</h3>
                            <p className="text-xs text-slate-500">CV analysis tokens</p>
                        </div>
                    </div>
                </div>

                {/* Credits display */}
                <div className="flex items-baseline gap-2 mb-4">
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`text-4xl font-bold ${colors.text}`}
                    >
                        {credits}
                    </motion.span>
                    <span className="text-slate-400 font-medium">credits left</span>
                </div>

                {/* Progress bar */}
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-full bg-gradient-to-r ${colors.gradient} rounded-full relative`}
                    >
                        <motion.div
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        />
                    </motion.div>
                </div>

                {/* Info & CTA */}
                {credits > 0 ? (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                            <Sparkles size={14} className="text-[#3CE0B1]" />
                            1 credit = 1 CV analysis
                        </p>
                        <Link href="/pricing">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#2F6BFF] hover:bg-[#2F6BFF]/10 rounded-lg transition-colors"
                            >
                                <Plus size={14} />
                                Get More
                            </motion.button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <p className="text-sm text-red-500 flex items-center gap-1.5">
                            <Zap size={14} />
                            No credits remaining
                        </p>
                        <Link href="/pricing">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-2.5 bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                            >
                                <Zap size={16} />
                                Get More Credits
                            </motion.button>
                        </Link>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
