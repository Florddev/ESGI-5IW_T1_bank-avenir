'use client';

import type { TransactionDto, AccountDto } from '@workspace/application/dtos';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui-react/components/card';
import { ArrowRight } from 'lucide-react';

interface TransactionListProps {
    transactions: TransactionDto[];
    accounts?: AccountDto[];
    isLoading?: boolean;
}

export function TransactionList({ transactions, accounts, isLoading }: TransactionListProps) {
    if (isLoading) {
        return (
            <div className="space-y-3 p-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-muted animate-pulse rounded" />
                ))}
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                Aucune transaction trouvée
            </div>
        );
    }

    const getAccountName = (accountId: string) => {
        if (accountId === 'system-deposit') return 'Dépôt externe';
        if (accountId === 'system-withdrawal') return 'Retrait externe';
        const account = accounts?.find(acc => acc.id === accountId);
        return account ? account.customName : accountId.slice(0, 8);
    };

    const myAccountIds = accounts?.map(acc => acc.id) || [];

    return (
        <div className="space-y-3 p-6">
            {transactions.map((transaction) => {
                const isReceiving = myAccountIds.includes(transaction.toAccountId);
                const isSending = myAccountIds.includes(transaction.fromAccountId);
                const isTransferBetweenMyAccounts = isReceiving && isSending;

                let sign = '';
                let colorClass = 'text-gray-600';

                if (isTransferBetweenMyAccounts) {
                    sign = '↔';
                    colorClass = 'text-blue-600';
                } else if (isReceiving) {
                    sign = '+';
                    colorClass = 'text-green-600';
                } else if (isSending) {
                    sign = '-';
                    colorClass = 'text-red-600';
                }

                return (
                    <Card key={transaction.id}>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex justify-between items-center">
                                <span className="text-base">
                                    {transaction.type === 'TRANSFER' ? 'Transfert' :
                                     transaction.type === 'DEPOSIT' ? 'Dépôt' :
                                     transaction.type === 'WITHDRAWAL' ? 'Retrait' : transaction.type}
                                </span>
                                <span className={`text-lg font-bold ${colorClass}`}>
                                    {sign}{transaction.amount.toFixed(2)} €
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="space-y-2 text-sm">
                                {transaction.type === 'TRANSFER' && (
                                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                        <span className="font-medium">{getAccountName(transaction.fromAccountId)}</span>
                                        <ArrowRight className="h-4 w-4" />
                                        <span className="font-medium">{getAccountName(transaction.toAccountId)}</span>
                                    </div>
                                )}
                                {transaction.description && (
                                    <p className="text-muted-foreground">{transaction.description}</p>
                                )}
                                <div className="flex justify-between">
                                    <span>Statut:</span>
                                    <span className="font-medium capitalize">{transaction.status.toLowerCase()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Date:</span>
                                    <span className="font-medium">
                                        {new Date(transaction.createdAt).toLocaleString('fr-FR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
