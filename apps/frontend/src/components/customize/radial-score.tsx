"use client";

import { motion } from "framer-motion";

interface RadialScoreProps {
  score: number;
  size?: number;
  label?: string;
}

export function RadialScore({ score, size = 160, label = "Match Score" }: RadialScoreProps) {
  const radius = size / 2 - 10; // Adjust for stroke width
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-800"
          />
          {/* Animated Progress Circle */}
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="50%"
            cy="50%"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeLinecap="round"
            className="text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="text-4xl font-bold text-white font-serif"
          >
            {score}
          </motion.span>
          <span className="text-xs uppercase tracking-wider text-slate-400 mt-1">
            / 100
          </span>
        </div>
      </div>
      
      {label && (
        <p className="mt-4 text-sm font-medium text-slate-300 uppercase tracking-widest">
          {label}
        </p>
      )}
    </div>
  );
}