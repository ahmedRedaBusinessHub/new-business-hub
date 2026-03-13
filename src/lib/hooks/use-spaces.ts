import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSpaces, fetchSpaceDetails, createSpace, updateSpace, deleteSpace, uploadImages } from "@/lib/api/spaces";
import type { SpaceFilters, SpacesListResponse, SpaceDetailsResponse } from "@/types/api/spaces";

/**
 * React Query hook to fetch coworking spaces with filters.
 */
export function useSpaces(filters?: SpaceFilters, page = 1, limit = 10) {
    return useQuery<SpacesListResponse, Error>({
        queryKey: ["spaces", filters, page, limit],
        queryFn: () => fetchSpaces(filters, page, limit),
    });
}

/**
 * React Query hook to fetch a specific coworking space details.
 */
export function useSpaceDetails(id: string | number) {
    return useQuery<SpaceDetailsResponse, Error>({
        queryKey: ["spaceDetails", id],
        queryFn: () => fetchSpaceDetails(id),
        enabled: !!id,
    });
}

/**
 * React Query mutation hook to create a coworking space (Admin)
 */
export function useCreateSpace() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createSpace,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["spaces"] });
            queryClient.invalidateQueries({ queryKey: ["admin_spaces"] });
        },
    });
}

/**
 * React Query mutation hook to update a coworking space (Admin)
 */
export function useUpdateSpace() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string | number; data: import("@/lib/schemas/space").UpdateSpaceData }) => updateSpace(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["spaces"] });
            queryClient.invalidateQueries({ queryKey: ["admin_spaces"] });
            queryClient.invalidateQueries({ queryKey: ["admin_space_details", variables.id] });
            queryClient.invalidateQueries({ queryKey: ["spaceDetails", variables.id] });
        },
    });
}

/**
 * React Query mutation hook to delete a coworking space (Admin)
 */
export function useDeleteSpace() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteSpace,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["spaces"] });
            queryClient.invalidateQueries({ queryKey: ["admin_spaces"] });
        },
    });
}

/**
 * React Query mutation hook to upload images for a coworking space (Admin)
 */
export function useUploadSpaceImages() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, files }: { id: string | number; files: FileList | File[] }) => uploadImages(id, files),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["admin_space_details", variables.id] });
            queryClient.invalidateQueries({ queryKey: ["spaceDetails", variables.id] });
        },
    });
}
