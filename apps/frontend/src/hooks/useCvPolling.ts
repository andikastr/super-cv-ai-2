"use client";

import { useState, useEffect, useRef } from "react";
import { useCv } from "@/lib/cv-context"; // Kita pakai Context untuk simpan hasil

// Sesuaikan dengan Enum Prisma di Backend
export type AnalysisStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export function useCvPolling(cvId: string | null) {
    // Ambil setter dari Global Context
    const { setAnalysisResult, setCvData, setAiDraft } = useCv();
    
    const [pollingStatus, setPollingStatus] = useState<AnalysisStatus>('PENDING');
    const [error, setError] = useState<string | null>(null);
    
    // Ref untuk mengontrol loop polling agar aman saat unmount
    const stopPolling = useRef(false);

    useEffect(() => {
        if (!cvId) return;

        // Reset state saat ID berubah
        stopPolling.current = false;
        setPollingStatus('PENDING');
        setError(null);

        const poll = async () => {
            if (stopPolling.current) return;

            try {
                // 1. Panggil Real API Backend
                const res = await fetch(`http://localhost:3001/cv/${cvId}`);
                
                if (!res.ok) {
                    // Jika 404 atau 500, kita anggap error tapi coba lagi sebentar
                    console.warn("Polling retry..."); 
                    return; 
                }
                
                const data = await res.json();
                
                // 2. Update Status Lokal (untuk Loading Spinner di UI)
                setPollingStatus(data.status);

                // 3. Cek Status
                if (data.status === 'COMPLETED') {
                    // --- SUCCESS: Update Global Context ---
                    // Agar AnalysisView & Editor langsung dapat datanya
                    if (data.analysisResult) setAnalysisResult(data.analysisResult);
                    if (data.originalData) setCvData(data.originalData);
                    if (data.aiDraft) setAiDraft(data.aiDraft);
                    
                    stopPolling.current = true; // Stop polling
                } 
                else if (data.status === 'FAILED') {
                    // --- FAILED: Stop dan set error ---
                    setError("Proses AI Gagal. Silakan coba upload ulang.");
                    stopPolling.current = true;
                }
                
            } catch (e) {
                console.error("Polling Network Error", e);
                // Jangan stop polling jika hanya masalah koneksi sesaat
            }
        };

        // Jalankan polling pertama kali
        poll();

        // Setup Interval (Cek setiap 2 detik)
        const intervalId = setInterval(() => {
            if (stopPolling.current) {
                clearInterval(intervalId);
            } else {
                poll();
            }
        }, 2000);

        // Cleanup saat component unmount
        return () => {
            stopPolling.current = true;
            clearInterval(intervalId);
        };

    }, [cvId, setAnalysisResult, setCvData, setAiDraft]);

    return { pollingStatus, error };
}