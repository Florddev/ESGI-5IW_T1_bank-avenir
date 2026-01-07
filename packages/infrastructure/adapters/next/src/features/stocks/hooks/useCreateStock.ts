'use client';

import { useState } from 'react';
import { getStocksClient } from '@workspace/adapter-next/client';
import type { StockDto } from '@workspace/application/dtos';

export function useCreateStock() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createStock = async (data: { symbol: string; companyName: string }): Promise<StockDto> => {
        setIsLoading(true);
        setError(null);

        try {
            const client = getStocksClient();
            const stock = await client.createStock(data);
            return stock;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Erreur lors de la création de l'action";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { createStock, isLoading, error };
}
