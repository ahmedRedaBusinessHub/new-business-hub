import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { fetchAdminSpaceBookings, approveAdminSpaceBooking, cancelAdminSpaceBooking, fetchAdminSpaceBookingById, fetchBookingStatistics } from '@/lib/api/admin-space-bookings';
import { AdminSpaceBookingFilters, CancelBookingPayload } from '@/types/api/space-bookings-admin';
import { toast } from 'sonner';

export function useAdminSpaceBookings(
  filters: AdminSpaceBookingFilters = {},
  enabled = true,
) {
  return useQuery({
    queryKey: ['admin_space_bookings', filters],
    queryFn: () => fetchAdminSpaceBookings(filters),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useBookingStatistics() {
  return useQuery({
    queryKey: ['booking_statistics'],
    queryFn: () => fetchBookingStatistics(),
    staleTime: 5 * 60 * 1000,
  });
}


export function useAdminSpaceBookingDetail(id: number | undefined) {
  return useQuery({
    queryKey: ['admin_space_booking_detail', id],
    queryFn: () => fetchAdminSpaceBookingById(id!),
    staleTime: 1 * 60 * 1000,
    enabled: !!id,
  });
}

export function useApproveSpaceBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => approveAdminSpaceBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_space_bookings'] });
      toast.success('Booking approved successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to approve booking');
    },
  });
}

export function useCancelSpaceBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CancelBookingPayload }) =>
      cancelAdminSpaceBooking(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_space_bookings'] });
      toast.success('Booking cancelled successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to cancel booking');
    },
  });
}
