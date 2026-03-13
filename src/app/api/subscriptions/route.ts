import { NextRequest } from "next/server";
import { apiPost, createApiResponse, handleApiError } from "@/lib/api";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const res = await apiPost("/subscriptions", body, { requireAuth: true });
        return await createApiResponse(res, { successStatus: 201 });
    } catch (error: unknown) {
        return handleApiError(error, "Failed to create subscription");
    }
}
