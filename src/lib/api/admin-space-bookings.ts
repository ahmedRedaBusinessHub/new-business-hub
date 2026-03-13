import {
  AdminSpaceBookingFilters,
  AdminSpaceBookingListResponse,
  CancelBookingPayload,
} from '@/types/api/space-bookings-admin';

export async function fetchAdminSpaceBookings(
  filters: AdminSpaceBookingFilters = {},
): Promise<AdminSpaceBookingListResponse> {
  const params = new URLSearchParams();
  if (filters.page !== undefined)
    params.append('page', filters.page.toString());
  if (filters.limit !== undefined)
    params.append('limit', filters.limit.toString());
  if (filters.status !== undefined)
    params.append('status', filters.status.toString());
  if (filters.branch_id !== undefined)
    params.append('branch_id', filters.branch_id.toString());
  if (filters.coworking_space_id !== undefined)
    params.append('coworking_space_id', filters.coworking_space_id.toString());
  if (filters.start_date) params.append('start_date', filters.start_date);
  if (filters.end_date) params.append('end_date', filters.end_date);
  if (filters.created_start_date)
    params.append('created_start_date', filters.created_start_date);
  if (filters.created_end_date)
    params.append('created_end_date', filters.created_end_date);
  if (filters.confirmation_code)
    params.append('confirmation_code', filters.confirmation_code);
  if (filters.search) params.append('search', filters.search);
  if (filters.sort_field) params.append('sort_field', filters.sort_field);
  if (filters.sort_order) params.append('sort_order', filters.sort_order);

  const response = await fetch(`/api/admin/space-bookings?${params.toString()}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch admin space bookings');
  }

  return response.json();
}

export async function approveAdminSpaceBooking(id: number): Promise<any> {
  const response = await fetch(`/api/admin/space-bookings/${id}/approve`, {
    method: 'PATCH',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to approve booking');
  }

  return response.json();
}

export async function cancelAdminSpaceBooking(
  id: number,
  payload: CancelBookingPayload,
): Promise<any> {
  const response = await fetch(`/api/admin/space-bookings/${id}/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to cancel booking');
  }

  return response.json();
}

export async function fetchAdminSpaceBookingById(id: number): Promise<any> {
  const response = await fetch(`/api/admin/space-bookings/${id}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch booking details');
  }

  const responseData = await response.json();
  return responseData.data;
}

export async function fetchBookingStatistics(): Promise<any> {
  const response = await fetch(`/api/admin/space-bookings/statistics/summary`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch booking statistics');
  }

  const responseData = await response.json();
  return responseData.data;
}
