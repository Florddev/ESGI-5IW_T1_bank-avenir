'use client';

import { useRealtime } from '../../realtime/hooks/useRealtime';
import { RealtimeNotificationDto } from '@workspace/application/dtos';

export function useRealtimeNotifications(userId: string) {
    return useRealtime<RealtimeNotificationDto>({
        userId,
        events: ['notification_new', 'notification_read'],
        onEvent: (event, data) => {
            if (event === 'notification_new') {
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification(data.title, {
                        body: data.message,
                        icon: '/icon-notification.png',
                    });
                }
            }
        },
    });
}
