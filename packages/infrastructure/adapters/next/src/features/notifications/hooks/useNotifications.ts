'use client';

import { useState, useEffect } from 'react';
import { getNotificationsClient } from '../../../client/notifications.client';
import type { NotificationDto } from '@workspace/application/dtos';

export function useNotifications(userId: string | null) {
    const [notifications, setNotifications] = useState<NotificationDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadNotifications = async () => {
        if (!userId) {
            setNotifications([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const client = getNotificationsClient();
            const data = await client.getUserNotifications(userId);
            setNotifications(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors du chargement des notifications');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, [userId]);

    return { notifications, isLoading, error, refetch: loadNotifications };
}
