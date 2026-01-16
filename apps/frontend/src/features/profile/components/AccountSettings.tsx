"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Check, AlertCircle, Shield } from "lucide-react";
import { useChangePasswordMutation } from "../api/useProfile";

interface AccountSettingsProps {
    userId: string;
    hasPassword: boolean;
}

export function AccountSettings({ userId, hasPassword }: AccountSettingsProps) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const changePasswordMutation = useChangePasswordMutation();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage("");

        if (newPassword !== confirmPassword) {
            return;
        }

        changePasswordMutation.mutate(
            { userId, data: { currentPassword, newPassword } },
            {
                onSuccess: () => {
                    setSuccessMessage("Password changed successfully!");
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                },
            }
        );
    };

    const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0;
    const isValid = currentPassword.length > 0 && newPassword.length >= 6 && passwordsMatch;

    if (!hasPassword) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-800 relative overflow-hidden"
            >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-[#2F6BFF]/5 to-[#3CE0B1]/5 rounded-full blur-2xl" />

                <div className="relative">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2F6BFF]/10 to-[#3CE0B1]/10 flex items-center justify-center">
                            <Shield size={20} className="text-[#2F6BFF]" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Security</h3>
                            <p className="text-xs text-slate-500">Account protection</p>
                        </div>
                    </div>
                    <div className="p-4 bg-[#2F6BFF]/5 rounded-xl border border-[#2F6BFF]/10">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            You signed in with Google. Password management is handled by your Google account.
                        </p>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-800 relative overflow-hidden"
        >
            {/* Background decoration */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-[#2F6BFF]/5 to-[#3CE0B1]/5 rounded-full blur-2xl" />

            <div className="relative">
                {/* Header */}
                <div className="flex items-center gap-2 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2F6BFF]/10 to-[#3CE0B1]/10 flex items-center justify-center">
                        <Lock size={20} className="text-[#2F6BFF]" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">Password</h3>
                        <p className="text-xs text-slate-500">Update your password</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Current Password */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full px-4 py-2.5 pr-10 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2F6BFF] focus:border-transparent transition-all"
                                placeholder="Enter current password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2.5 pr-10 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2F6BFF] focus:border-transparent transition-all"
                                placeholder="Min 6 characters"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`w-full px-4 py-2.5 border rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2F6BFF] focus:border-transparent transition-all ${confirmPassword.length > 0 && !passwordsMatch
                                    ? "border-red-300 dark:border-red-600"
                                    : "border-slate-200 dark:border-slate-700"
                                }`}
                            placeholder="Confirm new password"
                        />
                        {confirmPassword.length > 0 && !passwordsMatch && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle size={12} />
                                Passwords do not match
                            </p>
                        )}
                    </div>

                    {/* Error message */}
                    {changePasswordMutation.isError && (
                        <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-500/10 p-3 rounded-xl">
                            <AlertCircle size={16} />
                            {changePasswordMutation.error?.message || "Failed to change password"}
                        </div>
                    )}

                    {/* Success message */}
                    {successMessage && (
                        <div className="flex items-center gap-2 text-[#3CE0B1] text-sm bg-[#3CE0B1]/10 p-3 rounded-xl">
                            <Check size={16} />
                            {successMessage}
                        </div>
                    )}

                    {/* Submit button */}
                    <motion.button
                        type="submit"
                        disabled={!isValid || changePasswordMutation.isPending}
                        whileHover={isValid ? { scale: 1.02 } : {}}
                        whileTap={isValid ? { scale: 0.98 } : {}}
                        className="w-full py-3 bg-gradient-to-r from-[#2F6BFF] to-[#3CE0B1] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all"
                    >
                        {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
}
