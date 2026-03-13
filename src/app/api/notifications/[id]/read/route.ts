import { NextRequest } from "next/server";
import { apiPatch, createApiResponse, handleApiError } from "@/lib/api";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const res = await apiPatch(`/notifications/${id}/read`, {}, { requireAuth: true });
        return await createApiResponse(res);
    } catch (error: unknown) {
        console.error('Error marking notification as read:', error);
        return handleApiError(error, "Failed to mark notification as read");
    }
}
