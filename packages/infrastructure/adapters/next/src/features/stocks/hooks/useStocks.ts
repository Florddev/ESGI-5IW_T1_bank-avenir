'use client';

import { useState, useEffect } from 'react';
import { getStocksClient } from '../../../client/stocks.client';
import type { StockDto } from '@workspace/application/dtos';

export function useStocks() {
    const [stocks, setStocks] = useState<StockDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadStocks = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const client = getStocksClient();
                const data = await client.getAllStocks();
                setStocks(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erreur lors du chargement des actions');
            } finally {
                setIsLoading(false);
            }
        };

        loadStocks();
    }, []);

    return { stocks, isLoading, error, refetch: () => {} };
}
