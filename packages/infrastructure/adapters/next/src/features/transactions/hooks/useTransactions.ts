'use client';

import { useState, useEffect, useCallback } from 'react';
import { getTransactionsClient } from '@workspace/adapter-next/client';
import type { TransactionDto } from '@workspace/application/dtos';

export function useTransactions(accountId: string | null) {
    const [transactions, setTransactions] = useState<TransactionDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadTransactions = useCallback(async () => {
        if (!accountId) {
            setTransactions([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const client = getTransactionsClient();
            const data = await client.getAccountTransactions(accountId);
            setTransactions(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors du chargement des transactions');
            setTransactions([]);
        } finally {
            setIsLoading(false);
        }
    }, [accountId]);

    useEffect(() => {
        loadTransactions();
    }, [loadTransactions]);

    return { transactions, isLoading, error, refetch: loadTransactions };
}
