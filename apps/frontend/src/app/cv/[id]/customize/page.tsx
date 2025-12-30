"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { CvEditor } from "@/components/customize/cv-editor";
import { AiSidebar } from "@/components/customize/ai-sidebar";
import { CvProvider } from "@/lib/cv-context"; 

export default function CustomizePage() {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    async function fetchAnalysis() {
        if(!id) return;
        try {
            const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
            const res = await fetch(`${backendUrl}/cv/${id}`);
            const data = await res.json();
            if(data.analysisResult) setAnalysis(data.analysisResult);
        } catch(e) { console.error(e); }
    }
    fetchAnalysis();
  }, [id]);

  // Fungsi Print
  const handleDownload = () => {
    window.print();
  };

  return (
    <CvProvider cvId={id as string}>
        <div className="min-h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans flex flex-col">
        
        {/* Header */}
        <header className="h-16 border-b border-white/5 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 z-40 no-print">
            <div className="flex items-center gap-4">
            <Link href={`/cv/${id}`} className="p-2 hover:bg-white/10 rounded-full text-slate-400 transition-colors">
                <ArrowLeft size={20} />
            </Link>
            <h1 className="text-sm font-bold text-slate-200">CV Editor</h1>
            </div>
            <div className="flex items-center gap-2">
                {/* TOMBOL DOWNLOAD UTAMA */}
                <button 
                    onClick={handleDownload}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-bold rounded-lg flex gap-2 items-center shadow-lg shadow-amber-500/20 transition-transform hover:scale-105"
                >
                    <Download size={14}/> Download PDF
                </button>
            </div>
        </header>

        {/* Workspace */}
        <main className="flex-1 flex overflow-hidden">
            {/* Editor Area */}
            <div className="flex-1 overflow-y-auto bg-slate-950 relative custom-scrollbar flex justify-center p-8 pb-32">
                <CvEditor />
            </div>

            {/* Sidebar */}
            <div className="w-[400px] border-l border-white/5 bg-slate-900/40 backdrop-blur-2xl relative z-30 hidden lg:block no-print">
                {analysis ? (
                    <AiSidebar analysis={analysis} />
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <Loader2 className="animate-spin text-slate-500" />
                    </div>
                )}
            </div>
        </main>

        </div>
    </CvProvider>
  );
}