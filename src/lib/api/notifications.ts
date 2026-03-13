import { Notification, NotificationPreferences, UpdateNotificationPreferencesRequest } from "@/types/api/notifications";
import { PaginatedResponse } from "@/types/api/common";

/**
 * Fetch user notifications
 */
export async function fetchNotifications(params?: {
    page?: number;
    limit?: number;
    isRead?: boolean;
}): Promise<PaginatedResponse<Notification>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.isRead !== undefined) queryParams.append('isRead', params.isRead.toString());

    const response = await fetch(`/api/notifications?${queryParams.toString()}`);
    if (!response.ok) {
        throw new Error('Failed to fetch notifications');
    }
    return response.json();
}

/**
 * Mark a notification as read
 */
export async function markAsRead(notificationId: string): Promise<void> {
    const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
    });
    if (!response.ok) {
        throw new Error('Failed to mark notification as read');
    }
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(): Promise<void> {
    const response = await fetch('/api/notifications/read-all', {
        method: 'PATCH',
    });
    if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
    }
}

/**
 * Fetch notification preferences
 */
export async function fetchNotificationPreferences(): Promise<NotificationPreferences> {
    const response = await fetch('/api/notifications/preferences');
    if (!response.ok) {
        throw new Error('Failed to fetch notification preferences');
    }
    return response.json();
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(
    data: UpdateNotificationPreferencesRequest
): Promise<NotificationPreferences> {
    const response = await fetch('/api/notifications/preferences', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Failed to update notification preferences');
    }
    return response.json();
}
