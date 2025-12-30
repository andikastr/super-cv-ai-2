"use client";

import { useEffect, useState, useRef } from "react";
import { Loader2, Trash2, Plus, X, GripVertical } from "lucide-react";
import { useCv } from "@/lib/cv-context"; 
import { RibbonBar } from "./ribbon-bar";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- RICH TEXT COMPONENT ---
const RichText = ({ value, onChange, placeholder, className, style, align="left", tagName = "div" }: any) => {
  const contentRef = useRef<HTMLElement>(null);
  const handleBlur = () => { if (contentRef.current) onChange(contentRef.current.innerHTML); };
  const Tag = tagName as any;
  return (
    <Tag
      ref={contentRef}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      dangerouslySetInnerHTML={{ __html: value || "" }}
      className={`focus:outline-none focus:bg-amber-50/50 rounded transition-colors empty:before:content-[attr(placeholder)] empty:before:text-slate-300 hover:bg-slate-50/50 ${className}`}
      style={{ ...style, textAlign: align, whiteSpace: "pre-wrap", wordBreak: "break-word" }}
      placeholder={placeholder}
    />
  );
};

// --- WRAPPER ---
function SortableSection({ id, children }: { id: string, children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1, position: 'relative' as const, zIndex: isDragging ? 50 : 'auto' };
    return (
        <div ref={setNodeRef} style={style} className="group/section relative mb-2">
            <div {...attributes} {...listeners} className="absolute -left-8 top-0 p-2 cursor-grab opacity-0 group-hover/section:opacity-100 text-slate-300 hover:text-amber-500 transition-opacity no-print"><GripVertical size={18} /></div>
            {children}
        </div>
    );
}

// --- SUB-COMPONENTS (FONT SIZE DIBUKA KUNCI-NYA) ---
const SectionTitle = ({ children, color }: { children: React.ReactNode, color: string }) => (
    // Hapus 'text-sm'. Biarkan ikut parent, tapi uppercase & spacing tetap.
    <h3 className="font-bold uppercase tracking-widest mb-1 border-b-2 pb-0.5 select-none text-[0.9em]" style={{ color, borderColor: color, opacity: 1 }}>{children}</h3>
);

const SummarySection = () => {
    const { cvData, setCvData, design } = useCv();
    if (!cvData) return null;
    return (
        <div className="hover:bg-slate-50/30 p-1 -mx-2 rounded transition-colors cv-item break-inside-avoid">
            <SectionTitle color={design.accentColor}>Professional Summary</SectionTitle>
            {/* Hapus 'text-sm'. Sekarang ukuran ikut design.fontSize */}
            <RichText 
                value={cvData.professional_summary} 
                onChange={(v:string) => setCvData({...cvData, professional_summary: v})} 
                className="leading-snug text-justify w-full block" 
                align="justify"
            />
        </div>
    );
};

const SkillsSection = () => {
    const { cvData, setCvData, design } = useCv();
    if (!cvData) return null;
    return (
        <div className="hover:bg-slate-50/30 p-1 -mx-2 rounded transition-colors cv-item break-inside-avoid">
            <SectionTitle color={design.accentColor}>Technical Skills</SectionTitle>
            {/* Hapus 'text-sm' */}
            <div className="flex flex-wrap gap-x-3 gap-y-1">
                {cvData.hard_skills.map((skill, i) => (
                    <div key={i} className="relative group/skill flex items-center">
                        <span className="mr-1 text-slate-500">•</span>
                        <RichText 
                            tagName="span"
                            className="font-medium min-w-[30px] inline-block" 
                            value={skill}
                            onChange={(v:string) => { const newSkills = [...cvData.hard_skills]; newSkills[i] = v; setCvData({...cvData, hard_skills: newSkills}); }}
                        />
                        <button onClick={() => setCvData({...cvData, hard_skills: cvData.hard_skills.filter((_,x)=>x!==i)})} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover/skill:opacity-100 hover:scale-110 transition-all no-print z-10"><X size={10} /></button>
                    </div>
                ))}
                <button onClick={() => setCvData({...cvData, hard_skills: [...cvData.hard_skills, "New Skill"]})} className="px-2 py-0 border border-dashed text-[0.8em] font-bold text-slate-400 hover:text-emerald-500 rounded no-print flex items-center gap-1 transition-all"><Plus size={10} /> Add</button>
            </div>
        </div>
    );
};

const ExperienceSection = () => {
    const { cvData, setCvData, design } = useCv();
    if (!cvData) return null;
    const updateExp = (index: number, field: string, val: any) => {
        const newExp = [...cvData.work_experience]; newExp[index] = { ...newExp[index], [field]: val }; setCvData({ ...cvData, work_experience: newExp });
    };

    return (
        <div>
            <SectionTitle color={design.accentColor}>Work Experience</SectionTitle>
            {cvData.work_experience.map((exp, i) => (
                // Hapus 'text-sm' container
                <div key={i} className="mb-2 group relative hover:bg-slate-50/30 p-1 -mx-2 rounded transition-colors cv-item break-inside-avoid w-full">
                    <div className="flex justify-between items-baseline mb-0 w-full gap-4">
                        <div className="flex-1 font-bold">
                             <RichText className="w-full block" value={exp.title} onChange={(v:string)=>updateExp(i, 'title', v)} placeholder="Job Title" />
                        </div>
                        {/* Ubah text-xs jadi text-[0.85em] agar relatif terhadap font utama */}
                        <div className="shrink-0 w-48 font-semibold text-right text-[0.85em] text-slate-700">
                             <RichText className="w-full block" value={exp.dates} onChange={(v:string)=>updateExp(i, 'dates', v)} align="right" placeholder="Dates" />
                        </div>
                    </div>
                    {/* Ubah text-sm jadi inherit */}
                    <div className="italic mb-1 font-medium text-slate-700">
                        <RichText className="w-full block" value={exp.company} onChange={(v:string)=>updateExp(i, 'company', v)} placeholder="Company" />
                    </div>
                    
                    <ul className="ml-1 space-y-0 leading-snug w-full mt-0.5">
                        {exp.achievements.map((ach, idx) => (
                            <li key={idx} className="group/bullet relative w-full flex items-start hover:bg-slate-100/50 -ml-1 pl-1 rounded">
                                <span className="mr-1.5 mt-0.5 flex-shrink-0 text-[0.8em]">•</span>
                                <div className="flex-1 min-w-0">
                                    <RichText className="w-full block text-justify" value={ach} onChange={(v:string)=>{ const n=[...cvData.work_experience]; n[i].achievements[idx]=v; setCvData({...cvData, work_experience:n}) }} align="justify"/>
                                </div>
                                <button type="button" onClick={(e) => { e.stopPropagation(); const newAch = exp.achievements.filter((_, x) => x !== idx); updateExp(i, 'achievements', newAch); }} className="opacity-0 group-hover/bullet:opacity-100 text-red-400 p-0.5 hover:bg-red-100 rounded ml-1 no-print shrink-0 cursor-pointer" title="Hapus Bullet"><X size={12}/></button>
                            </li>
                        ))}
                    </ul>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity no-print mt-0.5">
                        <button type="button" onClick={()=>{const n=[...cvData.work_experience];n[i].achievements.push("New achievement");setCvData({...cvData, work_experience:n})}} className="text-[0.8em] text-emerald-500 font-bold hover:underline flex items-center gap-1"><Plus size={10}/> Bullet</button>
                        <button type="button" onClick={()=>{setCvData({...cvData, work_experience:cvData.work_experience.filter((_,x)=>x!==i)})}} className="text-[0.8em] text-red-400 font-bold hover:underline flex items-center gap-1"><Trash2 size={10}/> Delete Job</button>
                    </div>
                </div>
            ))}
             <button type="button" onClick={() => setCvData({...cvData, work_experience: [...cvData.work_experience, { title: "Job Title", company: "Company", dates: "Dates", achievements: ["Result..."] }]})} className="w-full py-1 border border-dashed border-slate-300 text-[0.8em] font-bold text-slate-400 hover:bg-slate-50 rounded flex justify-center no-print gap-2 hover:text-emerald-600 transition-all"><Plus size={10} /> Add Experience</button>
        </div>
    );
};

const ProjectsSection = () => {
    const { cvData, setCvData, design } = useCv();
    if (!cvData || !cvData.projects) return null;
    return (
        <div>
            <SectionTitle color={design.accentColor}>Key Projects</SectionTitle>
            {cvData.projects.map((proj, i) => (
                // Hapus 'text-sm'
                <div key={i} className="mb-2 group relative hover:bg-slate-50/30 p-1 -mx-2 rounded cv-item break-inside-avoid w-full">
                    <div className="font-bold mb-0 w-full">
                        <RichText className="w-full block" value={proj.name} onChange={(v:string)=>{const n=[...cvData.projects!];n[i].name=v;setCvData({...cvData, projects:n})}} placeholder="Project Name"/>
                    </div>
                    {/* text-xs -> text-[0.9em] */}
                    <div className="italic mb-0.5 text-justify text-slate-700 text-[0.9em]">
                        <RichText className="w-full block" value={proj.description} onChange={(v:string)=>{const n=[...cvData.projects!];n[i].description=v;setCvData({...cvData, projects:n})}} align="justify" placeholder="Description"/>
                    </div>
                    <ul className="ml-1 space-y-0 leading-snug w-full mt-0.5">
                        {(proj.highlights || []).map((hl, idx) => (
                            <li key={idx} className="group/bullet flex items-start w-full hover:bg-slate-100/50 -ml-1 pl-1 rounded">
                                <span className="mr-1.5 mt-0.5 flex-shrink-0 text-[0.8em]">•</span>
                                <div className="flex-1 min-w-0">
                                    <RichText className="w-full block text-justify" value={hl} onChange={(v:string)=>{ const n=[...cvData.projects!]; if(!n[i].highlights) n[i].highlights = []; n[i].highlights![idx]=v; setCvData({...cvData, projects:n}) }} align="justify"/>
                                </div>
                                <button type="button" onClick={(e) => { e.stopPropagation(); const newHl = proj.highlights?.filter((_, x) => x !== idx); const n = [...cvData.projects!]; n[i].highlights = newHl; setCvData({...cvData, projects: n}); }} className="opacity-0 group-hover/bullet:opacity-100 text-red-400 p-0.5 ml-1 no-print shrink-0 cursor-pointer"><X size={12}/></button>
                            </li>
                        ))}
                    </ul>
                     <button type="button" onClick={()=>{const n=[...cvData.projects!]; if(!n[i].highlights) n[i].highlights = []; n[i].highlights!.push("New feature"); setCvData({...cvData, projects:n})}} className="mt-0.5 text-[0.8em] text-emerald-500 font-bold hover:underline flex items-center gap-1 no-print opacity-0 group-hover:opacity-100"><Plus size={10}/> Highlight</button>
                    <button type="button" onClick={()=>{setCvData({...cvData, projects:cvData.projects!.filter((_,x)=>x!==i)})}} className="absolute top-2 right-[-25px] opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-500 p-1.5 no-print"><Trash2 size={16}/></button>
                </div>
            ))}
            <button type="button" onClick={() => setCvData({...cvData, projects: [...(cvData.projects || []), { name: "New Project", description: "Desc", highlights: ["Highlight"] }]})} className="w-full py-1 border border-dashed text-[0.8em] font-bold text-slate-400 hover:bg-slate-50 rounded flex justify-center no-print gap-2 hover:text-emerald-600 transition-all"><Plus size={10} /> Add Project</button>
        </div>
    );
};

const EducationSection = () => {
    const { cvData, setCvData, design } = useCv();
    if (!cvData) return null;
    return (
        <div>
            <SectionTitle color={design.accentColor}>Education</SectionTitle>
            {cvData.education.map((edu, i) => (
                // Hapus 'text-sm'
                <div key={i} className="flex justify-between mb-1 group relative hover:bg-slate-50/30 p-1 -mx-2 rounded cv-item break-inside-avoid w-full gap-4">
                    <div className="flex-1">
                        <div className="font-bold">
                            <RichText className="w-full block" value={edu.institution} onChange={(v:string)=>{const n=[...cvData.education];n[i].institution=v;setCvData({...cvData, education:n})}} placeholder="University"/>
                        </div>
                        {/* text-xs -> text-[0.9em] */}
                        <div className="text-slate-700 text-[0.9em]">
                            <RichText className="w-full block" value={edu.degree} onChange={(v:string)=>{const n=[...cvData.education];n[i].degree=v;setCvData({...cvData, education:n})}} placeholder="Degree"/>
                        </div>
                    </div>
                    {/* text-xs -> text-[0.9em] */}
                    <div className="shrink-0 w-24 font-medium text-right text-[0.9em]">
                        <RichText className="w-full block" value={edu.year} onChange={(v:string)=>{const n=[...cvData.education];n[i].year=v;setCvData({...cvData, education:n})}} align="right" placeholder="Year"/>
                    </div>
                    <button type="button" onClick={()=>{setCvData({...cvData, education:cvData.education.filter((_,x)=>x!==i)})}} className="absolute top-1 right-[-20px] opacity-0 group-hover:opacity-100 text-red-500 no-print"><Trash2 size={12}/></button>
                </div>
            ))}
             <button type="button" onClick={() => setCvData({...cvData, education: [...cvData.education, { institution: "Uni", degree: "Deg", year: "Yr", location: "" }]})} className="mt-1 text-[0.8em] font-bold text-slate-400 hover:text-emerald-500 flex items-center gap-1 no-print"><Plus size={10} /> Add Education</button>
        </div>
    );
};

// ==========================================
// MAIN EDITOR
// ==========================================
export function CvEditor() {
  const { cvData, setCvData, isLoading, design, sectionOrder, setSectionOrder } = useCv();
  const [flash, setFlash] = useState("");
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const handleDragEnd = (event: any) => { const { active, over } = event; if (active.id !== over.id) { setSectionOrder(arrayMove(sectionOrder, sectionOrder.indexOf(active.id), sectionOrder.indexOf(over.id))); }};
  useEffect(() => { if (cvData) { setFlash("ring-4 ring-emerald-400/30"); setTimeout(() => setFlash(""), 800); } }, [cvData]);
  if (isLoading || !cvData) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-amber-500" /></div>;
  const updateInfo = (f: string, v: string) => setCvData({ ...cvData, contact_info: { ...cvData.contact_info, [f]: v } });
  const sectionMapping: Record<string, React.ReactNode> = { summary: <SummarySection />, skills: <SkillsSection />, experience: <ExperienceSection />, projects: <ProjectsSection />, education: <EducationSection /> };

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-100 pb-20 print:bg-white print:pb-0">
      <div className="sticky top-4 z-50 px-4 mb-4 ribbon-container no-print">
         <RibbonBar />
      </div>
      <div 
        id="cv-paper" 
        // CLASS PENTING: ${design.fontSize} di sini akan mengontrol semua text di dalam karena kita sudah hapus text-sm hardcoded.
        className={`bg-white shadow-2xl mx-auto p-[15mm] transition-all duration-300 relative ${flash} ${design.fontFamily} ${design.fontSize}`} 
        style={{ width: '210mm', minHeight: '297mm', color: '#1e293b' }}
      >
        <div className="text-center mb-4 border-b-2 pb-3" style={{ borderColor: design.accentColor }}>
            <div className="flex justify-center w-full mb-1">
                <RichText 
                    tagName="div" 
                    className="text-3xl font-bold uppercase tracking-wide placeholder-slate-300 text-center w-auto inline-block header-item" 
                    style={{ color: design.accentColor }} 
                    value={cvData.full_name} 
                    onChange={(v:string) => setCvData({...cvData, full_name: v})} 
                    align="center"
                />
            </div>
            
            {/* Header Contact: Menggunakan text-[0.9em] agar ikut berubah saat size diubah */}
            <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-0.5 text-slate-600 font-medium text-[0.9em]">
                <RichText tagName="span" className="header-item" value={cvData.contact_info.email} onChange={(v:string)=>updateInfo('email', v)} placeholder="Email" align="center"/>
                <span className="hidden sm:inline text-slate-300">|</span>
                <RichText tagName="span" className="header-item" value={cvData.contact_info.phone} onChange={(v:string)=>updateInfo('phone', v)} placeholder="Phone" align="center"/>
                <span className="hidden sm:inline text-slate-300">|</span>
                <RichText tagName="span" className="header-item" value={cvData.contact_info.location} onChange={(v:string)=>updateInfo('location', v)} placeholder="Location" align="center"/>
            </div>
            
            {cvData.contact_info.linkedin && (
                <div className="flex justify-center mt-0.5 w-full text-[0.9em]">
                    <RichText tagName="span" className="text-blue-600 underline decoration-blue-200 header-item" value={cvData.contact_info.linkedin} onChange={(v:string)=>updateInfo('linkedin', v)} placeholder="LinkedIn" align="center"/>
                </div>
            )}
        </div>

        <div className="leading-relaxed">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
                    {sectionOrder.map((id) => (
                        <SortableSection key={id} id={id}>{sectionMapping[id]}</SortableSection>
                    ))}
                </SortableContext>
            </DndContext>
        </div>
      </div>
    </div>
  );
}