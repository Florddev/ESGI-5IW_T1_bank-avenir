'use client';

import { useState, useEffect, useCallback } from 'react';
import { getLoansClient } from '@workspace/adapter-next/client';
import type { LoanDto } from '@workspace/application/dtos';

export function useLoans(userId: string | null) {
    const [loans, setLoans] = useState<LoanDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadLoans = useCallback(async () => {
        if (!userId) {
            setLoans([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const client = getLoansClient();
            const data = await client.getUserLoans(userId);
            setLoans(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors du chargement des prêts');
            setLoans([]);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        loadLoans();
    }, [loadLoans]);

    return { loans, isLoading, error, refetch: loadLoans };
}
