"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Edit3, Save, X, Mail, Check } from "lucide-react";
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
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-800 relative overflow-hidden"
        >
            {/* Background decoration */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-[#2F6BFF]/5 to-[#3CE0B1]/5 rounded-full blur-2xl" />

            <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2F6BFF]/10 to-[#3CE0B1]/10 flex items-center justify-center">
                            <User size={20} className="text-[#2F6BFF]" />
                        </div>
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
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#2F6BFF] hover:bg-[#2F6BFF]/10 rounded-lg transition-colors"
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
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2F6BFF] focus:border-transparent transition-all"
                                placeholder="Enter your name"
                            />
                        ) : (
                            <p className="text-slate-900 dark:text-white font-medium py-2.5">
                                {profile.name || <span className="text-slate-400 italic">Not set</span>}
                            </p>
                        )}
                    </div>

                    {/* Email (read-only) */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                            Email Address
                        </label>
                        <div className="flex items-center gap-2 py-2.5">
                            <Mail size={16} className="text-slate-400" />
                            <span className="text-slate-600 dark:text-slate-300">{profile.email}</span>
                            <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full">
                                Verified
                            </span>
                        </div>
                    </div>

                    {/* Action buttons when editing */}
                    {isEditing && (
                        <div className="flex gap-2 pt-2">
                            <motion.button
                                onClick={handleSave}
                                disabled={updateProfileMutation.isPending}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1 py-2.5 bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] hover:shadow-lg disabled:opacity-50 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
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
                                className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                            >
                                <X size={16} />
                                Cancel
                            </motion.button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
