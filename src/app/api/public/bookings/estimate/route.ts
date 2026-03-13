import { NextRequest } from "next/server";
import { apiPost, createApiResponse, handleApiError } from "@/lib/api";

/**
 * POST /api/public/bookings/estimate - Calculate price estimate
 * Translates frontend field names to backend field names
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Translate frontend field names to backend field names
        const backendBody = {
            coworking_space_id: body.space_id ?? body.coworking_space_id,
            start_datetime: body.start_date ?? body.start_datetime,
            end_datetime: body.end_date ?? body.end_datetime,
            attendees: body.attendees,
            pricing_tier: body.pricing_tier,
            additional_service_ids: body.additional_service_ids,
        };

        const res = await apiPost(`/bookings/estimate`, backendBody, {
            requireAuth: false,
        });

        return await createApiResponse(res);
    } catch (error: unknown) {
        return handleApiError(error, "Failed to calculate price estimate");
    }
}
