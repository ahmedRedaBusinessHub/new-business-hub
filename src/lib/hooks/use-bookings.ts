import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import {
    createBooking,
    getPriceEstimate,
    fetchUserBookings,
    cancelBooking,
    modifyBooking,
    fetchBookingDetails,
    createRecurringBooking,
    fetchRecurringBookings,
    fetchRecurringBookingDetails,
    cancelRecurringSeries,
    cancelBookingInstance,
} from '@/lib/api/bookings';
import { CreateBookingData, BookingFilters, CreateRecurringBookingData } from '@/types/api/bookings';
import { toast } from 'sonner';

export function useCreateRecurringBooking() {
    const t = useTranslations();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateRecurringBookingData) => createRecurringBooking(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            queryClient.invalidateQueries({ queryKey: ['recurring_bookings'] });
            toast.success(t('recurring_booking_created_toast'));
        },
        onError: (error: any) => {
            toast.error(error.message || t('recurring_booking_create_error'));
        },
    });
}

export function useRecurringBookings() {
    return useQuery({
        queryKey: ['recurring_bookings'],
        queryFn: () => fetchRecurringBookings(),
    });
}

export function useRecurringBookingDetails(id: string | number) {
    return useQuery({
        queryKey: ['recurring_bookings', 'detail', id],
        queryFn: () => fetchRecurringBookingDetails(id),
        enabled: !!id,
    });
}

export function useCancelBookingInstance() {
    const t = useTranslations();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ recurringId, instanceId }: { recurringId: string | number; instanceId: string | number }) =>
            cancelBookingInstance(recurringId, instanceId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['recurring_bookings', 'detail', variables.recurringId] });
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            toast.success(t('recurring_instance_cancelled_toast'));
        },
        onError: (error: any) => {
            toast.error(error.message || t('recurring_instance_cancel_error'));
        },
    });
}

export function useCancelRecurringSeries() {
    const t = useTranslations();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string | number) => cancelRecurringSeries(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            queryClient.invalidateQueries({ queryKey: ['recurring_bookings'] });
            toast.success(t('recurring_series_cancelled_toast'));
        },
        onError: (error: any) => {
            toast.error(error.message || t('recurring_series_cancel_error'));
        },
    });
}

export function useCreateBooking() {
    const t = useTranslations();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateBookingData) => createBooking(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            queryClient.invalidateQueries({ queryKey: ['availability'] });
            toast.success(t('booking_created_toast'));
        },
        onError: (error: any) => {
            toast.error(error.message || t('booking_create_error'));
        },
    });
}

export function usePriceEstimate() {
    const t = useTranslations();

    return useMutation({
        mutationFn: (data: CreateBookingData) => getPriceEstimate(data),
        onError: (error: any) => {
            toast.error(error.message || t('booking_price_estimate_error'));
        },
    });
}

export function useBookingDetails(id: string | number) {
    return useQuery({
        queryKey: ['bookings', 'detail', id],
        queryFn: () => fetchBookingDetails(id),
        enabled: !!id,
    });
}

export function useUserBookings(params: BookingFilters & { page?: number; limit?: number }) {
    return useQuery({
        queryKey: ['bookings', 'user', params],
        queryFn: () => fetchUserBookings(params),
    });
}

export function useCancelBooking() {
    const t = useTranslations();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string | number) => cancelBooking(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            toast.success(t('booking_cancelled_toast'));
        },
        onError: (error: any) => {
            toast.error(error.message || t('booking_cancel_error'));
        },
    });
}

export function useModifyBooking() {
    const t = useTranslations();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string | number; data: Partial<CreateBookingData> }) => modifyBooking(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            toast.success(t('booking_modified_toast'));
        },
        onError: (error: any) => {
            toast.error(error.message || t('booking_modify_error'));
        },
    });
}

export function useAdminCancelBooking() {
    const t = useTranslations();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: { bookingId: string | number; reason: string }) => import('@/lib/api/bookings').then(m => m.adminCancelBooking(params)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            queryClient.invalidateQueries({ queryKey: ['admin_bookings'] });
            toast.success(t('booking_cancelled_toast'));
        },
        onError: (error: any) => {
            toast.error(error.message || t('booking_cancel_error'));
        },
    });
}
