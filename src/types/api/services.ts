export interface AdditionalService {
    id: number;
    name_ar: string;
    name_en: string;
    description_ar?: string;
    description_en?: string;
    price: number;
    pricingType: 'one_time' | 'per_hour' | 'per_attendee';
    category: string;
    branchId?: number | null; // Null if available in all branches
}

export interface ServiceCategory {
    id: string;
    name_ar: string;
    name_en: string;
}

export interface ServicesResponse {
    data: AdditionalService[];
    message: string;
}

export interface ServicesRequest {
    branchId?: number; // Filter by branch for branch-specific services
}
