"use client";

import { useCv } from "@/lib/cv-context";
import { 
  Type, 
  Palette, 
  Download, 
  LayoutTemplate, 
  Minus, 
  Plus,
  Printer
} from "lucide-react";
import { useState } from "react";

export function RibbonBar() {
  const { design, setDesign } = useCv();
  const [isDownloading, setIsDownloading] = useState(false);

  // Mapping agar user melihat label "Small/Medium/Large" tapi sistem pakai class relatif
  const fontSizes = [
    { label: "S", value: "text-[0.8em]" },
    { label: "M", value: "text-[0.9em]" }, // Default
    { label: "L", value: "text-[1em]" },
  ];

  const fontFamilies = [
    { label: "Sans", value: "font-sans" },
    { label: "Serif", value: "font-serif" },
    { label: "Mono", value: "font-mono" },
  ];

  const colors = [
    "#000000", // Hitam
    "#1e293b", // Slate 800
    "#0f172a", // Slate 900
    "#059669", // Emerald
    "#2563eb", // Blue
    "#d97706", // Amber
    "#dc2626", // Red
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white/90 backdrop-blur border border-slate-200 shadow-sm rounded-xl p-3 flex flex-wrap items-center gap-4 md:gap-6 justify-between transition-all">
      
      {/* 1. FONT FAMILY */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
          <Type size={14} /> Font
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {fontFamilies.map((font) => (
            <button
              key={font.value}
              onClick={() => setDesign({ ...design, fontFamily: font.value as any })}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                design.fontFamily === font.value
                  ? "bg-white shadow text-slate-900"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {font.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-px h-8 bg-slate-200 hidden md:block" />

      {/* 2. FONT SIZE */}
      <div className="flex items-center gap-3">
         <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
          Size
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {fontSizes.map((size) => (
            <button
              key={size.value}
              onClick={() => setDesign({ ...design, fontSize: size.value as any })}
              className={`w-8 h-7 flex items-center justify-center text-xs font-bold rounded-md transition-all ${
                design.fontSize === size.value
                  ? "bg-white shadow text-slate-900"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-px h-8 bg-slate-200 hidden md:block" />

      {/* 3. ACCENT COLOR */}
      <div className="flex items-center gap-3">
         <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
          <Palette size={14} /> Color
        </div>
        <div className="flex gap-1.5">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setDesign({ ...design, accentColor: c })}
              className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                design.accentColor === c ? "border-slate-400 scale-110" : "border-transparent"
              }`}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
           {/* Color Picker Custom */}
           <div className="relative w-6 h-6 rounded-full overflow-hidden border border-slate-300 cursor-pointer hover:scale-110 transition-transform">
              <input 
                type="color" 
                value={design.accentColor}
                onChange={(e) => setDesign({ ...design, accentColor: e.target.value })}
                className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer p-0 border-0"
              />
           </div>
        </div>
      </div>

      <div className="flex-1 hidden md:block" />

      {/* 4. ACTIONS (PRINT/DOWNLOAD) */}
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-all shadow-md hover:shadow-lg"
        >
          <Printer size={16} />
          <span className="hidden sm:inline">Print / Save PDF</span>
        </button>
      </div>

    </div>
  );
}