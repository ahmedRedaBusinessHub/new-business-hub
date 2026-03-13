import { NextRequest } from "next/server";
import { apiPatch, createApiResponse, handleApiError } from "@/lib/api";

export async function PATCH(request: NextRequest) {
    try {
        const res = await apiPatch('/notifications/read-all', undefined, { requireAuth: true });
        return await createApiResponse(res);
    } catch (error: unknown) {
        return handleApiError(error, "Failed to mark all notifications as read");
    }
}
