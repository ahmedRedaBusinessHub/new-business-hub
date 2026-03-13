import { useQuery } from "@tanstack/react-query";
import { fetchAvailability } from "@/lib/api/spaces";
import type { AvailabilityRequest, AvailabilityResponse } from "@/types/api/availability";

/**
 * React Query hook to check availability for a specific coworking space.
 */
export function useAvailability(request: AvailabilityRequest, enabled: boolean = true) {
    return useQuery<AvailabilityResponse, Error>({
        // Include request parameters in query key to refetch when they change
        queryKey: ["availability", request.space_id, request.start_datetime, request.end_datetime, request.attendees],
        queryFn: () => fetchAvailability(request),
        enabled: enabled && !!request.space_id && !!request.start_datetime && !!request.end_datetime,
    });
}
