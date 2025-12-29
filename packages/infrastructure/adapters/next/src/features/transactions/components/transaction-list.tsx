'use client';

import type { TransactionDto } from '@workspace/application/dtos';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui-react/components/card';

interface TransactionListProps {
    transactions: TransactionDto[];
}

export function TransactionList({ transactions }: TransactionListProps) {
    if (transactions.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                Aucune transaction trouvée
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {transactions.map((transaction) => (
                <Card key={transaction.id}>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span className="text-base">
                                {transaction.type === 'TRANSFER' ? 'Transfert' : 
                                 transaction.type === 'DEPOSIT' ? 'Dépôt' : 
                                 transaction.type === 'WITHDRAWAL' ? 'Retrait' : transaction.type}
                            </span>
                            <span className={`text-lg font-bold ${
                                transaction.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {transaction.type === 'DEPOSIT' ? '+' : '-'}{transaction.amount.toFixed(2)} €
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm">
                            {transaction.description && (
                                <p className="text-muted-foreground">{transaction.description}</p>
                            )}
                            <div className="flex justify-between">
                                <span>Statut:</span>
                                <span className="font-medium">{transaction.status}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Date:</span>
                                <span className="font-medium">
                                    {new Date(transaction.createdAt).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
