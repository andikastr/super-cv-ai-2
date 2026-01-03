"use client";

import { motion } from "framer-motion";
import { FileX, Upload, AlertTriangle, Search, LucideIcon } from "lucide-react";
import { ReactNode } from "react";

type EmptyStateVariant = "no-uploads" | "no-results" | "error" | "custom";

interface EmptyStateProps {
    variant?: EmptyStateVariant;
    title?: string;
    description?: string;
    action?: ReactNode;
    icon?: LucideIcon;
}

const variants: Record<Exclude<EmptyStateVariant, "custom">, { icon: LucideIcon; title: string; description: string }> = {
    "no-uploads": {
        icon: Upload,
        title: "No CVs Yet",
        description: "Upload your first CV to get started with AI-powered analysis.",
    },
    "no-results": {
        icon: Search,
        title: "No Results Found",
        description: "Try adjusting your search or filters.",
    },
    "error": {
        icon: AlertTriangle,
        title: "Something went wrong",
        description: "We couldn't load this content. Please try again later.",
    },
};


export function EmptyState({
    variant = "no-uploads",
    title,
    description,
    action,
    icon: CustomIcon,
}: EmptyStateProps) {
    const config = variant === "custom"
        ? { icon: CustomIcon || FileX, title: title || "No Content", description: description || "" }
        : variants[variant];

    const Icon = CustomIcon || config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-16 px-4 text-center"
        >

            <div className="relative mb-6">

                <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-purple-500/10 rounded-full blur-2xl" />


                <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-24 h-24 bg-slate-900/80 border border-white/10 rounded-2xl flex items-center justify-center shadow-lg"
                >

                    <div className="absolute inset-2 border border-dashed border-white/10 rounded-xl" />

                    <Icon size={32} className="text-slate-400" strokeWidth={1.5} />
                </motion.div>


                <motion.div
                    animate={{ y: [-3, 3, -3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-2 -right-2 w-3 h-3 bg-champagne-400/50 rounded-full"
                />
                <motion.div
                    animate={{ y: [3, -3, 3] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="absolute -bottom-1 -left-3 w-2 h-2 bg-indigo-400/40 rounded-full"
                />
            </div>


            <h3 className="text-lg font-bold text-white mb-2">
                {title || config.title}
            </h3>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed mb-6">
                {description || config.description}
            </p>


            {action && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {action}
                </motion.div>
            )}
        </motion.div>
    );
}
