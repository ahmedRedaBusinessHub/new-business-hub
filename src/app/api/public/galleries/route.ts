import { NextRequest } from "next/server";
import { apiGet, createApiResponse, handleApiError } from "@/lib/api";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = new URLSearchParams();
        searchParams.forEach((value, key) => query.append(key, value));

        if (searchParams.has('search') && !searchParams.has('search_by')) {
            query.set('search_by', 'title_en,title_ar');
        }

        const res = await apiGet(`/public/galleries?${query.toString()}`);
        return await createApiResponse(res);
    } catch (error: any) {
        return handleApiError(error, "Failed to fetch galleries");
    }
}
