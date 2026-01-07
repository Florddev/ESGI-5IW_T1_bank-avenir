'use client';

import { useState } from 'react';
import { getStocksClient } from '@workspace/adapter-next/client';

export function usePlaceOrder() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const placeOrder = async (stockId: string, type: 'BUY' | 'SELL', quantity: number, pricePerShare: number): Promise<any> => {
        setIsLoading(true);
        setError(null);

        try {
            const client = getStocksClient();
            const order = await client.placeOrder({ stockId, type, quantity, pricePerShare });
            return order;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Erreur lors du placement de l'ordre";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { placeOrder, isLoading, error };
}
