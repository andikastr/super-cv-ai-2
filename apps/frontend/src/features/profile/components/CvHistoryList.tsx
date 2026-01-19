"use client";

import { motion } from "framer-motion";
import { FileText, Clock, CheckCircle2, AlertCircle, Loader2, ChevronRight, TrendingUp, Sparkles } from "lucide-react";
import Link from "next/link";
import type { UserCv } from "../api/useProfile";

interface CvHistoryListProps {
    cvs: UserCv[];
    isLoading?: boolean;
}

const statusConfig = {
    PENDING: { icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", ring: "#F59E0B", label: "Pending", animate: false },
    PROCESSING: { icon: Loader2, color: "text-[#2F6BFF]", bg: "bg-[#2F6BFF]/10", ring: "#2F6BFF", label: "Processing", animate: true },
    COMPLETED: { icon: CheckCircle2, color: "text-[#3CE0B1]", bg: "bg-[#3CE0B1]/10", ring: "#3CE0B1", label: "Completed", animate: false },
    FAILED: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10", ring: "#EF4444", label: "Failed", animate: false },
};

// Animated score ring component
function ScoreRing({ score }: { score: number }) {
    const getColor = (s: number) => {
        if (s >= 80) return "#3CE0B1";
        if (s >= 60) return "#F59E0B";
        return "#EF4444";
    };

    const color = getColor(score);

    return (
        <div className="relative w-12 h-12 shrink-0">
            <svg className="w-12 h-12 -rotate-90">
                <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="4"
                />
                <motion.circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke={color}
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 126" }}
                    animate={{ strokeDasharray: `${(score / 100) * 126} 126` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />
            </svg>
            <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 flex items-center justify-center text-sm font-bold"
                style={{ color }}
            >
                {score}
            </motion.span>
        </div>
    );
}

export function CvHistoryList({ cvs, isLoading }: CvHistoryListProps) {
    if (isLoading) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg shadow-slate-200/80 border border-slate-200 dark:border-slate-800 h-full">
                <div className="flex items-center justify-center py-12">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                        <Loader2 className="text-[#2F6BFF]" size={32} />
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -2 }}
            className="group bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-lg shadow-slate-200/80 dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-800 relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[#2F6BFF]/30 h-full"
        >
            {/* Hover gradient overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2F6BFF]/5 to-[#3CE0B1]/5 rounded-2xl" />
            </div>

            {/* Decorative orb */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-[#2F6BFF]/20 to-transparent rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />

            <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2F6BFF] to-[#3CE0B1] flex items-center justify-center shadow-lg shadow-[#2F6BFF]/20"
                        >
                            <FileText size={20} className="text-white" />
                        </motion.div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">CV History</h3>
                            <p className="text-xs text-slate-500">{cvs.length} {cvs.length === 1 ? 'analysis' : 'analyses'}</p>
                        </div>
                    </div>
                    {cvs.length > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="px-2.5 py-1 bg-[#3CE0B1]/10 text-[#3CE0B1] text-xs font-bold rounded-full flex items-center gap-1"
                        >
                            <TrendingUp size={12} />
                            Active
                        </motion.span>
                    )}
                </div>

                {cvs.length === 0 ? (
                    <div className="text-center py-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#2F6BFF]/10 to-[#3CE0B1]/10 flex items-center justify-center"
                        >
                            <Sparkles size={28} className="text-[#2F6BFF]" />
                        </motion.div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Start your journey</h4>
                        <p className="text-sm text-slate-500 mb-4">Analyze your first CV to see it here</p>
                        <Link href="/app">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-5 py-2.5 bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#2F6BFF]/25"
                            >
                                Upload CV →
                            </motion.button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                        {cvs.map((cv, index) => {
                            const status = statusConfig[cv.status];
                            const StatusIcon = status.icon;
                            const uploadDate = new Date(cv.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            });
                            const rawFileName = cv.fileUrl.split(/[/\\]/).pop() || "";
                            const fileName = cv.analysisResult?.candidate_name ||
                                (rawFileName && !rawFileName.includes(":")
                                    ? rawFileName.replace(/\.pdf$/i, '')
                                    : `CV - ${uploadDate}`);
                            const score = cv.analysisResult?.overall_score;

                            return (
                                <motion.div
                                    key={cv.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link
                                        href={`/cv/${cv.id}/analyze`}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-transparent hover:border-[#2F6BFF]/20 hover:bg-white dark:hover:bg-slate-800 transition-all group/item"
                                    >
                                        {/* Score ring or status icon */}
                                        {cv.status === "COMPLETED" && score ? (
                                            <ScoreRing score={score} />
                                        ) : (
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                className={`w-12 h-12 rounded-xl ${status.bg} flex items-center justify-center shrink-0`}
                                            >
                                                <StatusIcon
                                                    size={20}
                                                    className={`${status.color} ${status.animate ? "animate-spin" : ""}`}
                                                />
                                            </motion.div>
                                        )}

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                                                {fileName}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {uploadDate}
                                            </p>
                                        </div>

                                        {/* Status badge & arrow */}
                                        <div className="flex items-center gap-2">
                                            <span className={`hidden sm:inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${status.bg} ${status.color}`}>
                                                {status.label}
                                            </span>
                                            <ChevronRight
                                                size={16}
                                                className="text-slate-300 group-hover/item:text-[#2F6BFF] group-hover/item:translate-x-1 transition-all"
                                            />
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
