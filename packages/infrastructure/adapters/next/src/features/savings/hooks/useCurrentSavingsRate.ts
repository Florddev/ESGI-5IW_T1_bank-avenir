'use client';

import { useState, useEffect, useCallback } from 'react';

export function useCurrentSavingsRate() {
    const [currentRate, setCurrentRate] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadCurrentRate = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/savings/rate', {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Erreur lors du chargement du taux actuel');
            }

            const result = await response.json();
            setCurrentRate(result.data);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Une erreur est survenue';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCurrentRate();
    }, [loadCurrentRate]);

    return { currentRate, isLoading, error, refetch: loadCurrentRate };
}
