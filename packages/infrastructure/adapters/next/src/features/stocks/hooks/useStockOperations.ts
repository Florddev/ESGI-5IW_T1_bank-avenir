'use client';

import { useState } from 'react';
import { getStocksClient } from '@workspace/adapter-next/client';

export function useStockOperations() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const buyStock = async (stockId: string, accountId: string, quantity: number) => {
        setIsLoading(true);
        setError(null);

        try {
            const client = getStocksClient();
            await client.buyStock(stockId, { accountId, quantity });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Erreur lors de l'achat";
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const sellStock = async (stockId: string, accountId: string, quantity: number) => {
        setIsLoading(true);
        setError(null);

        try {
            const client = getStocksClient();
            await client.sellStock(stockId, { accountId, quantity });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la vente';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { buyStock, sellStock, isLoading, error };
}
