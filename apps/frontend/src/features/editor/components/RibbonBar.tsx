"use client";

import { RefObject } from "react";
import { useEditorStore } from "../stores/useEditorStore";
import type { DesignSettings, TemplateType } from "../types/editor.types";
import {
  Type, LayoutTemplate, ChevronDown, CheckCircle2,
  Printer, Ruler, AlignJustify, Palette, Sparkles
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface RibbonBarProps {
  printRef: RefObject<HTMLDivElement | null>;
}

export function RibbonBar({ printRef }: RibbonBarProps) {
  const design = useEditorStore((s) => s.design);
  const setDesign = useEditorStore((s) => s.setDesign);
  const template = useEditorStore((s) => s.template);
  const setTemplate = useEditorStore((s) => s.setTemplate);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const toggleDropdown = (name: string) => setActiveDropdown(activeDropdown === name ? null : name);

  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pageStyle = `
    @page {
      size: auto;
      margin: 10mm !important;
    @media print {
      body {
        margin: 0 !important;
        padding: 0 !important;
      }
      .cv-paper {
        padding: 0 !important;
      }
    }
  `;

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "My_CV_Optimized",
    pageStyle: pageStyle,
  });

  const colors = ["#000000", "#2563eb", "#dc2626", "#16a34a", "#d97706", "#7c3aed", "#db2777", "#0891b2"];
  const fonts = [{ key: "font-sans", label: "Sans Serif" }, { key: "font-serif", label: "Serif" }, { key: "font-mono", label: "Mono" }];
  const fontSizes = [{ key: "text-xs", label: "S" }, { key: "text-sm", label: "M" }, { key: "text-base", label: "L" }];
  const lineHeights = [{ key: "leading-tight", label: "Tight" }, { key: "leading-snug", label: "Normal" }, { key: "leading-relaxed", label: "Loose" }];
  const margins = [{ key: "p-6", label: "Compact" }, { key: "p-10", label: "Standard" }, { key: "p-14", label: "Wide" }];
  const spacings = [{ key: "gap-1", label: "Tight" }, { key: "gap-2", label: "Normal" }, { key: "gap-4", label: "Relaxed" }, { key: "gap-6", label: "Loose" }];
  const templates: { key: TemplateType; label: string; defaults: Partial<DesignSettings> }[] = [
    { key: "modern", label: "Modern", defaults: { fontFamily: "font-sans", pageMargin: "p-10" } },
    { key: "classic", label: "Classic", defaults: { fontFamily: "font-serif", pageMargin: "p-12" } },
    { key: "minimal", label: "Minimal", defaults: { fontFamily: "font-mono", pageMargin: "p-8" } },
  ];

  const handleTemplateChange = (t: (typeof templates)[0]) => {
    setTemplate(t.key);
    setDesign(t.defaults);
    setActiveDropdown(null);
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -8, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -8, scale: 0.95 }
  };

  return (
    <>
      <AnimatePresence>
        {activeDropdown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setActiveDropdown(null)}
          />
        )}
      </AnimatePresence>

      <motion.div
        ref={barRef}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-2 z-50 w-[95%] max-w-5xl mx-auto"
      >
        <div className="relative glass-panel rounded-2xl p-2 flex flex-wrap items-center justify-center md:justify-between gap-2 shadow-xl">
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-indigo-400/10 rounded-full blur-3xl" />
          </div>

          <div className="flex items-center gap-1 relative z-10">
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleDropdown("font")}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                  activeDropdown === "font"
                    ? "bg-amber-500/20 text-amber-700 dark:text-amber-400 ring-1 ring-amber-500/30"
                    : "hover:bg-black/5 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300"
                )}
              >
                <Type size={16} />
                <span className="hidden md:inline">{fonts.find((f) => f.key === design.fontFamily)?.label}</span>
                <ChevronDown size={12} className={cn("transition-transform", activeDropdown === "font" && "rotate-180")} />
              </motion.button>

              <AnimatePresence>
                {activeDropdown === "font" && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-full mt-2 left-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl shadow-black/30 p-3 z-[100] w-56 backdrop-blur-none"
                  >
                    <div className="mb-3">
                      <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Font Family</div>
                      <div className="space-y-1">
                        {fonts.map((f) => (
                          <button
                            key={f.key}
                            onClick={() => setDesign({ fontFamily: f.key as DesignSettings["fontFamily"] })}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-lg text-sm flex justify-between items-center transition-colors",
                              design.fontFamily === f.key
                                ? "bg-amber-500/20 text-amber-700 dark:text-amber-400 font-semibold"
                                : "hover:bg-black/5 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300"
                            )}
                          >
                            {f.label}
                            {design.fontFamily === f.key && <CheckCircle2 size={14} className="text-amber-500" />}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Size</div>
                      <div className="flex gap-1 p-1 bg-black/5 dark:bg-white/5 rounded-lg">
                        {fontSizes.map((s) => (
                          <button
                            key={s.key}
                            onClick={() => setDesign({ fontSize: s.key })}
                            className={cn(
                              "flex-1 py-1.5 text-xs rounded-md font-medium transition-all",
                              design.fontSize === s.key
                                ? "bg-white dark:bg-slate-800 shadow text-amber-600 dark:text-amber-400"
                                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                            )}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 hidden md:block" />

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleDropdown("color")}
                className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <div
                  className="w-6 h-6 rounded-full shadow-md ring-2 ring-white dark:ring-slate-800 transition-transform hover:scale-110"
                  style={{ backgroundColor: design.accentColor }}
                />
              </motion.button>

              <AnimatePresence>
                {activeDropdown === "color" && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl shadow-black/30 p-4 z-[100] w-48"
                  >
                    <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-3 flex items-center gap-2">
                      <Palette size={12} /> Accent Color
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {colors.map((c) => (
                        <motion.button
                          key={c}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => { setDesign({ accentColor: c }); setActiveDropdown(null); }}
                          className={cn(
                            "w-8 h-8 rounded-full shadow-md transition-all",
                            design.accentColor === c && "ring-2 ring-amber-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-900"
                          )}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleDropdown("layout")}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                  activeDropdown === "layout"
                    ? "bg-amber-500/20 text-amber-700 dark:text-amber-400 ring-1 ring-amber-500/30"
                    : "hover:bg-black/5 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300"
                )}
              >
                <Ruler size={16} />
                <span className="hidden md:inline">Layout</span>
              </motion.button>

              <AnimatePresence>
                {activeDropdown === "layout" && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl shadow-black/30 p-3 z-[100] w-[220px]"
                  >
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 block">Margin</label>
                        <div className="grid grid-cols-3 gap-1">
                          {margins.map((m) => (
                            <button key={m.key} onClick={() => setDesign({ pageMargin: m.key })} className={cn("py-1.5 text-[10px] rounded-md font-medium transition-all", design.pageMargin === m.key ? "bg-amber-500 text-white shadow" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200")}>
                              {m.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 block">Spacing</label>
                        <div className="grid grid-cols-4 gap-1">
                          {spacings.map((s) => (
                            <button key={s.key} onClick={() => setDesign({ sectionSpacing: s.key })} className={cn("py-1.5 text-[10px] rounded-md font-medium transition-all", design.sectionSpacing === s.key ? "bg-amber-500 text-white shadow" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200")}>
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 block">Line Height</label>
                        <div className="grid grid-cols-3 gap-1">
                          {lineHeights.map((l) => (
                            <button key={l.key} onClick={() => setDesign({ lineHeight: l.key })} className={cn("py-1.5 text-[10px] rounded-md font-medium transition-all", design.lineHeight === l.key ? "bg-amber-500 text-white shadow" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200")}>
                              {l.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-1 relative z-10">
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleDropdown("template")}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                  activeDropdown === "template"
                    ? "bg-amber-500/20 text-amber-700 dark:text-amber-400 ring-1 ring-amber-500/30"
                    : "hover:bg-black/5 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300"
                )}
              >
                <LayoutTemplate size={16} />
                <span className="hidden md:inline">Templates</span>
              </motion.button>

              <AnimatePresence>
                {activeDropdown === "template" && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-full mt-2 right-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl shadow-black/30 p-3 z-[100] w-48"
                  >
                    <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Select Template</div>
                    <div className="space-y-1">
                      {templates.map((t) => (
                        <motion.button
                          key={t.key}
                          whileHover={{ x: 2 }}
                          onClick={() => handleTemplateChange(t)}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg text-sm flex justify-between items-center transition-colors",
                            template === t.key
                              ? "bg-amber-500/20 text-amber-700 dark:text-amber-400 font-semibold"
                              : "hover:bg-black/5 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300"
                          )}
                        >
                          {t.label}
                          {template === t.key && <CheckCircle2 size={14} className="text-amber-500" />}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handlePrint && handlePrint()}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all ml-2"
            >
              <Sparkles size={16} className="animate-pulse" />
              <span className="hidden md:inline">Save PDF</span>
              <Printer size={16} className="md:hidden" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}