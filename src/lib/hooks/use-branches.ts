import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchBranches,
    fetchBranchDetails,
    createBranch,
    updateBranch,
    deleteBranch
} from "@/lib/api/branches";
import type {
    BranchFilters,
    BranchesListResponse,
    BranchDetailsResponse
} from "@/types/api/branches";
import type { UpdateBranchData } from "@/lib/schemas/branch";

/**
 * React Query hook to fetch branches with filters.
 */
export function useBranches(filters?: BranchFilters, page = 1, limit = 10) {
    return useQuery<BranchesListResponse, Error>({
        queryKey: ["branches", filters, page, limit],
        queryFn: () => fetchBranches(filters, page, limit),
    });
}

/**
 * React Query hook to fetch a specific branch details.
 */
export function useBranchDetails(id: string | number) {
    return useQuery<BranchDetailsResponse, Error>({
        queryKey: ["branchDetails", id],
        queryFn: () => fetchBranchDetails(id),
        enabled: !!id,
    });
}

/**
 * React Query mutation hook to create a branch (Admin)
 */
export function useCreateBranch() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createBranch,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["branches"] });
        },
    });
}

/**
 * React Query mutation hook to update a branch (Admin)
 */
export function useUpdateBranch() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string | number; data: UpdateBranchData }) => updateBranch(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["branches"] });
            queryClient.invalidateQueries({ queryKey: ["branchDetails", variables.id] });
        },
    });
}

/**
 * React Query mutation hook to delete a branch (Admin)
 */
export function useDeleteBranch() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteBranch,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["branches"] });
        },
    });
}
