"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Edit3, Save, X, Mail, Check, Shield } from "lucide-react";
import { useUpdateProfileMutation } from "../api/useProfile";
import type { UserProfile } from "../api/useProfile";

interface ProfileEditFormProps {
    profile: UserProfile;
}

export function ProfileEditForm({ profile }: ProfileEditFormProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(profile.name || "");

    const updateProfileMutation = useUpdateProfileMutation();

    useEffect(() => {
        setName(profile.name || "");
    }, [profile.name]);

    const handleSave = () => {
        updateProfileMutation.mutate(
            { userId: profile.id, data: { name } },
            {
                onSuccess: () => {
                    setIsEditing(false);
                },
            }
        );
    };

    const handleCancel = () => {
        setName(profile.name || "");
        setIsEditing(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            whileHover={{ y: -2 }}
            className="group bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-lg shadow-slate-200/80 dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-800 relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[#2F6BFF]/30 h-full"
        >
            {/* Gradient border effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2F6BFF]/5 to-[#3CE0B1]/5 rounded-2xl" />
            </div>

            {/* Background decoration */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-[#2F6BFF]/10 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2F6BFF] to-[#3CE0B1] flex items-center justify-center shadow-lg shadow-[#2F6BFF]/20"
                        >
                            <User size={20} className="text-white" />
                        </motion.div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Profile</h3>
                            <p className="text-xs text-slate-500">Personal information</p>
                        </div>
                    </div>
                    {!isEditing && (
                        <motion.button
                            onClick={() => setIsEditing(true)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#2F6BFF] bg-[#2F6BFF]/5 hover:bg-[#2F6BFF]/10 rounded-lg transition-colors"
                        >
                            <Edit3 size={14} />
                            Edit
                        </motion.button>
                    )}
                </div>

                <div className="space-y-4">
                    {/* Name field */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                            Display Name
                        </label>
                        {isEditing ? (
                            <motion.input
                                initial={{ scale: 0.98 }}
                                animate={{ scale: 1 }}
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-[#2F6BFF]/20 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#2F6BFF] transition-all"
                                placeholder="Enter your name"
                            />
                        ) : (
                            <p className="text-slate-900 dark:text-white font-semibold py-2.5 text-lg">
                                {profile.name || <span className="text-slate-400 italic font-normal">Not set</span>}
                            </p>
                        )}
                    </div>

                    {/* Email (read-only) */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                            Email Address
                        </label>
                        <div className="flex items-center gap-3 py-2.5">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                <Mail size={14} className="text-slate-400" />
                            </div>
                            <span className="text-slate-600 dark:text-slate-300 font-medium">{profile.email}</span>
                            <span className="text-xs px-2 py-1 bg-[#3CE0B1]/10 text-[#3CE0B1] rounded-full font-semibold flex items-center gap-1">
                                <Shield size={10} />
                                Verified
                            </span>
                        </div>
                    </div>

                    {/* Action buttons when editing */}
                    {isEditing && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-2 pt-2"
                        >
                            <motion.button
                                onClick={handleSave}
                                disabled={updateProfileMutation.isPending}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1 py-3 bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] hover:shadow-lg hover:shadow-[#2F6BFF]/25 disabled:opacity-50 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                {updateProfileMutation.isPending ? (
                                    <span className="animate-pulse">Saving...</span>
                                ) : (
                                    <>
                                        <Check size={16} />
                                        Save Changes
                                    </>
                                )}
                            </motion.button>
                            <motion.button
                                onClick={handleCancel}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-5 py-3 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                            >
                                <X size={16} />
                                Cancel
                            </motion.button>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
