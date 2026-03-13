import type { ServicesRequest, AdditionalService } from "@/types/api/services";

/**
 * Fetches available additional services, optionally filtered by branch.
 */
export async function fetchServices(filters?: ServicesRequest): Promise<AdditionalService[]> {
    const params = new URLSearchParams();
    if (filters?.branchId !== undefined) {
        params.append("branchId", filters.branchId.toString());
    }

    const query = params.toString();
    const url = `/api/public/services${query ? `?${query}` : ''}`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch additional services");
    }

    const responseData = await response.json();
    // The backend response is wrapped by TransformResponseInterceptor:
    // { statusCode, data: { data: [...], total, message } }
    const result = responseData.data;
    const services = result?.data || [];

    // Map backend fields to frontend types
    return services.map((s: any) => ({
        id: s.id,
        name_ar: s.name_ar || s.name_en,
        name_en: s.name_en,
        description_ar: s.description_ar,
        description_en: s.description_en,
        price: Number(s.base_price),
        pricingType: s.pricing_unit === 'HOUR' ? 'per_hour' : 'one_time',
        category: s.service_type,
        branchId: filters?.branchId
    }));
}
