'use client';

import { useState, useEffect } from 'react';
import { getAccountsClient } from '../../../client/accounts.client';
import type { AccountDto } from '@workspace/application/dtos';

export function useAccounts(userId: string | null) {
    const [accounts, setAccounts] = useState<AccountDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            setAccounts([]);
            setIsLoading(false);
            return;
        }

        const loadAccounts = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const client = getAccountsClient();
                const data = await client.getUserAccounts(userId);
                setAccounts(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erreur lors du chargement des comptes');
            } finally {
                setIsLoading(false);
            }
        };

        loadAccounts();
    }, [userId]);

    return { accounts, isLoading, error, refetch: () => {} };
}
