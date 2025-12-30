"use client";

import { useState } from "react";
import { Loader2, Briefcase, FileText, CheckCircle2 } from "lucide-react";

interface CustomizeSectionProps {
  file: File | null;
  analysisResult: any; // Hasil dari step analyze sebelumnya
  onSuccess: (data: any) => void; // Callback untuk update data CV di Editor
}

export function CustomizeSection({ file, analysisResult, onSuccess }: CustomizeSectionProps) {
  const [mode, setMode] = useState<"job_desc" | "analysis">("job_desc");
  const [jobDesc, setJobDesc] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCustomize = async () => {
    if (!file) {
      alert("Silakan upload CV terlebih dahulu.");
      return;
    }
    
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", mode);

    // LOGIKA PENGIRIMAN DATA
    if (mode === "job_desc") {
      formData.append("job_description", jobDesc);
    } else {
      // Kirim balik hasil analisis ke backend sebagai konteks perbaikan
      if (analysisResult) {
        formData.append("analysis_context", JSON.stringify(analysisResult));
      }
    }

    try {
      const res = await fetch("http://localhost:8000/api/customize", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Gagal customize CV");
      
      const data = await res.json();
      onSuccess(data); // Masukkan data baru ke Editor
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat memproses CV.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6 mt-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span className="bg-black text-white p-1 rounded">2</span> Customize & Improve
      </h2>

      {/* --- TOGGLE MODE --- */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Pilihan 1: Job Desc */}
        <button
          onClick={() => setMode("job_desc")}
          className={`flex-1 p-3 rounded-lg border-2 text-left transition-all ${
            mode === "job_desc"
              ? "border-blue-600 bg-blue-50"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <Briefcase size={18} /> Based on Job Desc
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Optimalkan keyword ATS & sesuaikan pengalaman dengan lowongan kerja.
          </p>
        </button>

        {/* Pilihan 2: Analysis Result */}
        <button
          onClick={() => setMode("analysis")}
          disabled={!analysisResult} // Disable jika belum ada hasil analisis
          className={`flex-1 p-3 rounded-lg border-2 text-left transition-all ${
            mode === "analysis"
              ? "border-emerald-600 bg-emerald-50"
              : !analysisResult
              ? "border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <FileText size={18} /> Based on Analysis
            {!analysisResult && <span className="text-[10px] text-red-500 font-normal bg-red-100 px-1.5 rounded">(Analyze First)</span>}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Perbaiki kelemahan (skor rendah, typo, kurang angka) dari hasil analisis AI.
          </p>
        </button>
      </div>

      {/* --- INPUT AREA --- */}
      <div className="mb-6">
        {mode === "job_desc" ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <label className="block text-sm font-medium mb-2 text-slate-700">Paste Job Description</label>
            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Paste deskripsi lowongan kerja di sini..."
              className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-slate-50"
            />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <h4 className="font-semibold text-emerald-800 mb-1 flex items-center gap-2">
              <CheckCircle2 size={16} /> Ready to Fix Weaknesses
            </h4>
            <p className="text-sm text-emerald-700 mb-2">
              AI akan menulis ulang CV Anda untuk memperbaiki masalah berikut yang ditemukan:
            </p>
            {/* Tampilkan summary kecil dari analisis jika ada */}
            <div className="bg-white/60 p-2 rounded text-xs text-emerald-900 font-mono">
               Score: {analysisResult?.overall_score}/100 <br/>
               Weakness: {analysisResult?.overall_detail || "General improvements needed."}
            </div>
          </div>
        )}
      </div>

      {/* --- ACTION BUTTON --- */}
      <button
        onClick={handleCustomize}
        disabled={isLoading || (mode === "job_desc" && !jobDesc) || !file}
        className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" /> Sedang Mengoptimalkan CV...
          </>
        ) : (
          "Generate Optimized CV"
        )}
      </button>
    </div>
  );
}