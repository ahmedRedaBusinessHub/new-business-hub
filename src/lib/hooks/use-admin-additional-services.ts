import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import {
  fetchAdminServiceBookings,
  fetchAdminServiceBooking,
  updateAdminBookingStatus,
  fetchAdminServiceCatalog,
  createAdminService,
  updateAdminService,
  toggleAdminServiceStatus,
  assignServiceToBranch,
  removeServiceFromBranch,
  fetchAdminServicesSummary,
} from '@/lib/api/admin-additional-services';
import {
  AdminServiceBookingFilters,
  UpdateBookingStatusPayload,
  AdminServiceCatalogFilters,
  CreateServicePayload,
  UpdateServicePayload,
  ToggleServiceStatusPayload,
} from '@/types/api/additional-services-admin';
import { toast } from 'sonner';

/**
 * Fetch all service bookings with filters
 */
export function useAdminServiceBookings(filters: AdminServiceBookingFilters = {}, enabled = true) {
  return useQuery({
    queryKey: ['admin_service_bookings', filters],
    queryFn: () => fetchAdminServiceBookings(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled,
  });
}

/**
 * Fetch a single service booking detail
 */
export function useAdminServiceBooking(id: number | undefined) {
  return useQuery({
    queryKey: ['admin_service_booking', id],
    queryFn: () => fetchAdminServiceBooking(id!),
    enabled: !!id,
  });
}

/**
 * Update booking status
 */
export function useUpdateBookingStatus() {
  const t = useTranslations();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateBookingStatusPayload }) =>
      updateAdminBookingStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_service_bookings'] });
      toast.success(t('booking_status_updated_successfully'));
    },
    onError: (error: any) => {
      toast.error(error.message || t('failed_to_update_booking_status'));
    },
  });
}

/**
 * Fetch all services in catalog with filters
 */
export function useAdminServiceCatalog(filters: AdminServiceCatalogFilters = {}, enabled = true) {
  return useQuery({
    queryKey: ['admin_service_catalog', filters],
    queryFn: () => fetchAdminServiceCatalog(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled,
  });
}

/**
 * Create a new service
 */
export function useCreateService() {
  const t = useTranslations();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateServicePayload) => createAdminService(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_service_catalog'] });
      toast.success(t('service_created_successfully'));
    },
    onError: (error: any) => {
      toast.error(error.message || t('failed_to_create_service'));
    },
  });
}

/**
 * Update an existing service
 */
export function useUpdateService() {
  const t = useTranslations();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateServicePayload }) =>
      updateAdminService(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_service_catalog'] });
      toast.success(t('service_updated_successfully'));
    },
    onError: (error: any) => {
      toast.error(error.message || t('failed_to_update_service'));
    },
  });
}

/**
 * Toggle service status (activate/deactivate)
 * On 409, returns warning data to caller (does not show toast)
 * On 200, invalidates catalog and shows success toast
 */
export function useToggleServiceStatus() {
  const t = useTranslations();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ToggleServiceStatusPayload }) =>
      toggleAdminServiceStatus(id, payload),
    onSuccess: (data) => {
      if ('requires_confirmation' in data && data.requires_confirmation) {
        return data;
      }
      queryClient.invalidateQueries({ queryKey: ['admin_service_catalog'] });
      toast.success(t('service_status_updated_successfully'));
    },
    onError: (error: any) => {
      toast.error(error.message || t('failed_to_update_service_status'));
    },
  });
}

/**
 * Assign a service to a branch
 */
export function useAssignServiceToBranch() {
  const t = useTranslations();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ serviceId, branchId }: { serviceId: number; branchId: number }) =>
      assignServiceToBranch(serviceId, branchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_service_catalog'] });
      toast.success(t('service_assigned_to_branch'));
    },
    onError: (error: any) => {
      toast.error(error.message || t('failed_to_assign_service'));
    },
  });
}

/**
 * Remove a service from a branch
 */
export function useRemoveServiceFromBranch() {
  const t = useTranslations();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ serviceId, branchId }: { serviceId: number; branchId: number }) =>
      removeServiceFromBranch(serviceId, branchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_service_catalog'] });
      toast.success(t('service_removed_from_branch'));
    },
    onError: (error: any) => {
      toast.error(error.message || t('failed_to_remove_service'));
    },
  });
}

/**
 * Fetch admin services summary
 */
export function useAdminServicesSummary() {
  return useQuery({
    queryKey: ['admin_services_summary'],
    queryFn: fetchAdminServicesSummary,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
