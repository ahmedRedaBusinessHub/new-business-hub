import { NextRequest } from "next/server";
import { apiGet, createApiResponse, handleApiError } from "@/lib/api";

export async function GET(request: NextRequest) {
    try {
        const query = request.nextUrl.searchParams.toString();
        const res = await apiGet(`/notifications${query ? `?${query}` : ''}`, { requireAuth: true });
        return await createApiResponse(res);
    } catch (error: unknown) {
        return handleApiError(error, "Failed to fetch notifications");
    }
}
