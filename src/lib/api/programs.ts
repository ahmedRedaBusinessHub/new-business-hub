import { apiGet } from '../api';

/**
 * Fetch a single program by ID
 * @param id - Program ID
 * @returns Program data with attached files
 */
export async function fetchProgramById(id: string | number) {
    const response = await apiGet(`/public/programs/${id}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch program: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Fetch list of programs with optional filters
 * @param query - Query parameters (page, limit, search, etc.)
 * @returns Paginated list of programs
 */
export async function fetchPrograms(query?: {
    page?: number;
    limit?: number;
    search?: string;
    search_by?: string;
}) {
    const params = new URLSearchParams();
    if (query?.page) params.append('page', query.page.toString());
    if (query?.limit) params.append('limit', query.limit.toString());
    if (query?.search) params.append('search', query.search);
    if (query?.search_by) params.append('search_by', query.search_by);

    const response = await apiGet(`/public/programs?${params.toString()}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch programs: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Program data interface
 */
export interface ProgramData {
    id: number;
    name_ar: string;
    name_en: string;
    detail_ar: string;
    detail_en: string;
    main_image_url?: string;
    image_urls?: string[];
    from_datetime?: string;
    to_datetime?: string;
    last_registration_date?: string;
    type?: number;
    subtype?: number;
    values?: any[];
    progress_steps?: any[];
    application_requirements?: any[];
    documents_requirements?: any[];
    promo_image?: string;
    promo_video?: string;
    status?: number;
}
