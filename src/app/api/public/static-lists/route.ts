import { NextRequest, NextResponse } from "next/server";
import { apiGet, createApiResponse, handleApiError } from "@/lib/api";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const namespace = searchParams.get("namespace");

        if (!namespace) {
            return NextResponse.json({ error: "Namespace is required" }, { status: 400 });
        }

        // Proxy the request to the backend static lists endpoint
        // Assuming backend endpoint is /static-lists with namespace query param or similar
        // Or if it's using the standard CRUD resource 'static-lists' or 'static_lists'

        // Based on staticListsCache.ts: /api/static-lists?namespace=...
        // The backend likely has a 'static_lists' or 'static-lists' endpoint.
        // Let's assume standard CRUD or designated controller.
        // Usually it's `GET /static-lists?namespace=...` or `GET /static-lists?filter[namespace]=...`

        // Let's try to hit the backend `static-lists` resource with the filter.
        // If the backend is using the base service, it might be `static_lists`.

        // We will try fetching from `/static-lists` with a filter on namespace.
        // Or if there is a specific endpoint for fetching by namespace.

        // Looking at public.service.ts, there was `categoriesStaticList` fetch example:
        // this.prisma.static_lists.findFirst({ where: { namespace: 'project.categories', status: 1 } })

        // So the backend likely exposes `static_lists` (snake_case) or `static-lists`.

        // Let's assume the backend resource is `static-lists` and we filter by namespace.
        // Note: The `ProgramsManagement.tsx` used `staticListsCache` which calls THIS frontend endpoint.

        // We use the public static lists endpoint we just enabled
        const res = await apiGet(`/public/static-lists?namespace=${namespace}`, {
            requireAuth: false,
        });

        return await createApiResponse(res);
    } catch (error: any) {
        return handleApiError(error, "Failed to fetch static list");
    }
}
