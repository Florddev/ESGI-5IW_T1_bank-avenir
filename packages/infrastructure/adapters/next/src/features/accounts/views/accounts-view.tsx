'use client';

import { useAccounts } from '@workspace/adapter-next/features/accounts';
import { CreateAccountForm, AccountList } from '@workspace/adapter-next/features/accounts/components';
import { useAuth } from '@workspace/adapter-next/features/auth';
import { Button } from '@workspace/ui-react/components/button';
import { useState } from 'react';

export function AccountsView() {
    const { user } = useAuth();
    const { accounts, isLoading, refetch } = useAccounts();
    const [showCreateForm, setShowCreateForm] = useState(false);

    const handleSuccess = () => {
        setShowCreateForm(false);
        refetch();
    };

    if (!user) {
        return null;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Mes comptes</h2>
                    <p className="text-muted-foreground">Gérez vos comptes bancaires et consultez vos soldes</p>
                </div>
                <Button onClick={() => setShowCreateForm(!showCreateForm)}>
                    {showCreateForm ? 'Annuler' : '+ Nouveau compte'}
                </Button>
            </div>

            {showCreateForm && (
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-xl font-semibold mb-4">Créer un nouveau compte</h3>
                    <CreateAccountForm userId={user.id} onSuccess={handleSuccess} />
                </div>
            )}

            <div className="bg-card rounded-lg border shadow-sm">
                <div className="p-6 border-b">
                    <h3 className="text-xl font-semibold">Tous mes comptes</h3>
                </div>
                <AccountList accounts={accounts} isLoading={isLoading} />
            </div>
        </div>
    );
}
