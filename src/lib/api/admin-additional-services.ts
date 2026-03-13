import {
  AdminServiceBooking,
  AdminServiceBookingFilters,
  AdminServiceBookingListResponse,
  UpdateBookingStatusPayload,
  AdminServiceCatalogFilters,
  AdminServiceCatalogListResponse,
  AdminServiceCatalogItem,
  CreateServicePayload,
  UpdateServicePayload,
  ToggleServiceStatusPayload,
  DeactivateServiceResponse,
  AdminServicesSummary,
} from '@/types/api/additional-services-admin';

/**
 * Fetch all service bookings with filtering
 */
export async function fetchAdminServiceBookings(
  filters: AdminServiceBookingFilters = {},
): Promise<AdminServiceBookingListResponse> {
  const params = new URLSearchParams();
  if (filters.page !== undefined) params.append('page', filters.page.toString());
  if (filters.limit !== undefined) params.append('limit', filters.limit.toString());
  if (filters.service_type) params.append('service_type', filters.service_type);
  if (filters.branch_id !== undefined) params.append('branch_id', filters.branch_id.toString());
  if (filters.status !== undefined) params.append('status', filters.status.toString());
  if (filters.start_date) params.append('start_date', filters.start_date);
  if (filters.end_date) params.append('end_date', filters.end_date);
  if (filters.search) params.append('search', filters.search);

  const response = await fetch(`/api/admin/additional-services/bookings?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch service bookings');
  }

  return response.json();
}

/**
 * Fetch a single service booking detail
 */
export async function fetchAdminServiceBooking(id: number): Promise<AdminServiceBooking> {
  const response = await fetch(`/api/admin/additional-services/bookings/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch service booking');
  }

  const responseData = await response.json();
  return responseData.data;
}

/**
 * Update booking status
 */
export async function updateAdminBookingStatus(
  id: number,
  payload: UpdateBookingStatusPayload,
): Promise<{ id: number; status: number; updated_at: string }> {
  const response = await fetch(`/api/admin/additional-services/bookings/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update booking status');
  }

  const responseData = await response.json();
  return responseData.data;
}

/**
 * Fetch all services in catalog with filtering
 */
export async function fetchAdminServiceCatalog(
  filters: AdminServiceCatalogFilters = {},
): Promise<AdminServiceCatalogListResponse> {
  const params = new URLSearchParams();
  if (filters.page !== undefined) params.append('page', filters.page.toString());
  if (filters.limit !== undefined) params.append('limit', filters.limit.toString());
  if (filters.status !== undefined) params.append('status', filters.status.toString());
  if (filters.service_type) params.append('service_type', filters.service_type);

  const response = await fetch(`/api/admin/additional-services/catalog?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch service catalog');
  }

  return response.json();
}

/**
 * Create a new service
 */
export async function createAdminService(
  payload: CreateServicePayload,
): Promise<AdminServiceCatalogItem> {
  const response = await fetch('/api/admin/additional-services/catalog', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create service');
  }

  const responseData = await response.json();
  return responseData.data;
}

/**
 * Update an existing service
 */
export async function updateAdminService(
  id: number,
  payload: UpdateServicePayload,
): Promise<AdminServiceCatalogItem> {
  const response = await fetch(`/api/admin/additional-services/catalog/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update service');
  }

  const responseData = await response.json();
  return responseData.data;
}

/**
 * Toggle service status (activate/deactivate)
 * Returns DeactivateServiceResponse on 409 conflict (requires confirmation)
 * Returns updated service on success
 */
export async function toggleAdminServiceStatus(
  id: number,
  payload: ToggleServiceStatusPayload,
): Promise<DeactivateServiceResponse | { id: number; status: number; updated_at: string }> {
  const response = await fetch(`/api/admin/additional-services/catalog/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 409) {
    const errorData = await response.json();
    return errorData;
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update service status');
  }

  const responseData = await response.json();
  return responseData.data;
}

/**
 * Assign a service to a branch
 */
export async function assignServiceToBranch(
  serviceId: number,
  branchId: number,
): Promise<{ id: number; additional_service_id: number; branch_id: number }> {
  const response = await fetch(`/api/admin/additional-services/catalog/${serviceId}/branches`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ branch_id: branchId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to assign service to branch');
  }

  const responseData = await response.json();
  return responseData.data;
}

/**
 * Remove a service from a branch
 */
export async function removeServiceFromBranch(
  serviceId: number,
  branchId: number,
): Promise<{ id: number; additional_service_id: number; branch_id: number }> {
  const response = await fetch(`/api/admin/additional-services/catalog/${serviceId}/branches/${branchId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to remove service from branch');
  }

  const responseData = await response.json();
  return responseData.data;
}

/**
 * Fetch admin services summary
 */
export async function fetchAdminServicesSummary(): Promise<AdminServicesSummary> {
  const response = await fetch('/api/admin/additional-services/summary', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch admin services summary');
  }

  const responseData = await response.json();
  return responseData.data;
}
