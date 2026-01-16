import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Query keys
export const profileKeys = {
    profile: (userId: string) => ["profile", userId] as const,
    cvs: (userId: string) => ["profile", userId, "cvs"] as const,
};

// Types
export interface UserProfile {
    id: string;
    email: string;
    name: string | null;
    picture: string | null;
    credits: number;
    createdAt: string;
    updatedAt: string;
}

export interface UserCv {
    id: string;
    fileUrl: string;
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
    createdAt: string;
    updatedAt: string;
    analysisResult?: {
        candidate_name?: string;
        overall_score?: number;
    };
}

// Fetch functions
async function fetchProfile(userId: string): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/user/${userId}`);
    if (!response.ok) {
        throw new Error("Failed to fetch profile");
    }
    return response.json();
}

async function updateProfile(
    userId: string,
    data: { name?: string; picture?: string }
): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error("Failed to update profile");
    }
    return response.json();
}

async function changePassword(
    userId: string,
    data: { currentPassword: string; newPassword: string }
): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/user/${userId}/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Failed to change password" }));
        throw new Error(error.message || "Failed to change password");
    }
    return response.json();
}

async function fetchUserCvs(userId: string): Promise<UserCv[]> {
    const response = await fetch(`${API_BASE_URL}/user/${userId}/cvs`);
    if (!response.ok) {
        throw new Error("Failed to fetch CV history");
    }
    return response.json();
}

// Hooks
export function useProfileQuery(userId: string | null) {
    return useQuery({
        queryKey: profileKeys.profile(userId || ""),
        queryFn: () => fetchProfile(userId!),
        enabled: !!userId,
    });
}

export function useUpdateProfileMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, data }: { userId: string; data: { name?: string; picture?: string } }) =>
            updateProfile(userId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: profileKeys.profile(variables.userId) });
        },
    });
}

export function useChangePasswordMutation() {
    return useMutation({
        mutationFn: ({
            userId,
            data,
        }: {
            userId: string;
            data: { currentPassword: string; newPassword: string };
        }) => changePassword(userId, data),
    });
}

export function useUserCvsQuery(userId: string | null) {
    return useQuery({
        queryKey: profileKeys.cvs(userId || ""),
        queryFn: () => fetchUserCvs(userId!),
        enabled: !!userId,
    });
}
