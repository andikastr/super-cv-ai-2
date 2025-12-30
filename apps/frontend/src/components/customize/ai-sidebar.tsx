"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, Check, ArrowRight } from "lucide-react";
import { useCv } from "@/lib/cv-context"; 
import { useState } from "react";
import { cn } from "@/lib/utils";
import { RadialScore } from "./radial-score"; // Pastikan path ini benar sesuai struktur folder Anda

export function AiSidebar({ analysis }: { analysis: any }) {
  const { cvData, applySuggestion } = useCv();
  
  // Logic Cerdas: Membuat saran berdasarkan Data Analisis
  const generateSuggestions = () => {
    const items = [];

    // 1. Suggestion Summary (Premium)
    // Kita cek apakah summary saat ini terlalu pendek?
    const currentSummaryLen = cvData?.professional_summary?.length || 0;
    
    items.push({
      id: "summary-opt",
      type: "premium",
      title: "Professional Summary",
      desc: currentSummaryLen < 50 
        ? "Summary Anda kosong/pendek. Gunakan versi AI ini." 
        : "AI menyarankan summary yang lebih kuat & impact-oriented.",
      actionLabel: "Rewrite Summary",
      // Content ini nanti bisa diganti dynamic jika backend support 'suggested_summary' di endpoint analyze
      content: `Results-driven professional with strong expertise in ${cvData?.hard_skills.slice(0,2).join(" & ") || "Technology"}. Proven track record of delivering scalable solutions and optimizing performance.`
    });

    // 2. Missing Skills (Critical)
    // Analisis AI biasanya mengembalikan string di skill_detail, misal: "Good match but missing: Docker, AWS."
    if (analysis?.skill_detail && (analysis.skill_detail.toLowerCase().includes("missing") || analysis.skill_detail.toLowerCase().includes("lacking"))) {
       // Teknik Regex sederhana untuk ambil kata setelah 'missing'
       const parts = analysis.skill_detail.split(/missing|lacking/i);
       if (parts[1]) {
           const missingRaw = parts[1].split('.')[0]; // Ambil kalimat pertama saja
           // Bersihkan array
           const newSkills = missingRaw.split(/,|and/).map((s:string) => s.trim().replace(/[^a-zA-Z0-9 +.#]/g, "")).filter((s:string) => s.length > 2);
           
           if (newSkills.length > 0) {
             items.push({
                id: "skill-sync",
                type: "critical",
                title: "Sync Missing Skills",
                desc: `Tambahkan skill wajib dari JD: ${newSkills.join(", ")}`,
                actionLabel: "Add All Skills",
                content: newSkills // Array skill baru
             });
           }
       }
    }

    return items;
  };

  const suggestions = generateSuggestions();

  return (
    <aside className="h-full flex flex-col border-l border-white/5 bg-slate-900/40 backdrop-blur-2xl relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] -z-10 pointer-events-none"/>

      {/* Header Score */}
      <div className="p-8 border-b border-white/5 flex flex-col items-center relative">
        <RadialScore score={analysis?.overall_score || 0} size={150} />
        <div className="absolute top-6 right-6">
            <div className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded text-[10px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1">
                <Zap size={10} fill="currentColor" /> AI Pro
            </div>
        </div>
      </div>

      {/* List Suggestion */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Optimization Queue</h3>
            <span className="text-xs bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded-full border border-white/5">{suggestions.length}</span>
        </div>

        <div className="space-y-4">
            {suggestions.map((item, i) => (
                <SuggestionCard 
                    key={item.id} 
                    item={item} 
                    index={i} 
                    onApply={(content) => {
                        if (item.id === 'summary-opt') applySuggestion('summary', content);
                        if (item.id === 'skill-sync') applySuggestion('skills', content);
                    }}
                />
            ))}
        </div>
      </div>
    </aside>
  );
}

function SuggestionCard({ item, index, onApply }: { item: any, index: number, onApply: (c:any) => void }) {
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
      setApplied(true);
      onApply(item.content); // Panggil Context
      setTimeout(() => setApplied(false), 3000); // Reset tombol setelah 3 detik
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
          "p-5 rounded-xl border transition-all relative overflow-hidden group",
          item.type === 'critical' ? "bg-rose-500/5 border-rose-500/20 hover:border-rose-500/40" : "bg-slate-800/40 border-white/5 hover:border-amber-500/30"
      )}
    >
      <div className="flex gap-4">
        <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
            item.type === 'critical' ? "bg-rose-500/10 text-rose-400" : "bg-amber-500/10 text-amber-400"
        )}>
            {item.type === 'critical' ? <Zap size={18} /> : <Sparkles size={18} />}
        </div>
        
        <div className="flex-1">
            <h4 className="text-sm font-bold text-slate-200">{item.title}</h4>
            <p className="text-xs text-slate-400 mt-1 mb-4 leading-relaxed">{item.desc}</p>

            <button 
                onClick={handleApply}
                disabled={applied}
                className={cn(
                    "w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all",
                    applied 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default"
                        : "bg-white text-slate-900 hover:bg-amber-400 hover:scale-[1.02] shadow-lg shadow-black/20"
                )}
            >
                {applied ? <><Check size={14} /> Applied</> : <>{item.actionLabel} <ArrowRight size={12} /></>}
            </button>
        </div>
      </div>
    </motion.div>
  );
}