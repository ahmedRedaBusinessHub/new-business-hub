import { apiGet, createApiResponse, handleApiError } from "@/lib/api";

export async function GET() {
    try {


        const res = await apiGet(`/public/iso-companies`);
        return await createApiResponse(res);
    } catch (error: unknown) {
        return handleApiError(error, "Failed to fetch iso companies");
    }
}
