import { NextRequest } from "next/server";
import { apiPost, createApiResponse, handleApiError } from "@/lib/api";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const res = await apiPost(`/admin/subscriptions/${id}/cancel`, {}, { requireAuth: true });
        return await createApiResponse(res);
    } catch (error: unknown) {
        return handleApiError(error, "Failed to cancel subscription");
    }
}
