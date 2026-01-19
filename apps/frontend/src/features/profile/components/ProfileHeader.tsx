"use client";

import { motion } from "framer-motion";
import { User, Mail, Calendar, Camera, Loader2, Sparkles, Crown } from "lucide-react";
import type { UserProfile } from "../api/useProfile";

interface ProfileHeaderProps {
    profile: UserProfile;
    onAvatarChange?: (file: File) => void;
    isUploadingAvatar?: boolean;
}

export function ProfileHeader({ profile, onAvatarChange, isUploadingAvatar }: ProfileHeaderProps) {
    const memberSince = new Date(profile.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
    });

    const handleAvatarClick = () => {
        if (isUploadingAvatar) return;
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file && onAvatarChange) {
                onAvatarChange(file);
            }
        };
        input.click();
    };

    // Get initials for avatar fallback
    const getInitials = (name: string | null) => {
        if (!name) return "U";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-gradient-to-r from-[#2F6BFF] via-[#5B8BFF] to-[#3CE0B1] rounded-3xl p-6 sm:p-8 text-white overflow-hidden shadow-2xl shadow-[#2F6BFF]/20"
        >
            {/* Animated background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Floating orbs */}
                <motion.div
                    animate={{
                        x: [0, 30, 0],
                        y: [0, -20, 0],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"
                />
                <motion.div
                    animate={{
                        x: [0, -20, 0],
                        y: [0, 30, 0],
                        scale: [1, 1.3, 1]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"
                />

                {/* Dot pattern */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                        backgroundSize: '20px 20px',
                    }}
                />

                {/* Shimmer effect */}
                <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                />
            </div>

            <div className="relative flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
                {/* Avatar */}
                <div className="relative group">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white/20 backdrop-blur-sm border-4 border-white/40 overflow-hidden relative shadow-2xl"
                    >
                        {profile.picture ? (
                            <img
                                src={profile.picture}
                                alt={profile.name || "Profile"}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-white/10 text-3xl font-bold">
                                {getInitials(profile.name)}
                            </div>
                        )}
                        {/* Loading overlay */}
                        {isUploadingAvatar && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Loader2 size={28} className="animate-spin text-white" />
                            </div>
                        )}
                    </motion.div>

                    {/* Camera button */}
                    <motion.button
                        onClick={handleAvatarClick}
                        disabled={isUploadingAvatar}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="absolute -bottom-2 -right-2 w-10 h-10 bg-white text-[#2F6BFF] rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50"
                        title="Change avatar"
                    >
                        <Camera size={18} />
                    </motion.button>

                    {/* Pro badge (optional) */}
                    {profile.credits > 5 && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-500 rounded-lg flex items-center justify-center shadow-lg"
                        >
                            <Crown size={14} className="text-white" />
                        </motion.div>
                    )}
                </div>

                {/* Info */}
                <div className="text-center sm:text-left flex-1">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                        <h1 className="text-2xl sm:text-3xl font-bold">
                            {profile.name || "Anonymous User"}
                        </h1>
                        <motion.div
                            animate={{ rotate: [0, 15, -15, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        >
                            <Sparkles size={22} className="text-white/80" />
                        </motion.div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                        <motion.span
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/20 rounded-full backdrop-blur-sm text-sm transition-colors"
                        >
                            <Mail size={14} />
                            {profile.email}
                        </motion.span>
                        <motion.span
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/20 rounded-full backdrop-blur-sm text-sm transition-colors"
                        >
                            <Calendar size={14} />
                            Since {memberSince}
                        </motion.span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
