'use client';

import { TransactionList, TransactionForm } from '@workspace/adapter-next/features/transactions/components';
import { useAccounts } from '@workspace/adapter-next/features/accounts';
import { Button } from '@workspace/ui-react/components/button';
import { useState, useEffect, useCallback } from 'react';
import { getTransactionsClient } from '@workspace/adapter-next/client';
import type { TransactionDto } from '@workspace/application/dtos';

export function TransactionsView() {
    const { accounts, isLoading: accountsLoading } = useAccounts();
    const [showForm, setShowForm] = useState(false);
    const [transactions, setTransactions] = useState<TransactionDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadAllTransactions = useCallback(async () => {
        if (!accounts || accounts.length === 0) {
            setTransactions([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        const client = getTransactionsClient();
        const allTransactions: TransactionDto[] = [];

        try {
            for (const account of accounts) {
                const accountTransactions = await client.getAccountTransactions(account.id);
                allTransactions.push(...accountTransactions);
            }
            // Sort by date, most recent first
            allTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setTransactions(allTransactions);
        } catch (error) {
            console.error('Error loading transactions:', error);
        } finally {
            setIsLoading(false);
        }
    }, [accounts]);

    useEffect(() => {
        if (!accountsLoading) {
            loadAllTransactions();
        }
    }, [accountsLoading, loadAllTransactions]);

    const handleSuccess = () => {
        setShowForm(false);
        loadAllTransactions();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
                    <p className="text-muted-foreground">Effectuez des opérations et consultez l'historique</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Annuler' : '+ Nouvelle transaction'}
                </Button>
            </div>

            {showForm && (
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-xl font-semibold mb-4">Effectuer une transaction</h3>
                    <TransactionForm onSuccess={handleSuccess} />
                </div>
            )}

            <div className="bg-card rounded-lg border shadow-sm">
                <div className="p-6 border-b">
                    <h3 className="text-xl font-semibold">Historique des transactions</h3>
                </div>
                <TransactionList
                    transactions={transactions}
                    accounts={accounts}
                    isLoading={isLoading || accountsLoading}
                />
            </div>
        </div>
    );
}
