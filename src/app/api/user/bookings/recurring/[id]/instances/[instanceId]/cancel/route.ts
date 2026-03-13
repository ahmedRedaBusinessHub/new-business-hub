import { NextRequest } from "next/server";
import { apiPost, createApiResponse, handleApiError } from "@/lib/api";

/**
 * POST /api/user/bookings/recurring/[id]/instances/[instanceId]/cancel
 * Cancel a single instance within a recurring series
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; instanceId: string }> }
) {
    try {
        const { id, instanceId } = await params;
        const res = await apiPost(
            `/bookings/recurring/${id}/instances/${instanceId}/cancel`,
            {},
            { requireAuth: true }
        );
        return await createApiResponse(res);
    } catch (error: unknown) {
        return handleApiError(error, "Failed to cancel booking instance");
    }
}
