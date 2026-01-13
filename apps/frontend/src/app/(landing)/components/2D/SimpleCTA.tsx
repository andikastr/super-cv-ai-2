'use client';

import { motion } from 'framer-motion';
import { Upload, FileText, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useState } from 'react';

/**
 * SimpleCTA Component
 * 
 * 2D fallback call-to-action section for mobile/low-power devices.
 * Uses standard file input with drag-drop instead of particle effects.
 * 
 * Features:
 * - Standard file input with drag-drop
 * - CSS gradient backgrounds
 * - No particle systems
 * - Accessible upload zone
 */
export function SimpleCTA() {
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);

    /** Handle drag events */
    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    /** Handle file drop */
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            setFileName(files[0].name);
            // In production, this would trigger the upload flow
        }
    }, []);

    /** Handle file input change */
    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            setFileName(files[0].name);
        }
    }, []);

    return (
        <section className="py-24 px-4 relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 -z-10">
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(135deg, rgba(47, 107, 255, 0.05) 0%, rgba(60, 224, 177, 0.05) 100%)',
                    }}
                />
            </div>

            <div className="max-w-4xl mx-auto text-center">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to <span className="text-gradient-primary">supercharge</span> your CV?
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Upload your resume now and get instant AI-powered insights.
                    </p>
                </motion.div>

                {/* Upload Zone */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <label
                        htmlFor="cv-upload"
                        className={`
              block w-full max-w-xl mx-auto p-12 rounded-2xl border-2 border-dashed
              transition-all duration-300 cursor-pointer
              ${isDragging
                                ? 'border-[#2F6BFF] bg-[#2F6BFF]/10 scale-[1.02]'
                                : 'border-slate-300 dark:border-slate-600 hover:border-[#2F6BFF]/50 hover:bg-[#2F6BFF]/5'
                            }
            `}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            id="cv-upload"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="sr-only"
                        />

                        <div className="flex flex-col items-center gap-4">
                            {fileName ? (
                                <>
                                    <div className="w-16 h-16 rounded-full bg-[#3CE0B1]/20 flex items-center justify-center">
                                        <FileText size={32} className="text-[#3CE0B1]" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-medium text-slate-900 dark:text-white">{fileName}</p>
                                        <p className="text-sm text-slate-500">Click to change file</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 rounded-full bg-[#2F6BFF]/10 flex items-center justify-center">
                                        <Upload size={32} className="text-[#2F6BFF]" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-medium text-slate-900 dark:text-white">
                                            Drop your CV here or click to browse
                                        </p>
                                        <p className="text-sm text-slate-500 mt-1">
                                            Supports PDF, DOC, DOCX (max 10MB)
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </label>
                </motion.div>

                {/* Alternative CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <span className="text-slate-500">or</span>
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-2 text-[#2F6BFF] hover:underline font-medium"
                    >
                        <Sparkles size={16} />
                        Create account for full features
                        <ArrowRight size={16} />
                    </Link>
                </motion.div>

                {/* Trust Badges */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-wrap items-center justify-center gap-6 mt-12"
                >
                    {['ATS Optimized', 'Recruiter Approved', 'AI Powered', 'GDPR Compliant'].map((badge) => (
                        <div
                            key={badge}
                            className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-widest font-medium"
                        >
                            <div className="w-1.5 h-1.5 bg-[#3CE0B1] rounded-full" />
                            {badge}
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
