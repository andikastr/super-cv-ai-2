"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, CheckCircle, XCircle, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CvResultPage() {
  const { id } = useParams();
  const [status, setStatus] = useState<"PENDING" | "PROCESSING" | "COMPLETED" | "FAILED">("PENDING");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const interval = setInterval(async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        // NOTE: You need to create a GET endpoint in backend for this to work perfectly.
        // For now, let's assume GET /cv/:id returns the CV object.
        // If you haven't created GET /cv/:id yet, I will provide the Backend code below.
        const res = await fetch(`${backendUrl}/cv/${id}`);
        const cv = await res.json();

        if (cv.status === "COMPLETED" || cv.status === "FAILED") {
          setStatus(cv.status);
          setData(cv.analysisResult);
          clearInterval(interval);
        } else {
            setStatus("PROCESSING");
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [id]);

  if (status === "PROCESSING" || status === "PENDING") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
        <Loader2 className="w-16 h-16 text-amber-500 animate-spin mb-4" />
        <h2 className="text-2xl font-serif font-bold">Analyzing your Profile...</h2>
        <p className="text-slate-400 mt-2">Our AI is benchmarking you against 500+ data points.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center text-slate-400 hover:text-amber-400 mb-8 transition-colors">
            <ChevronLeft size={16} className="mr-1"/> Back to Dashboard
        </Link>

        {status === "FAILED" ? (
             <div className="p-8 border border-red-500/20 bg-red-500/10 rounded-2xl text-center">
                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-red-400">Analysis Failed</h2>
                <p className="text-slate-400">Something went wrong with the AI Engine. Please try again.</p>
             </div>
        ) : (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                {/* Header Score */}
                <div className="glass p-8 rounded-3xl flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-serif font-bold mb-2">Analysis Complete</h1>
                        <p className="text-slate-400">Candidate: <span className="text-white">{data?.candidate_name}</span></p>
                    </div>
                    <div className="text-right">
                        <div className="text-5xl font-bold text-amber-400">{data?.overall_score}</div>
                        <div className="text-xs uppercase tracking-wider text-slate-500">Overall Score</div>
                    </div>
                </div>

                {/* Main Content would go here... */}
                <div className="glass p-8 rounded-3xl">
                    <pre className="text-xs text-slate-300 overflow-auto max-h-[500px]">
                        {JSON.stringify(data, null, 2)}
                    </pre>
                </div>
            </motion.div>
        )}
      </div>
    </div>
  );
}