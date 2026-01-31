'use client';

import { useState } from 'react';
import { getAdvisorClient } from '@workspace/adapter-next/client';

export function useSendAdvisorNotification() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const sendNotification = async (data: { title: string; message: string }): Promise<{ notifiedCount: number }> => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const client = getAdvisorClient();
            const result = await client.notifyClients(data);
            setSuccess(true);
            return result;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Erreur lors de l'envoi des notifications";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const reset = () => {
        setError(null);
        setSuccess(false);
    };

    return { sendNotification, isLoading, error, success, reset };
}
