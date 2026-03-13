import { NextRequest } from "next/server";
import { apiGet, apiPut, createApiResponse, handleApiError } from "@/lib/api";

/**
 * GET /api/user/bookings/[id] - Get booking details by ID
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const res = await apiGet(`/bookings/${id}`, { requireAuth: true });
        return await createApiResponse(res);
    } catch (error: unknown) {
        return handleApiError(error, "Failed to fetch booking details");
    }
}

/**
 * PUT /api/user/bookings/[id] - Modify a booking
 * Translates frontend field names to backend field names
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Translate frontend field names to backend field names (matching POST mapping in parent route)
        const backendBody = {
            coworking_space_id: body.space_id ?? body.coworking_space_id,
            start_datetime: body.start_date ?? body.start_datetime,
            end_datetime: body.end_date ?? body.end_datetime,
            attendees: body.attendees,
            pricing_tier: body.pricing_tier,
            additional_service_ids: body.additional_service_ids,
        };

        const res = await apiPut(`/bookings/${id}`, backendBody, { requireAuth: true });
        return await createApiResponse(res);
    } catch (error: unknown) {
        return handleApiError(error, "Failed to modify booking");
    }
}
