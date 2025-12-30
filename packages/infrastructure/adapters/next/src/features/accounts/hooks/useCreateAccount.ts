'use client';

import { useState } from 'react';
import { getAccountsClient } from '@workspace/adapter-next/client';
import type { CreateAccountDto } from '@workspace/application/dtos';

export function useCreateAccount() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createAccount = async (data: CreateAccountDto) => {
        setIsLoading(true);
        setError(null);

        try {
            const client = getAccountsClient();
            const account = await client.createAccount(data);
            return account;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création du compte';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { createAccount, isLoading, error };
}
