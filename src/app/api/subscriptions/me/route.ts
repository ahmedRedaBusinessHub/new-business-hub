import { apiGet, createApiResponse, handleApiError } from "@/lib/api";

export async function GET() {
    try {
        const res = await apiGet("/subscriptions/me", { requireAuth: true });
        return await createApiResponse(res);
    } catch (error: unknown) {
        return handleApiError(error, "Failed to fetch user subscriptions");
    }
}
