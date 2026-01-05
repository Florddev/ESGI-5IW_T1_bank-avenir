'use client';

import { Bell } from 'lucide-react';
import { Button } from '@workspace/ui-react/components/button';
//import { Badge } from '@workspace/ui-react/components/badge';
import { useRealtimeNotifications } from '../hooks/useRealtimeNotifications';
import { useNotifications } from '../hooks/useNotifications';
import { useEffect } from 'react';

interface NotificationBadgeProps {
    userId: string;
    onClick?: () => void;
}

export function NotificationBadge({ userId, onClick }: NotificationBadgeProps) {
    const { events } = useRealtimeNotifications(userId);
    const { notifications, refetch } = useNotifications(userId);

    useEffect(() => {
        if (events.length > 0 && events[0].event === 'notification_new') {
            refetch();
        }
    }, [events.length, refetch]);

    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

    return (
        <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={onClick}
            aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} non lues)` : ''}`}
        >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
                <span 
                    className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-xs"
                    variant="destructive"
                >
                    {unreadCount > 9 ? '9+' : unreadCount}
                </span>
            )}
        </Button>
    );
}
