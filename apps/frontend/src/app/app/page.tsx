"use client";

import { UploadSection } from "@/features/dashboard/components/UploadSection";
import { motion } from "framer-motion";
import { Sparkles, FileText, Target, Zap, CheckCircle } from "lucide-react";

const quickTips = [
    { icon: FileText, text: "Use PDF format for best results" },
    { icon: Target, text: "Tailor your CV to job descriptions" },
    { icon: Zap, text: "Get results in under 30 seconds" },
];

export default function AppHome() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Background decoration */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-[#2F6BFF]/[0.03] rounded-full blur-[200px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#3CE0B1]/[0.03] rounded-full blur-[150px]" />
            </div>

            <div className="container mx-auto px-6 pt-28 pb-16">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2F6BFF]/10 rounded-full text-[#2F6BFF] text-sm font-medium mb-4">
                            <Sparkles size={14} />
                            AI-Powered Analysis
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                            Analyze Your CV
                        </h1>
                        <p className="text-slate-600 max-w-lg mx-auto">
                            Upload your resume and get instant AI-powered feedback to improve your chances.
                        </p>
                    </div>

                    {/* Main Upload Section */}
                    <div className="mb-12">
                        <UploadSection />
                    </div>

                    {/* Quick Tips */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="bg-white rounded-2xl border border-slate-100 p-6"
                    >
                        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <CheckCircle size={16} className="text-[#3CE0B1]" />
                            Quick Tips
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {quickTips.map((tip, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 text-sm text-slate-600"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                                        <tip.icon size={16} className="text-slate-400" />
                                    </div>
                                    <span>{tip.text}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
