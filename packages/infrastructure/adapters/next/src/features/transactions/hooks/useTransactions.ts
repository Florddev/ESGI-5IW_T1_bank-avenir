'use client';

import { useState, useEffect } from 'react';
import { getTransactionsClient } from '../../../client/transactions.client';
import type { TransactionDto } from '@workspace/application/dtos';

export function useTransactions(accountId: string | null) {
    const [transactions, setTransactions] = useState<TransactionDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!accountId) {
            setTransactions([]);
            setIsLoading(false);
            return;
        }

        const loadTransactions = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const client = getTransactionsClient();
                const data = await client.getAccountTransactions(accountId);
                setTransactions(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erreur lors du chargement des transactions');
            } finally {
                setIsLoading(false);
            }
        };

        loadTransactions();
    }, [accountId]);

    return { transactions, isLoading, error };
}
