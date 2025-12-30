'use client';

import { useState } from 'react';
import { getNotificationsClient } from '@workspace/adapter-next/client';

export function useMarkAsRead() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const markAsRead = async (notificationId: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const client = getNotificationsClient();
            await client.markAsRead(notificationId);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { markAsRead, isLoading, error };
}
