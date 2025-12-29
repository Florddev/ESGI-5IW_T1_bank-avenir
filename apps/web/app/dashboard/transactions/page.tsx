'use client';

import { useTransactions, useTransactionOperations } from '@workspace/adapter-next/features/transactions';
import { TransactionList, TransactionForm } from '@workspace/adapter-next/features/transactions/components';
import { Button } from '@workspace/ui-react/components/button';
import { useState } from 'react';

export default function TransactionsPage() {
    const { transactions, isLoading } = useTransactions();
    const [showForm, setShowForm] = useState(false);

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
                    <TransactionForm onSuccess={() => setShowForm(false)} />
                </div>
            )}

            <div className="bg-card rounded-lg border shadow-sm">
                <div className="p-6 border-b">
                    <h3 className="text-xl font-semibold">Historique des transactions</h3>
                </div>
                <TransactionList transactions={transactions} isLoading={isLoading} />
            </div>
        </div>
    );
}

