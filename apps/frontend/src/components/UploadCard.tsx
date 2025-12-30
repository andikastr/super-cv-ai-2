"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, Link as LinkIcon, Sparkles, Loader2, CheckCircle2, AlertCircle, ArrowRight, Layout, PenTool, BrainCircuit, Target, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCv } from "@/lib/cv-context"; 
import { CvEditor } from "@/components/customize/cv-editor";
// 1. IMPORT SIDEBAR SUGGESTION
import { SuggestionSidebar } from "@/components/customize/suggestion-sidebar";

// --- INTERFACE ---
interface AnalysisData {
  candidate_name: string;
  overall_score: number;
  overall_summary: string;
  writing_score: number;
  writing_detail: string;
  ats_score: number; 
  ats_detail: string;
  skill_score: number;
  skill_detail: string;
  experience_score: number;
  experience_detail: string;
  keyword_score: number;
  key_strengths: string[];
  missing_skills: string[];
}

export function UploadCard() {
  const [viewState, setViewState] = useState<"UPLOAD" | "ANALYSIS" | "EDITOR">("UPLOAD");
  
  const [activeTab, setActiveTab] = useState<"text" | "link" | "general">("text");
  const [file, setFile] = useState<File | null>(null);
  const [jobText, setJobText] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null);
  
  // 2. STATE BARU: OPTIMIZED RESULT (Untuk Sidebar)
  const [optimizedResult, setOptimizedResult] = useState<any>(null);

  const { setCvData } = useCv();
  
  const [customizeMode, setCustomizeMode] = useState<"analysis" | "job_desc">("analysis");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return alert("Please upload a CV PDF first.");

    setIsUploading(true);
    setLoadingText("Deep Analysis (6-Point Check)...");

    const formData = new FormData();
    formData.append("file", file);
    
    if (activeTab === "text" && jobText) formData.append("job_description", jobText);
    if (activeTab === "link" && jobUrl) formData.append("job_url", jobUrl);

    try {
      const res = await fetch("http://localhost:8000/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Analysis failed");

      const data = await res.json();
      setAnalysisResult(data);
      setViewState("ANALYSIS"); 

    } catch (error: any) {
      console.error(error);
      alert(`Error: ${error.message}`);
      setFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  // --- 3. REVISI HANDLE CUSTOMIZE ---
  const handleCustomize = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setLoadingText("AI is drafting improvements..."); // Ubah teks agar user paham ini draft

    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", customizeMode);

    if (customizeMode === "job_desc") {
        formData.append("job_description", jobText || "General Role"); 
    } else {
        if (analysisResult) {
            formData.append("analysis_context", JSON.stringify(analysisResult));
        }
    }

    try {
      const res = await fetch("http://localhost:8000/api/customize", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Customize failed");

      const newData = await res.json();
      
      // LOGIC PENTING:
      // Kita simpan hasil AI ke state 'optimizedResult' untuk Sidebar
      setOptimizedResult(newData);
      
      // Kita juga set ke Editor agar tidak blank. 
      // (Sidebar nanti akan memberi kesan 'Review Mode')
      setCvData(newData); 
      
      setViewState("EDITOR");

    } catch (error: any) {
      console.error(error);
      alert("Failed to generate CV");
    } finally {
      setIsUploading(false);
    }
  };

  // VIEW 1 & 2 (UPLOAD & ANALYSIS) - TIDAK BERUBAH (Sama seperti kode Anda)
  // Saya persingkat di sini agar fokus ke perbaikan VIEW 3
  if (viewState === "UPLOAD") { /* ...Kode View Upload Anda... */ return renderUploadView(); }
  if (viewState === "ANALYSIS" && analysisResult) { /* ...Kode View Analysis Anda... */ return renderAnalysisView(); }

  // =========================================================
  // VIEW 3: EDITOR DENGAN SIDEBAR SUGGESTION (PERBAIKAN)
  // =========================================================
  if (viewState === "EDITOR") {
      return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col lg:flex-row gap-6 items-start h-screen lg:h-auto lg:min-h-screen">
              
              {/* KIRI: SUGGESTION SIDEBAR (Hanya muncul jika ada hasil AI) */}
              {optimizedResult && (
                 <motion.div 
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="w-full lg:w-[400px] bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl sticky top-4 max-h-[calc(100vh-2rem)] flex flex-col z-20"
                 >
                    <SuggestionSidebar 
                        optimizedData={optimizedResult}
                        analysisData={analysisResult}
                        onClose={() => setOptimizedResult(null)} // Tombol close untuk 'Accept All'
                    />
                 </motion.div>
              )}

              {/* KANAN: MAIN EDITOR */}
              <div className="flex-1 w-full min-w-0">
                  <div className="flex justify-between items-center mb-4">
                      <button onClick={() => setViewState("ANALYSIS")} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5">
                        <ChevronLeft size={16}/> Back to Analysis
                      </button>
                      
                      {/* Status Indicator */}
                      {optimizedResult ? (
                          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide flex items-center gap-2 animate-pulse">
                            <Sparkles size={14}/> REVIEWING AI DRAFT
                          </div>
                      ) : (
                          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide flex items-center gap-2">
                            <CheckCircle2 size={14}/> EDITED
                          </div>
                      )}
                  </div>
                  
                  {/* Editor */}
                  <CvEditor />
              </div>
          </motion.div>
      )
  }

  return null;

  // --- HELPER RENDERS (Copy Paste kode View 1 & 2 Anda kesini) ---
  function renderUploadView() {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full glass rounded-3xl p-1">
             {/* ... Copy paste isi return VIEW 1 Anda ... */}
             <div className="bg-slate-950/50 rounded-[22px] p-6 md:p-8 border border-white/5">
                <div className="flex space-x-1 bg-slate-900/80 p-1 rounded-xl mb-8">
                     {(["text", "link", "general"] as const).map((tab) => (
                      <button key={tab} onClick={() => setActiveTab(tab)} className={cn("flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all relative", activeTab === tab ? "text-amber-400" : "text-slate-400 hover:text-slate-200")}>
                        {activeTab === tab && (<motion.div layoutId="activeTab" className="absolute inset-0 bg-white/5 border border-white/10 rounded-lg shadow-sm" />)}
                        <span className="relative z-10 capitalize flex items-center gap-2">
                          {tab === "text" && <FileText size={16} />} {tab === "link" && <LinkIcon size={16} />} {tab === "general" && <Sparkles size={16} />} {tab}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                     <div className="relative border-2 border-dashed border-slate-700 hover:border-amber-500/50 hover:bg-slate-800/30 rounded-2xl h-64 flex flex-col items-center justify-center transition-all group overflow-hidden">
                        <input type="file" accept=".pdf,.docx" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        {file ? (
                             <div className="text-center p-4"><div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4 mx-auto border border-emerald-500/20"><FileText size={32} /></div><p className="text-emerald-400 font-medium truncate max-w-[200px]">{file.name}</p><p className="text-slate-500 text-xs mt-1">Ready to analyze</p></div>
                        ) : (
                             <><div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xl shadow-black/50 border border-white/5"><UploadCloud className="text-amber-500 w-8 h-8" /></div><p className="text-slate-300 font-medium">Upload Resume (PDF/DOCX)</p><p className="text-slate-500 text-xs mt-2">Max 5MB</p></>
                        )}
                     </div>
                     <div className="flex flex-col h-64">
                        <label className="text-xs uppercase tracking-wider text-slate-500 mb-3 font-semibold flex items-center gap-2"><Target size={12}/> Target Job Context</label>
                        <div className="flex-1">
                            {activeTab === "text" && <textarea className="w-full h-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-sm text-slate-200 focus:border-amber-500/50 focus:ring-0 resize-none placeholder:text-slate-600" placeholder="Paste job description here..." value={jobText} onChange={(e) => setJobText(e.target.value)} />}
                            {activeTab === "link" && <input type="url" className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-sm text-slate-200 focus:border-amber-500/50 placeholder:text-slate-600" placeholder="Paste LinkedIn/JobStreet URL..." value={jobUrl} onChange={(e) => setJobUrl(e.target.value)} />}
                            {activeTab === "general" && <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm border border-white/5 rounded-xl bg-slate-900/30 px-6 text-center"><Sparkles className="text-amber-500/50 mb-2" size={24}/><p>We will check for general best practices and red flags.</p></div>}
                        </div>
                        <button onClick={handleAnalyze} disabled={isUploading || !file} className="mt-4 w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                             {isUploading ? <><Loader2 className="animate-spin" /> {loadingText}</> : <><Sparkles size={18} /> Deep Analyze</>}
                        </button>
                     </div>
                  </div>
             </div>
        </motion.div>
    )
  }

  function renderAnalysisView() {
    if (!analysisResult) return null;
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
            {/* ... Copy paste isi return VIEW 2 Anda ... */}
             <div className="bg-slate-950/80 border border-white/10 p-6 rounded-[22px] mb-6 flex flex-col md:flex-row justify-between items-center gap-6 backdrop-blur-md">
                <div><h2 className="text-2xl font-bold text-white flex items-center gap-2 font-serif">Analysis Report <span className="text-slate-500 text-lg font-sans font-normal">for {analysisResult.candidate_name}</span></h2><p className="text-slate-400 mt-2 text-sm max-w-2xl leading-relaxed">{analysisResult.overall_summary}</p></div>
                <div className="text-center min-w-[120px]"><div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Total Score</div><div className={`text-6xl font-black ${getScoreColor(analysisResult.overall_score)}`}>{analysisResult.overall_score}</div></div>
             </div>
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DarkScoreCard icon={<PenTool/>} label="Writing Style" score={analysisResult.writing_score} detail={analysisResult.writing_detail} />
                        <DarkScoreCard icon={<Layout/>} label="ATS Format" score={analysisResult.ats_score} detail={analysisResult.ats_detail} />
                        <DarkScoreCard icon={<BrainCircuit/>} label="Skill Match" score={analysisResult.skill_score} detail={analysisResult.skill_detail} />
                        <DarkScoreCard icon={<Target/>} label="Experience" score={analysisResult.experience_score} detail={analysisResult.experience_detail} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="bg-emerald-950/10 border border-emerald-500/20 p-5 rounded-2xl"><h4 className="font-bold text-emerald-400 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider"><Sparkles size={14}/> Key Strengths</h4><ul className="space-y-2">{analysisResult.key_strengths?.length > 0 ? analysisResult.key_strengths.map((s,i)=>(<li key={i} className="text-sm text-emerald-200/70 flex gap-2 items-start"><CheckCircle2 size={14} className="mt-0.5 shrink-0"/> {s}</li>)) : <li className="text-sm text-slate-500">No major strengths found.</li>}</ul></div>
                         <div className="bg-red-950/10 border border-red-500/20 p-5 rounded-2xl"><h4 className="font-bold text-red-400 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider"><AlertCircle size={14}/> Critical Gaps</h4><ul className="space-y-2">{analysisResult.missing_skills?.length > 0 ? analysisResult.missing_skills.map((s,i)=>(<li key={i} className="text-sm text-red-200/70 flex gap-2 items-start"><AlertCircle size={14} className="mt-0.5 shrink-0"/> {s}</li>)) : <li className="text-sm text-slate-500">No critical gaps.</li>}</ul></div>
                    </div>
                </div>
                <div className="lg:col-span-4">
                    <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/20 p-6 rounded-[22px] sticky top-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Sparkles className="text-amber-500" size={20} /> AI Optimization</h3>
                        <div className="flex bg-slate-950 p-1 rounded-lg mb-4 border border-white/5">
                            <button onClick={() => setCustomizeMode("analysis")} className={cn("flex-1 py-2 text-xs font-bold rounded-md transition-all", customizeMode==='analysis' ? "bg-amber-500/20 text-amber-400" : "text-slate-500 hover:text-slate-300")}>Based on Analysis</button>
                            <button onClick={() => setCustomizeMode("job_desc")} className={cn("flex-1 py-2 text-xs font-bold rounded-md transition-all", customizeMode==='job_desc' ? "bg-blue-500/20 text-blue-400" : "text-slate-500 hover:text-slate-300")}>Based on Job Desc</button>
                        </div>
                        <div className="mb-6">{customizeMode === 'analysis' ? (<div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl text-sm text-amber-200/60"><p className="mb-2 font-semibold text-amber-400">Fixing Strategy:</p><ul className="list-disc ml-4 space-y-1 text-xs"><li>Inject missing skills: <b>{analysisResult.missing_skills?.[0] || "Found gaps"}</b></li><li>Fix writing tone (Score: {analysisResult.writing_score})</li><li>Apply Google XYZ Formula</li></ul></div>) : (<textarea className="w-full h-32 bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none resize-none placeholder:text-slate-600" placeholder={jobText || "Paste new Job Description..."} defaultValue={jobText} onChange={(e) => setJobText(e.target.value)} />)}</div>
                        <button onClick={handleCustomize} disabled={isUploading} className="w-full py-4 bg-white text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-all disabled:opacity-50">{isUploading ? <Loader2 className="animate-spin" /> : <ArrowRight size={18} />}{isUploading ? "Rewriting..." : "Generate Optimized CV"}</button>
                    </div>
                </div>
             </div>
        </motion.div>
    )
  }
}

// --- SUB COMPONENTS (DARK THEMED) ---
function getScoreColor(score: number) {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-red-400";
}

function DarkScoreCard({ icon, label, score, detail }: { icon: any, label: string, score: number, detail: string }) {
    return (
        <div className="bg-slate-950/50 border border-white/5 p-5 rounded-[18px] hover:border-white/10 transition-all group">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2 text-slate-300 font-medium text-sm"><span className="text-amber-500/80 group-hover:text-amber-400 transition-colors">{icon}</span> {label}</div>
                <div className={`font-bold text-xl ${getScoreColor(score)}`}>{score}</div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 group-hover:text-slate-400 transition-colors">{detail || "No details provided."}</p>
        </div>
    )
}