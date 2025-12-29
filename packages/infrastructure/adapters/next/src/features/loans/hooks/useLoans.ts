'use client';

import { useState, useEffect } from 'react';
import { getLoansClient } from '../../../client/loans.client';
import type { LoanDto } from '@workspace/application/dtos';

export function useLoans(userId: string | null) {
    const [loans, setLoans] = useState<LoanDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            setLoans([]);
            setIsLoading(false);
            return;
        }

        const loadLoans = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const client = getLoansClient();
                const data = await client.getUserLoans(userId);
                setLoans(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erreur lors du chargement des prêts');
            } finally {
                setIsLoading(false);
            }
        };

        loadLoans();
    }, [userId]);

    return { loans, isLoading, error };
}
