"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // For redirection
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, Link as LinkIcon, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react"; // To get token if needed

export function UploadCard() {
  const router = useRouter();
  const { data: session } = useSession();
  
  const [activeTab, setActiveTab] = useState<"text" | "link" | "general">("text");
  const [file, setFile] = useState<File | null>(null);
  const [jobText, setJobText] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return alert("Please upload a CV PDF first.");

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    
    if (activeTab === "text") formData.append("jobDescriptionText", jobText);
    if (activeTab === "link") formData.append("jobDescriptionUrl", jobUrl);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      
      const res = await fetch(`${backendUrl}/cv/analyze`, {
        method: "POST",
        headers: {
            // "session.user.id" might be undefined if session is stale
            "userId": session?.user?.id || "" 
        },
        body: formData,
      });

      // --- IMPROVED ERROR HANDLING ---
      if (!res.ok) {
        const errorText = await res.text(); // Get the real message from backend
        let errorMessage = "Analysis failed";
        try {
            // Try to parse JSON error (NestJS usually returns JSON)
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorJson.error || errorText;
        } catch (e) {
            errorMessage = errorText;
        }
        throw new Error(errorMessage);
      }
      // -------------------------------

      const data = await res.json();
      router.push(`/cv/${data.cvId}`);

    } catch (error: any) {
      console.error(error);
      alert(`Error: ${error.message}`); // Now you will see the REAL error in an alert
      setIsUploading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full glass rounded-3xl p-1"
    >
      <div className="bg-slate-950/50 rounded-[22px] p-6 md:p-8 border border-white/5">
        
        {/* Tabs UI (Keep existing code) */}
        <div className="flex space-x-1 bg-slate-900/80 p-1 rounded-xl mb-8">
           {(["text", "link", "general"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all relative",
                activeTab === tab ? "text-amber-400" : "text-slate-400 hover:text-slate-200"
              )}
            >
              {activeTab === tab && (
                <motion.div layoutId="activeTab" className="absolute inset-0 bg-white/5 border border-white/10 rounded-lg shadow-sm" />
              )}
              <span className="relative z-10 capitalize flex items-center gap-2">
                {tab === "text" && <FileText size={16} />}
                {tab === "link" && <LinkIcon size={16} />}
                {tab === "general" && <Sparkles size={16} />}
                {tab}
              </span>
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* LEFT: File Input */}
          <div className="relative border-2 border-dashed border-slate-700 hover:border-amber-500/50 hover:bg-slate-800/30 rounded-2xl h-64 flex flex-col items-center justify-center transition-all group overflow-hidden">
            <input 
                type="file" 
                accept=".pdf" 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
            />
            
            {file ? (
                <div className="text-center p-4">
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <FileText size={32} />
                    </div>
                    <p className="text-emerald-400 font-medium truncate max-w-[200px]">{file.name}</p>
                    <p className="text-slate-500 text-xs mt-1">Ready to analyze</p>
                </div>
            ) : (
                <>
                    <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xl shadow-black/50">
                        <UploadCloud className="text-amber-500 w-8 h-8" />
                    </div>
                    <p className="text-slate-300 font-medium">Upload Resume (PDF)</p>
                    <p className="text-slate-500 text-xs mt-2">Max 5MB</p>
                </>
            )}
          </div>

          {/* RIGHT: Inputs & Button */}
          <div className="flex flex-col h-64">
            <label className="text-xs uppercase tracking-wider text-slate-500 mb-3 font-semibold">
              Target Job Context
            </label>
            
            <div className="flex-1">
                {activeTab === "text" && (
                    <textarea
                        className="w-full h-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-sm text-slate-200 focus:border-amber-500/50 focus:ring-0 resize-none"
                        placeholder="Paste job description..."
                        onChange={(e) => setJobText(e.target.value)}
                    />
                )}
                {activeTab === "link" && (
                    <input 
                        type="url"
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-sm text-slate-200 focus:border-amber-500/50"
                        placeholder="Paste Job URL..."
                        onChange={(e) => setJobUrl(e.target.value)}
                    />
                )}
                 {activeTab === "general" && (
                     <div className="h-full flex items-center justify-center text-slate-500 text-sm border border-white/5 rounded-xl bg-slate-900/30">
                        Generic Analysis Selected
                     </div>
                )}
            </div>

            <button 
                onClick={handleAnalyze}
                disabled={isUploading || !file}
                className="mt-4 w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Analyzing...
                  </>
              ) : (
                  <>
                    <Sparkles size={18} />
                    Analyze Strategy
                  </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}