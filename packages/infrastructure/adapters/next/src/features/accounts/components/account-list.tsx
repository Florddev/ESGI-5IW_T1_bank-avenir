'use client';

import type { AccountDto } from '@workspace/application/dtos';
import { Button } from '@workspace/ui-react/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui-react/components/card';

interface AccountListProps {
    accounts: AccountDto[];
    onEdit?: (account: AccountDto) => void;
    onDelete?: (accountId: string) => void;
}

export function AccountList({ accounts, onEdit, onDelete }: AccountListProps) {
    if (accounts.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                Aucun compte trouvé
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-6">
            {accounts.map((account) => (
                <Card key={account.id}>
                    <CardHeader>
                        <CardTitle>{account.customName}</CardTitle>
                        <p className="text-sm text-muted-foreground">{account.iban}</p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm">Type:</span>
                                <span className="text-sm font-medium">
                                    {account.type === 'CHECKING' ? 'Courant' : 'Épargne'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Solde:</span>
                                <span className="text-sm font-medium">
                                    {account.balance.toFixed(2)} €
                                </span>
                            </div>
                            {account.savingsRate !== undefined && (
                                <div className="flex justify-between">
                                    <span className="text-sm">Taux:</span>
                                    <span className="text-sm font-medium">
                                        {account.savingsRate}%
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="mt-4 flex gap-2">
                            {onEdit && (
                                <Button variant="outline" size="sm" onClick={() => onEdit(account)}>
                                    Modifier
                                </Button>
                            )}
                            {onDelete && (
                                <Button variant="destructive" size="sm" onClick={() => onDelete(account.id)}>
                                    Supprimer
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
