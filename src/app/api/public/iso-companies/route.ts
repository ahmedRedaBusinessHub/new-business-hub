import { NextRequest } from "next/server";
import { apiGet, createApiResponse, handleApiError } from "@/lib/api";

export async function GET(request: NextRequest) {
    try {


        const res = await apiGet(`/public/iso-companies`);
        return await createApiResponse(res);
    } catch (error: any) {
        return handleApiError(error, "Failed to fetch iso companies");
    }
}
