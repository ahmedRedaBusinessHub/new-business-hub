'use client';

import { Notification } from '@/types/api/notifications';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { enUS, arSA } from 'date-fns/locale';
import { useLocale, useTranslations } from 'next-intl';
import {
    Calendar,
    Bell,
    XCircle,
    RefreshCcw,
    Info,
    CheckCircle2,
} from 'lucide-react';

interface NotificationItemProps {
    notification: Notification;
    onMarkAsRead: (id: string) => void;
    className?: string;
}

const getNotificationIcon = (type: Notification['type']) => {
    const iconClass = 'size-5';
    switch (type) {
        case 'BOOKING_CONFIRMED':
            return <CheckCircle2 className={cn(iconClass, 'text-green-500')} />;
        case 'BOOKING_REMINDER':
            return <Bell className={cn(iconClass, 'text-blue-500')} />;
        case 'BOOKING_CANCELLED':
            return <XCircle className={cn(iconClass, 'text-red-500')} />;
        case 'BOOKING_MODIFIED':
            return <RefreshCcw className={cn(iconClass, 'text-orange-500')} />;
        default:
            return <Info className={cn(iconClass, 'text-gray-500')} />;
    }
};

export function NotificationItem({
    notification,
    onMarkAsRead,
    className,
}: NotificationItemProps) {
    const locale = useLocale();
    const dateLocale = locale === 'ar' ? arSA : enUS;

    return (
        <div
            className={cn(
                'relative flex gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer group border-b last:border-0',
                !notification.isRead && 'bg-primary/5',
                className
            )}
            onClick={() => !notification.isRead && onMarkAsRead(notification.id)}
        >
            <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notification.type)}
            </div>

            <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <p
                        className={cn(
                            'text-sm leading-tight',
                            !notification.isRead && 'font-semibold'
                        )}
                    >
                        {notification.title}
                    </p>
                    {!notification.isRead && (
                        <span className="size-2 rounded-full bg-primary shrink-0 mt-1" />
                    )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {notification.message}
                </p>
                <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                        locale: dateLocale,
                    })}
                </p>
            </div>
        </div>
    );
}
