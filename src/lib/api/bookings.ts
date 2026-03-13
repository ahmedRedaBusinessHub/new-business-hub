import { CreateBookingData, Booking, BookingFilters, CreateRecurringBookingData, RecurringBooking } from '@/types/api/bookings';
import { PaginatedResponse } from '@/types/api/common';

/**
 * Creates a new booking for a coworking space.
 *
 * @param data - Booking details including space ID, dates, pricing tier, and optional services
 * @returns The created booking with normalized field names
 * @throws {Error} When the server returns a non-ok response
 */
export async function createBooking(data: CreateBookingData): Promise<Booking> {
    const response = await fetch('/api/user/bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create booking');
    }

    const responseData = await response.json();
    // Backend returns { statusCode, data: { data: booking, message } }
    // Frontend proxy passes through the full backend response
    const outerData = responseData.data;
    const raw = outerData?.data ?? outerData;

    // Normalize backend field names to frontend naming conventions
    return {
        ...raw,
        space_id: raw?.space_id ?? raw?.coworking_space_id,
        start_date: raw?.start_date ?? raw?.start_datetime,
        end_date: raw?.end_date ?? raw?.end_datetime,
        space: raw?.space ?? raw?.coworking_space,
    } as Booking;
}

export interface PriceEstimateResponse {
    base_price: number;
    discount_applied: number;
    tax_amount: number;
    total_price: number;
    breakdown: {
        hourly_rate?: number;
        daily_rate?: number;
        total_hours?: number;
        total_days?: number;
        services_total?: number;
        services?: { name: string; price: number }[];
    };
}

/**
 * Retrieves a price estimate for a potential booking without committing it.
 *
 * @param data - Same shape as createBooking; used to calculate cost breakdown
 * @returns Price estimate including base, tax, discount, and total amounts
 * @throws {Error} When the estimate endpoint returns a non-ok response
 */
export async function getPriceEstimate(data: CreateBookingData): Promise<PriceEstimateResponse> {
    const response = await fetch('/api/public/bookings/estimate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to get price estimate');
    }

    const responseData = await response.json();
    const outerData = responseData.data;
    return outerData?.data ?? outerData;
}

/**
 * Fetches detailed information for a single booking by ID.
 * Works in both server (Node.js) and client (browser) environments.
 *
 * @param id - Booking ID (number or string)
 * @returns The booking with normalized field names
 * @throws {Error} When the booking is not found or the request fails
 */
export async function fetchBookingDetails(id: string | number): Promise<Booking> {
    let responseData: unknown;

    if (typeof window === 'undefined') {
        // Server-side: call the backend directly (relative URLs don't work in Node.js)
        const { apiGet } = await import('@/lib/api');
        const res = await apiGet(`/bookings/${id}`, { requireAuth: true });
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error((errorData as { message?: string }).message || 'Failed to fetch booking details');
        }
        responseData = await res.json();
    } else {
        // Client-side: route through the Next.js API proxy
        const response = await fetch(`/api/user/bookings/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to fetch booking details');
        }
        responseData = await response.json();
    }

    const outerData = (responseData as { data: any }).data;
    const raw = outerData?.data ?? outerData;

    // Normalize backend field names to frontend naming conventions
    return {
        ...raw,
        space_id: raw.space_id ?? raw.coworking_space_id,
        start_date: raw.start_date ?? raw.start_datetime,
        end_date: raw.end_date ?? raw.end_datetime,
        space: raw.space ?? raw.coworking_space,
    } as Booking;
}

/**
 * Fetches a paginated list of bookings for the authenticated user.
 *
 * @param params - Filters (status, space_id, date range) and pagination options
 * @returns Paginated response containing bookings with normalized field names
 * @throws {Error} When the request fails or the user is not authenticated
 */
const bookingStatusToCode: Record<string, number> = {
    pending: 0,
    confirmed: 1,
    completed: 2,
    cancelled: 3,
};

export async function fetchUserBookings(params: BookingFilters & { page?: number; limit?: number }): Promise<PaginatedResponse<Booking>> {
    const queryParams = new URLSearchParams();
    if (params.status !== undefined) {
        const code = bookingStatusToCode[params.status];
        if (code !== undefined) queryParams.append('status', String(code));
    }
    if (params.space_id) queryParams.append('space_id', params.space_id.toString());
    const limit = params.limit ?? 10;

    if (params.page) queryParams.append('page', params.page.toString());
    queryParams.append('limit', limit.toString());
    if (params.start_date) queryParams.append('start_date', params.start_date);
    if (params.end_date) queryParams.append('end_date', params.end_date);

    const response = await fetch(`/api/user/bookings?${queryParams.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch user bookings');
    }

    const responseData = await response.json();

    // The backend structure for paginated response usually looks like:
    // { data: { data: Booking[], total: number, page: number, ... } }
    const outerData = responseData.data;
    const items = outerData.data || [];

    return {
        ...outerData,
        data: items.map((raw: Booking & { coworking_space_id?: number; start_datetime?: string; end_datetime?: string; coworking_space?: any }) => ({
            ...raw,
            space_id: raw.space_id ?? raw.coworking_space_id,
            start_date: raw.start_date ?? raw.start_datetime,
            end_date: raw.end_date ?? raw.end_datetime,
            space: raw.space ?? raw.coworking_space,
        })),
    };
}

/**
 * Cancels a booking by ID. The booking must belong to the authenticated user.
 *
 * @param id - Booking ID to cancel
 * @returns The updated booking in its cancelled state
 * @throws {Error} When the booking cannot be cancelled or is not found
 */
export async function cancelBooking(id: string | number): Promise<Booking> {
    const response = await fetch(`/api/user/bookings/${id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to cancel booking');
    }

    const responseData = await response.json();
    const outerData = responseData.data;
    return outerData?.data ?? outerData;
}

/**
 * Updates an existing booking's details (e.g. dates, attendee count, services).
 *
 * @param id - Booking ID to modify
 * @param data - Partial booking data containing only the fields to update
 * @returns The updated booking
 * @throws {Error} When the modification is rejected or the booking is not found
 */
export async function modifyBooking(id: string | number, data: Partial<CreateBookingData>): Promise<Booking> {
    const response = await fetch(`/api/user/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to modify booking');
    }

    const responseData = await response.json();
    const outerData = responseData.data;
    return outerData?.data ?? outerData;
}

/**
 * Force-cancels a booking as an admin, with an optional cancellation reason.
 *
 * @param params.bookingId - ID of the booking to cancel
 * @param params.reason - Reason for the forced cancellation (required by admin policy)
 * @returns The cancelled booking
 * @throws {Error} When the admin lacks permission or the booking is not found
 */
export async function adminCancelBooking({
    bookingId,
    reason
}: {
    bookingId: string | number;
    reason: string;
}): Promise<Booking> {
    const { apiPost } = await import('@/lib/api');

    // According to typical force-cancel endpoints, it might be /api/admin/bookings/[id]/cancel
    const response = await apiPost(`/api/admin/bookings/${bookingId}/cancel`, { reason }, { requireAuth: true });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to force cancel the booking');
    }

    const responseData = await response.json();
    const outerData = responseData.data;
    return outerData?.data ?? outerData;
}

/**
 * Creates a recurring booking series for a coworking space.
 *
 * @param data - Recurring booking details including recurrence pattern and date range
 * @returns The created recurring booking series
 * @throws {Error} When the recurring booking cannot be created
 */
export async function createRecurringBooking(data: CreateRecurringBookingData): Promise<RecurringBooking> {
    const response = await fetch('/api/user/bookings/recurring', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create recurring booking');
    }

    const responseData = await response.json();
    const outerData = responseData.data;
    return outerData?.data ?? outerData;
}

/**
 * Fetches all recurring booking series for the authenticated user.
 *
 * @returns Paginated list of recurring booking series
 * @throws {Error} When the request fails or the user is not authenticated
 */
export async function fetchRecurringBookings(): Promise<PaginatedResponse<RecurringBooking>> {
    const response = await fetch('/api/user/bookings/recurring', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch recurring bookings');
    }

    const responseData = await response.json();
    const outerData = responseData.data;
    return outerData?.data ?? outerData;
}

/**
 * Fetches details for a specific recurring booking series.
 *
 * @param id - Recurring booking series ID
 * @returns The recurring booking series with all its instances
 * @throws {Error} When the series is not found or the request fails
 */
export async function fetchRecurringBookingDetails(id: string | number): Promise<RecurringBooking> {
    const response = await fetch(`/api/user/bookings/recurring/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch recurring booking details');
    }

    const responseData = await response.json();
    const outerData = responseData.data;
    return outerData?.data ?? outerData;
}

/**
 * Cancels a single instance within a recurring booking series.
 *
 * @param recurringId - ID of the recurring booking series
 * @param instanceId - ID of the specific instance to cancel
 * @throws {Error} When the instance cannot be cancelled or is not found
 */
export async function cancelBookingInstance(recurringId: string | number, instanceId: string | number): Promise<void> {
    const response = await fetch(`/api/user/bookings/recurring/${recurringId}/instances/${instanceId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to cancel booking instance');
    }
}

/**
 * Cancels all future instances of a recurring booking series.
 *
 * @param id - Recurring booking series ID to cancel
 * @throws {Error} When the series cannot be cancelled or is not found
 */
export async function cancelRecurringSeries(id: string | number): Promise<void> {
    const response = await fetch(`/api/user/bookings/recurring/${id}/cancel`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to cancel recurring series');
    }
}
