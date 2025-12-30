'use client';

import { useState } from 'react';
import { getTransactionsClient } from '@workspace/adapter-next/client';
import type { DepositMoneyDto, WithdrawMoneyDto, TransferMoneyDto } from '@workspace/application/dtos';

export function useTransactionOperations() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deposit = async (data: DepositMoneyDto) => {
        setIsLoading(true);
        setError(null);

        try {
            const client = getTransactionsClient();
            const transaction = await client.deposit(data);
            return transaction;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors du dépôt';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const withdraw = async (data: WithdrawMoneyDto) => {
        setIsLoading(true);
        setError(null);

        try {
            const client = getTransactionsClient();
            const transaction = await client.withdraw(data);
            return transaction;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors du retrait';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const transfer = async (data: TransferMoneyDto) => {
        setIsLoading(true);
        setError(null);

        try {
            const client = getTransactionsClient();
            const transaction = await client.transfer(data);
            return transaction;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors du transfert';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { deposit, withdraw, transfer, isLoading, error };
}
