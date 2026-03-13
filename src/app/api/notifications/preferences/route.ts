import { NextRequest } from "next/server";
import { apiGet, apiPatch, createApiResponse, handleApiError } from "@/lib/api";

export async function GET(request: NextRequest) {
    try {
        const res = await apiGet('/notifications/preferences', { requireAuth: true });
        return await createApiResponse(res);
    } catch (error: unknown) {
        return handleApiError(error, "Failed to fetch notification preferences");
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const res = await apiPatch('/notifications/preferences', body, { requireAuth: true });
        return await createApiResponse(res);
    } catch (error: unknown) {
        return handleApiError(error, "Failed to update notification preferences");
    }
}
