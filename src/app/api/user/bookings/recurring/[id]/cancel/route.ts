import { NextRequest } from "next/server";
import { apiPost, createApiResponse, handleApiError } from "@/lib/api";

/**
 * POST /api/user/bookings/recurring/[id]/cancel - Cancel a recurring booking series
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const res = await apiPost(`/bookings/recurring/${id}/cancel`, {}, { requireAuth: true });
        return await createApiResponse(res);
    } catch (error: unknown) {
        return handleApiError(error, "Failed to cancel recurring booking series");
    }
}
