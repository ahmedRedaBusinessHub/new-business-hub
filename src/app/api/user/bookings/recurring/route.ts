import { NextRequest } from "next/server";
import { apiGet, apiPost, createApiResponse, handleApiError } from "@/lib/api";

/**
 * GET /api/user/bookings/recurring - Fetch current user's recurring bookings
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const queryParams = new URLSearchParams(searchParams.toString());
        const res = await apiGet(`/bookings/recurring?${queryParams.toString()}`, { requireAuth: true });
        return await createApiResponse(res);
    } catch (error: unknown) {
        return handleApiError(error, "Failed to fetch recurring bookings");
    }
}

/**
 * POST /api/user/bookings/recurring - Create a new recurring booking
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const res = await apiPost("/bookings/recurring", body, { requireAuth: true });
        return await createApiResponse(res, { successStatus: 201 });
    } catch (error: unknown) {
        return handleApiError(error, "Failed to create recurring booking");
    }
}
