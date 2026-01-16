"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useProfileQuery, useUserCvsQuery, useUpdateProfileMutation } from "@/features/profile/api/useProfile";
import { ProfileHeader } from "@/features/profile/components/ProfileHeader";
import { ProfileEditForm } from "@/features/profile/components/ProfileEditForm";
import { CreditsCard } from "@/features/profile/components/CreditsCard";
import { CvHistoryList } from "@/features/profile/components/CvHistoryList";
import { AccountSettings } from "@/features/profile/components/AccountSettings";

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const updateProfileMutation = useUpdateProfileMutation();

    // Redirect if not authenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    const userId = session?.user?.id;
    const { data: profile, isLoading: profileLoading } = useProfileQuery(userId || null);
    const { data: cvs, isLoading: cvsLoading } = useUserCvsQuery(userId || null);

    // Resize image to max dimensions to reduce base64 size
    const resizeImage = (file: File, maxSize: number = 200): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Calculate new dimensions
                    if (width > height) {
                        if (width > maxSize) {
                            height = (height * maxSize) / width;
                            width = maxSize;
                        }
                    } else {
                        if (height > maxSize) {
                            width = (width * maxSize) / height;
                            height = maxSize;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.8));
                };
                img.onerror = reject;
                img.src = e.target?.result as string;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    // Handle avatar change - resize and convert to base64 data URL
    const handleAvatarChange = async (file: File) => {
        if (!userId) return;

        setIsUploadingAvatar(true);
        try {
            const resizedDataUrl = await resizeImage(file);
            updateProfileMutation.mutate(
                { userId, data: { picture: resizedDataUrl } },
                { onSettled: () => setIsUploadingAvatar(false) }
            );
        } catch {
            setIsUploadingAvatar(false);
        }
    };

    if (status === "loading" || profileLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <Loader2 className="animate-spin text-indigo-500" size={48} />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <p className="text-slate-500">Unable to load profile</p>
            </div>
        );
    }

    // Check if user has a password (for showing account settings)
    // This is a heuristic - users who signed up via OAuth typically don't have a password
    // For now, we'll assume they can change password if they have one set
    const hasPassword = true; // Backend will handle the actual check

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white transition-colors pb-8 overflow-hidden">
            {/* Background decorations */}
            <div className="hidden sm:block fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)`,
                        backgroundSize: '32px 32px',
                    }}
                />
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#2F6BFF]/10 rounded-full blur-[100px]" />
                <div className="absolute top-1/2 -left-40 w-80 h-80 bg-[#3CE0B1]/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pt-20 sm:pt-24">
                {/* Back button */}
                <Link
                    href="/app"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-[#2F6BFF] mb-4 sm:mb-6 transition-colors text-sm sm:text-base group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>

                {/* Profile Header */}
                <ProfileHeader
                    profile={profile}
                    onAvatarChange={handleAvatarChange}
                    isUploadingAvatar={isUploadingAvatar}
                />

                {/* Main content grid */}
                <div className="mt-6 space-y-6">
                    {/* Top row: Profile + Credits side by side */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <ProfileEditForm profile={profile} />
                        </div>
                        <div>
                            <CreditsCard credits={profile.credits} />
                        </div>
                    </div>

                    {/* Bottom row: CV History + Password */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <CvHistoryList cvs={cvs || []} isLoading={cvsLoading} />
                        <AccountSettings userId={profile.id} hasPassword={hasPassword} />
                    </div>
                </div>
            </div>
        </div>
    );
}
