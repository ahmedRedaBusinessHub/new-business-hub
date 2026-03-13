export type NotificationType =
    | 'BOOKING_CONFIRMED'
    | 'BOOKING_REMINDER'
    | 'BOOKING_CANCELLED'
    | 'BOOKING_MODIFIED'
    | 'SYSTEM_INFO';

export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
    metadata?: {
        bookingId?: string;
        spaceId?: string;
        [key: string]: string | undefined;
    };
}

export interface NotificationPreferences {
    email: boolean;
    whatsapp: boolean;
    push: boolean;
    bookingReminders: boolean;
    promotions: boolean;
}

export interface UpdateNotificationPreferencesRequest {
    preferences: Partial<NotificationPreferences>;
}
