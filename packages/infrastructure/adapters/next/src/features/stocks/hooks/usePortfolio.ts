'use client';

import { useState, useEffect } from 'react';
import { getStocksClient } from '@workspace/adapter-next/client';

export function usePortfolio() {
    const [portfolio, setPortfolio] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPortfolio = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const client = getStocksClient();
            const data = await client.getUserPortfolio();
            setPortfolio(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur lors du chargement du portfolio';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPortfolio();
    }, []);

    return { portfolio, isLoading, error, refetch: fetchPortfolio };
}
