'use client';

import { useState, useEffect, useCallback } from 'react';
import { getNotificationsClient } from '@workspace/adapter-next/client';
import type { NotificationDto } from '@workspace/application/dtos';

export function useNotifications(userId: string | null) {
    const [notifications, setNotifications] = useState<NotificationDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadNotifications = useCallback(async () => {
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
    }, [userId]);

    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    return { notifications, isLoading, error, refetch: loadNotifications };
}
