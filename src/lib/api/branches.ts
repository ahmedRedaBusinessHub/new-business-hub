import type { Branch, BranchFilters, BranchesListResponse, BranchDetailsResponse } from "@/types/api/branches";
import { apiPost, apiPatch, apiDelete } from "@/lib/api";
import type { CreateBranchData, UpdateBranchData } from "@/lib/schemas/branch";

/**
 * Fetches a paginated list of branches based on filters.
 */
export async function fetchBranches(
    filters?: BranchFilters,
    page = 1,
    limit = 10
): Promise<BranchesListResponse> {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    if (filters) {
        if (filters.city) params.append("city", filters.city);
        if (filters.has_studio !== undefined) params.append("has_studio", filters.has_studio.toString());
        if (filters.status !== undefined) params.append("status", filters.status.toString());
    }

    // Use the proxy endpoint (public branches)
    const response = await fetch(`/api/public/branches?${params.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch branches");
    }

    const responseData = await response.json();

    // Transform response to match PaginatedResponse interface
    // Backend often returns data wrapped in a 'data' object
    const inner = responseData.data;
    const listData = inner?.data || [];
    const total = inner?.total || 0;

    return {
        data: listData,
        total: total,
        page: inner?.page || page,
        limit: inner?.limit || limit,
        totalPages: Math.ceil(total / (inner?.limit || limit || 10)),
    };
}

/**
 * Fetches detailed information for a specific branch.
 */
export async function fetchBranchDetails(id: string | number): Promise<BranchDetailsResponse> {
    const response = await fetch(`/api/public/branches/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch details for branch ${id}`);
    }

    const responseData = await response.json();
    // Return the data directly
    return responseData.data?.data || responseData.data;
}

/**
 * Creates a new branch (Admin)
 */
export async function createBranch(data: CreateBranchData): Promise<BranchDetailsResponse> {
    const payload: any = { ...data };

    // Map frontend fields to backend DTO expectations
    payload.city = payload.city_en || payload.city_ar || "Riyadh";
    payload.address = payload.address_en || payload.address_ar || "";

    // Remove fields not supported by the backend DTO
    delete payload.city_en;
    delete payload.address_en;
    delete payload.description_ar;
    delete payload.description_en;
    delete payload.has_studio;
    delete payload.whatsapp;
    if (payload.email === "") delete payload.email; // Don't send empty string email

    const response = await fetch('/api/admin/branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to create branch");
    }

    const result = await response.json();
    return result.data;
}

/**
 * Updates an existing branch (Admin)
 */
export async function updateBranch(id: number | string, data: UpdateBranchData): Promise<BranchDetailsResponse> {
    const payload: any = { ...data };

    // Map frontend fields to backend DTO expectations
    if (payload.city_en || payload.city_ar) {
        payload.city = payload.city_en || payload.city_ar;
        delete payload.city_en;
    }
    if (payload.address_en || payload.address_ar) {
        payload.address = payload.address_en || payload.address_ar;
        delete payload.address_en;
    }

    // Remove fields not supported by the backend DTO
    delete payload.description_ar;
    delete payload.description_en;
    delete payload.has_studio;
    delete payload.whatsapp;
    if (payload.email === "") delete payload.email;

    const response = await fetch(`/api/admin/branches/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to update branch ${id}`);
    }

    const result = await response.json();
    return result.data;
}

/**
 * Deletes a branch (Admin)
 */
export async function deleteBranch(id: number | string): Promise<void> {
    const response = await fetch(`/api/admin/branches/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to delete branch ${id}`);
    }
}
