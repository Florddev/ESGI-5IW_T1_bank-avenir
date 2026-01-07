'use client';

import { useState } from 'react';

export function useUpdateSavingsRate() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateSavingsRate = async (newRate: number, message?: string): Promise<{ accountsUpdated: number; notificationsSent: number }> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/savings/rate', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ newRate, message }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur lors de la mise à jour du taux');
            }

            const result = await response.json();
            return result.data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Une erreur est survenue';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { updateSavingsRate, isLoading, error };
}
