'use client';

import { useState } from 'react';
import { getLoansClient } from '../../../client/loans.client';
import type { CreateLoanDto } from '@workspace/application/dtos';

export function useLoanOperations() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createLoan = async (data: CreateLoanDto) => {
        setIsLoading(true);
        setError(null);

        try {
            const client = getLoansClient();
            const loan = await client.createLoan(data);
            return loan;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création du prêt';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const processPayment = async (loanId: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const client = getLoansClient();
            await client.processPayment(loanId);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors du paiement';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { createLoan, processPayment, isLoading, error };
}
