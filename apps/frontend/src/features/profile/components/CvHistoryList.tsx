"use client";

import { motion } from "framer-motion";
import { FileText, Clock, CheckCircle2, AlertCircle, Loader2, ChevronRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import type { UserCv } from "../api/useProfile";

interface CvHistoryListProps {
    cvs: UserCv[];
    isLoading?: boolean;
}

const statusConfig = {
    PENDING: { icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", label: "Pending", animate: false },
    PROCESSING: { icon: Loader2, color: "text-[#2F6BFF]", bg: "bg-[#2F6BFF]/10", label: "Processing", animate: true },
    COMPLETED: { icon: CheckCircle2, color: "text-[#3CE0B1]", bg: "bg-[#3CE0B1]/10", label: "Completed", animate: false },
    FAILED: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10", label: "Failed", animate: false },
};

// Mini score ring component
function ScoreRing({ score }: { score: number }) {
    const getColor = (s: number) => {
        if (s >= 80) return "#3CE0B1";
        if (s >= 60) return "#F59E0B";
        return "#EF4444";
    };

    return (
        <div className="relative w-11 h-11 shrink-0">
            <svg className="w-11 h-11 -rotate-90">
                <circle
                    cx="22"
                    cy="22"
                    r="18"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="4"
                />
                <motion.circle
                    cx="22"
                    cy="22"
                    r="18"
                    fill="none"
                    stroke={getColor(score)}
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 113" }}
                    animate={{ strokeDasharray: `${(score / 100) * 113} 113` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300">
                {score}
            </span>
        </div>
    );
}

export function CvHistoryList({ cvs, isLoading }: CvHistoryListProps) {
    if (isLoading) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin text-[#2F6BFF]" size={32} />
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-800 relative overflow-hidden"
        >
            {/* Background decoration */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-[#2F6BFF]/5 to-[#3CE0B1]/5 rounded-full blur-2xl" />

            <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2F6BFF]/10 to-[#3CE0B1]/10 flex items-center justify-center">
                            <FileText size={20} className="text-[#2F6BFF]" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">CV History</h3>
                            <p className="text-xs text-slate-500">{cvs.length} analyses</p>
                        </div>
                    </div>
                    {cvs.length > 0 && (
                        <span className="px-2.5 py-1 bg-[#3CE0B1]/10 text-[#3CE0B1] text-xs font-bold rounded-full flex items-center gap-1">
                            <TrendingUp size={12} />
                            Active
                        </span>
                    )}
                </div>

                {cvs.length === 0 ? (
                    <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <FileText size={28} className="text-slate-400" />
                        </div>
                        <p className="font-medium mb-1">No CVs uploaded yet</p>
                        <p className="text-sm text-slate-400 mb-4">Start by analyzing your first CV</p>
                        <Link href="/app">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-4 py-2 bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] text-white text-sm font-bold rounded-xl shadow-lg"
                            >
                                Upload CV →
                            </motion.button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
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
                                        className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-[#2F6BFF]/30 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
                                    >
                                        {/* Score ring or status icon */}
                                        {cv.status === "COMPLETED" && score ? (
                                            <ScoreRing score={score} />
                                        ) : (
                                            <div className={`w-11 h-11 rounded-xl ${status.bg} flex items-center justify-center shrink-0`}>
                                                <StatusIcon
                                                    size={18}
                                                    className={`${status.color} ${status.animate ? "animate-spin" : ""}`}
                                                />
                                            </div>
                                        )}

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-slate-900 dark:text-white text-sm truncate">
                                                {fileName}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {uploadDate}
                                            </p>
                                        </div>

                                        {/* Status badge & arrow */}
                                        <div className="flex items-center gap-2">
                                            <span className={`hidden sm:inline-flex text-xs font-medium px-2 py-1 rounded-full ${status.bg} ${status.color}`}>
                                                {status.label}
                                            </span>
                                            <ChevronRight
                                                size={16}
                                                className="text-slate-300 group-hover:text-[#2F6BFF] group-hover:translate-x-1 transition-all"
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
