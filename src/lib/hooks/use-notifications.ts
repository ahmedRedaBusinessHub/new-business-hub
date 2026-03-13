import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    fetchNotificationPreferences,
    updateNotificationPreferences,
} from '@/lib/api/notifications';
import { UpdateNotificationPreferencesRequest } from '@/types/api/notifications';
import { queryKeys } from '@/lib/query-keys';
import { toast } from 'sonner';

export function useNotifications(params?: {
    page?: number;
    limit?: number;
    isRead?: boolean;
}) {
    return useQuery({
        queryKey: queryKeys.notifications.list(params as Record<string, unknown> | undefined),
        queryFn: () => fetchNotifications(params),
        placeholderData: (previousData) => previousData,
        refetchInterval: 60000, // Background polling every minute
    });
}

export function useMarkAsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (notificationId: string) => markAsRead(notificationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to mark notification as read');
        },
    });
}

export function useMarkAllAsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => markAllAsRead(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
            toast.success('All notifications marked as read');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to mark all notifications as read');
        },
    });
}

export function useNotificationPreferences() {
    return useQuery({
        queryKey: queryKeys.notifications.preferences(),
        queryFn: () => fetchNotificationPreferences(),
    });
}

export function useUpdateNotificationPreferences() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateNotificationPreferencesRequest) =>
            updateNotificationPreferences(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.notifications.preferences() });
            toast.success('Notification preferences updated');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update notification preferences');
        },
    });
}
