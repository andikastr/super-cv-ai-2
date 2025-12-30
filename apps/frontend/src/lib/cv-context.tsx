"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// =============================================================================
// 1. TYPES
// =============================================================================

export interface DesignSettings {
    fontFamily: 'font-sans' | 'font-serif' | 'font-mono';
    fontSize: string;
    accentColor: string;
    lineHeight: string;
}

export interface CvContactInfo {
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  portfolio?: string;
}

export interface CvExperience {
  title: string;
  company: string;
  dates: string;
  achievements: string[];
  location?: string;
}

export interface CvEducation {
  institution: string;
  degree: string;
  year: string;
  location?: string;
}

export interface CvProject {
  name: string;
  description: string;
  highlights: string[];
  technologies?: string[]; 
}

export interface CvData {
  full_name: string;
  professional_summary: string;
  contact_info: CvContactInfo;
  hard_skills: string[];
  soft_skills: string[]; 
  work_experience: CvExperience[];
  education: CvEducation[];
  projects: CvProject[];
  certifications?: string[];
}

// =============================================================================
// 2. CONTEXT STATE
// =============================================================================

interface CvContextType {
  cvData: CvData | null;
  setCvData: (data: CvData) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  design: DesignSettings;
  setDesign: (d: DesignSettings) => void;
  sectionOrder: string[];
  setSectionOrder: (order: string[]) => void;
  applySuggestion: (section: string, content: any) => void;
}

const defaultDesign: DesignSettings = {
    fontFamily: 'font-sans', 
    fontSize: 'text-[0.9em]',
    accentColor: '#000000', 
    lineHeight: 'leading-relaxed'
};

const CvContext = createContext<CvContextType | undefined>(undefined);

// =============================================================================
// 3. PROVIDER (HYBRID MODE)
// =============================================================================

// Tambahkan prop cvId sebagai OPTIONAL (?)
export function CvProvider({ children, cvId }: { children: ReactNode; cvId?: string }) {
  const [cvData, setCvData] = useState<CvData | null>(null);
  const [isLoading, setIsLoading] = useState(!!cvId); // Loading true jika ada ID
  
  const [design, setDesign] = useState<DesignSettings>(defaultDesign);
  const [sectionOrder, setSectionOrder] = useState([
    "summary", "experience", "projects", "skills", "education"
  ]);

  // --- LOGIC 1: FETCH DARI DB (JIKA ADA CV ID) ---
  useEffect(() => {
    if (!cvId) return; // Jika flow Upload (tidak ada ID), skip fetch

    let isMounted = true;
    async function fetchData() {
        try {
            setIsLoading(true);
            const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
            // Sesuaikan endpoint ini dengan NestJS Anda untuk get CV by ID
            const res = await fetch(`${backendUrl}/cv/${cvId}`); 
            
            if (!res.ok) throw new Error("Failed to fetch CV");
            
            const data = await res.json();
            // Mapping data DB ke struktur Frontend jika perlu
            // Anggap DB NestJS sudah return format yang sesuai CvData
            if (isMounted) setCvData(data);
        } catch (err) {
            console.error(err);
        } finally {
            if (isMounted) setIsLoading(false);
        }
    }
    fetchData();

    return () => { isMounted = false; };
  }, [cvId]);

  // --- HELPER FUNCTION ---
  const applySuggestion = (section: string, content: any) => {
      if (!cvData) return;
      const newData = { ...cvData };
      if (section === 'summary') newData.professional_summary = content;
      else if (section === 'skills') newData.hard_skills = [...new Set([...newData.hard_skills, ...content])];
      setCvData(newData);
  };

  return (
    <CvContext.Provider 
      value={{ 
        cvData, setCvData, 
        isLoading, setIsLoading, 
        design, setDesign,
        sectionOrder, setSectionOrder,
        applySuggestion
      }}
    >
      {children}
    </CvContext.Provider>
  );
}

export function useCv() {
  const context = useContext(CvContext);
  if (!context) {
    throw new Error("useCv must be used within a CvProvider");
  }
  return context;
}