'use client';

import { useState } from 'react';
import { getAccountsClient } from '@workspace/adapter-next/client';

export function useDeleteAccount() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteAccount = async (accountId: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const client = getAccountsClient();
            await client.deleteAccount(accountId);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { deleteAccount, isLoading, error };
}
