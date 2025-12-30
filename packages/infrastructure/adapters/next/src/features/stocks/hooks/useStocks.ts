'use client';

import { useState, useEffect, useCallback } from 'react';
import { getStocksClient } from '@workspace/adapter-next/client';
import type { StockDto } from '@workspace/application/dtos';

export function useStocks() {
    const [stocks, setStocks] = useState<StockDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadStocks = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const client = getStocksClient();
            const data = await client.getAllStocks();
            setStocks(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors du chargement des actions');
            setStocks([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadStocks();
    }, [loadStocks]);

    return { stocks, isLoading, error, refetch: loadStocks };
}
