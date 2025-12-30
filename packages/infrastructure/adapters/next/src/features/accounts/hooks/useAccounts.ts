'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAccountsClient } from '@workspace/adapter-next/client';
import type { AccountDto } from '@workspace/application/dtos';

export function useAccounts() {
    const [accounts, setAccounts] = useState<AccountDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadAccounts = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const client = getAccountsClient();
            const data = await client.getAllAccounts();
            setAccounts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors du chargement des comptes');
            setAccounts([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAccounts();
    }, [loadAccounts]);

    return { accounts, isLoading, error, refetch: loadAccounts };
}
