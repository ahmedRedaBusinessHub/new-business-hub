'use client';

import { useState, useEffect } from 'react';
import {
    useNotifications,
    useMarkAsRead,
    useMarkAllAsRead,
} from '@/lib/hooks/use-notifications';
import { Button } from '@/components/ui/Button';
import { ScrollArea } from '@/components/ui/Scroll-area';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/Dropdown-menu';
import { Bell, CheckCheck, Inbox } from 'lucide-react';
import { NotificationItem } from '@/components/features/notifications/notification-item';
import { NotificationBadge } from './notification-badge';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Separator } from '@/components/ui/Separator';

export function NotificationCenter() {
    const t = useTranslations();
    const [isOpen, setIsOpen] = useState(false);
    const [prevUnreadCount, setPrevUnreadCount] = useState(0);
    const { data: notificationsData, isLoading } = useNotifications({
        limit: 1000,
    });
    console.log("🚀 ~ NotificationCenter ~ notificationsData:", notificationsData)
    const { mutate: markRead } = useMarkAsRead();
    const { mutate: markAllRead } = useMarkAllAsRead();

    const notifications = notificationsData?.data?.data || [];
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    useEffect(() => {
        if (unreadCount > prevUnreadCount && prevUnreadCount > 0) {
            import('sonner').then(({ toast }) => {
                toast.info(t('notification_new_alert'));
            });
        }
        setPrevUnreadCount(unreadCount);
    }, [unreadCount, prevUnreadCount, t]);

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-10 w-10">
                    <Bell className="size-5" />
                    <NotificationBadge count={unreadCount} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-[380px] p-0"
                align="end"
                sideOffset={8}
            >
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{t('notification_center_title')}</h3>
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAllRead()}
                            className="h-auto p-0 text-xs text-primary hover:bg-transparent"
                        >
                            <CheckCheck className="mr-1 size-3" />
                            {t('notification_mark_read_all')}
                        </Button>
                    )}
                </div>

                <ScrollArea className="h-[400px]">
                    {isLoading ? (
                        <div className="p-4 space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex gap-4 animate-pulse">
                                    <div className="size-10 rounded-full bg-muted" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-3/4 bg-muted rounded" />
                                        <div className="h-3 w-5/6 bg-muted rounded" />
                                        <div className="h-3 w-1/4 bg-muted rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                            <Inbox className="size-12 mb-4 opacity-20" />
                            <p>{t('notification_empty')}</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {notifications.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onMarkAsRead={(id) => markRead(id)}
                                />
                            ))}
                        </div>
                    )}
                </ScrollArea>

                <Separator />
                <div className="p-2">
                    <Button
                        variant="ghost"
                        className="w-full text-sm font-medium"
                        asChild
                    >
                        <Link href="/bookings">
                            {t('notification_view_all')}
                        </Link>
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
