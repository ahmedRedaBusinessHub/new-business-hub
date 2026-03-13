import { NextRequest } from "next/server";
import { apiGet, createApiResponse, handleApiError } from "@/lib/api";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const branchId = searchParams.get("branchId");
        const serviceType = searchParams.get("serviceType");

        const backendParams = new URLSearchParams();
        if (branchId) backendParams.append("branch_id", branchId);
        if (serviceType) backendParams.append("service_type", serviceType);

        // This proxies to /api/v1/additional-services in the backend
        const res = await apiGet(`/additional-services${backendParams.toString() ? `?${backendParams.toString()}` : ""}`, {
            requireAuth: false, // Set to true if you want to require authentication (though it's called 'public')
        });

        return await createApiResponse(res);
    } catch (error: unknown) {
        return handleApiError(error, "Failed to fetch additional services");
    }
}
