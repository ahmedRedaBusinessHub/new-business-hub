import { useQuery } from "@tanstack/react-query";
import { fetchServices } from "@/lib/api/services";
import type { ServicesRequest, AdditionalService } from "@/types/api/services";

/**
 * Hook for fetching additional services.
 */
export function useServices(filters?: ServicesRequest, options?: { enabled?: boolean }) {
    return useQuery<AdditionalService[]>({
        queryKey: ["services", filters],
        queryFn: () => fetchServices(filters),
        staleTime: 1000 * 60 * 15, // 15 minutes
        enabled: options?.enabled,
    });
}
