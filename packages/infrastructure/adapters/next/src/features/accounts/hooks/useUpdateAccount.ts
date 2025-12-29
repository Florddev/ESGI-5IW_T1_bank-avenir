'use client';

import { useState } from 'react';
import { getAccountsClient } from '../../../client/accounts.client';

export function useUpdateAccount() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateAccountName = async (accountId: string, customName: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const client = getAccountsClient();
            const account = await client.updateAccountName(accountId, customName);
            return account;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { updateAccountName, isLoading, error };
}
