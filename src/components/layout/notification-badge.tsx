'use client';

import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface NotificationBadgeProps {
    count: number;
    className?: string;
}

export function NotificationBadge({ count, className }: NotificationBadgeProps) {
    if (count === 0) return null;

    return (
        <Badge
            variant="destructive"
            className={cn(
                'absolute -top-1 -right-1 size-5 p-0 flex items-center justify-center text-[10px] font-bold',
                className
            )}
        >
            {count > 99 ? '99+' : count}
        </Badge>
    );
}
