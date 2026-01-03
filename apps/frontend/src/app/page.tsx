"use client";

import { UploadSection } from "@/features/dashboard/components/UploadSection";
import { motion } from "framer-motion";
import { Sparkles, Shield, Zap, Target, TrendingUp, Users } from "lucide-react";


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};


const features = [
  { icon: Target, label: "ATS Score", value: "95%", desc: "Average pass rate" },
  { icon: TrendingUp, label: "Interview Rate", value: "3x", desc: "More callbacks" },
  { icon: Users, label: "Users", value: "10K+", desc: "Professionals helped" },
];

const capabilities = [
  { icon: Sparkles, title: "AI Analysis", desc: "Deep learning powered insights" },
  { icon: Shield, title: "ATS Optimized", desc: "Beat the algorithms" },
  { icon: Zap, title: "Instant Results", desc: "Analysis in seconds" },
];

export default function Home() {
  return (
    <div className="relative min-h-screen p-4 md:p-8 overflow-hidden">

      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-indigo-500/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-champagne-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/3 rounded-full blur-[200px]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >

        <motion.div variants={itemVariants} className="text-center mb-12 pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-champagne-500/10 border border-champagne-500/20 rounded-full text-champagne-400 text-sm font-medium mb-6">
            <Sparkles size={14} />
            AI-Powered Resume Intelligence
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-white mb-6">
            Architect Your{" "}
            <span className="text-gradient-gold">
              Career Legacy
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Stop guessing. Start dominating. The world's most advanced AI resume strategist,
            calibrated for ambitious professionals.
          </p>
        </motion.div>


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">


          <motion.div
            variants={itemVariants}
            className="lg:col-span-8"
          >
            <UploadSection />
          </motion.div>


          <motion.div
            variants={itemVariants}
            className="lg:col-span-4 flex flex-col gap-4"
          >

            {features.map((feature, idx) => (
              <motion.div
                key={feature.label}
                variants={itemVariants}
                className="glass-panel-hover rounded-2xl p-5 flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-champagne-400/20 to-orange-500/10 rounded-xl flex items-center justify-center border border-champagne-500/20">
                  <feature.icon size={20} className="text-champagne-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white tabular-nums">{feature.value}</span>
                    <span className="text-xs text-slate-500 uppercase tracking-wider">{feature.label}</span>
                  </div>
                  <p className="text-sm text-slate-400">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>


          {capabilities.map((cap) => (
            <motion.div
              key={cap.title}
              variants={itemVariants}
              className="lg:col-span-4 glass-panel rounded-2xl p-6 group hover:border-white/10 transition-all"
            >
              <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gradient-to-br group-hover:from-champagne-400/20 group-hover:to-orange-500/10 transition-all border border-white/5">
                <cap.icon size={18} className="text-slate-400 group-hover:text-champagne-400 transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{cap.title}</h3>
              <p className="text-sm text-slate-400">{cap.desc}</p>
            </motion.div>
          ))}
        </div>


        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-6 mt-12 flex-wrap"
        >
          {["ATS Optimized", "Recruiter Approved", "AI Powered", "GDPR Compliant"].map((badge, idx) => (
            <div
              key={badge}
              className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-widest font-medium"
            >
              <div className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full" />
              {badge}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}