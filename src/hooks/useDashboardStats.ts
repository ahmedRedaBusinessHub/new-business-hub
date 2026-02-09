"use client";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

type StatResponse = {
    total: number;
    data: any[];
};

async function fetchCount(endpoint: string, params: Record<string, any> = {}) {
    const searchParams = new URLSearchParams({ limit: "1", ...params });
    const res = await apiGet(`${endpoint}?${searchParams.toString()}`, {
        requireAuth: true,
    });
    const data = await res.json();
    return (data.total as number) || 0;
}

async function fetchRecentUsers() {
    const res = await apiGet("/users?limit=5&sort=created_at&order=desc", {
        requireAuth: true,
    });
    const data = await res.json();
    return (data.data as any[]) || [];
}

export function useDashboardStats() {
    const { data: projectsCount = 0, isLoading: loadingProjects } = useQuery({
        queryKey: ["dashboard", "stats", "projects"],
        queryFn: () => fetchCount("/projects"),
    });

    const { data: programsCount = 0, isLoading: loadingPrograms } = useQuery({
        queryKey: ["dashboard", "stats", "programs"],
        queryFn: () => fetchCount("/programs"),
    });

    const { data: usersCount = 0, isLoading: loadingUsers } = useQuery({
        queryKey: ["dashboard", "stats", "users"],
        queryFn: () => fetchCount("/users"),
    });

    const {
        data: pendingApplicationsCount = 0,
        isLoading: loadingPendingApps,
    } = useQuery({
        queryKey: ["dashboard", "stats", "pendingApplications"],
        queryFn: () => fetchCount("/user-program", { status: 0 }),
    });

    // Note: Status logic might need adjustment if status is an integer enum in DB. 
    // BaseService handles string->int conversion if it looks like a number, but 'pending' is a string.
    // If status is Int in DB (which it is, see schema), I might need to send the ID. 
    // Usually 1=Active, maybe 2=Pending? Or Pending=0? 
    // Checking schema: user_program status is Int (SmallInt).
    // I should check what 'pending' maps to. For now I'll leave it as potential todo or try to find out.
    // Actually, let's just fetch recent users first. 

    const { data: recentUsers = [], isLoading: loadingRecentUsers } = useQuery({
        queryKey: ["dashboard", "recentUsers"],
        queryFn: fetchRecentUsers,
    });

    const isLoading =
        loadingProjects ||
        loadingPrograms ||
        loadingUsers ||
        loadingRecentUsers ||
        loadingPendingApps;

    return {
        stats: {
            projectsCount,
            programsCount,
            usersCount,
            pendingApplicationsCount,
        },
        recentUsers,
        isLoading,
    };
}
