'use client';

import { useAccounts, useUpdateAccount, useDeleteAccount } from '@workspace/adapter-next/features/accounts';
import { CreateAccountForm, AccountList, EditAccountDialog, DeleteAccountDialog } from '@workspace/adapter-next/features/accounts/components';
import { useAuth } from '@workspace/adapter-next/features/auth';
import { Button } from '@workspace/ui-react/components/button';
import { useState } from 'react';
import type { AccountDto } from '@workspace/application/dtos';

export function AccountsView() {
    const { user } = useAuth();
    const { accounts, isLoading, refetch } = useAccounts();
    const { updateAccountName } = useUpdateAccount();
    const { deleteAccount } = useDeleteAccount();

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editAccount, setEditAccount] = useState<AccountDto | null>(null);
    const [deleteAccountData, setDeleteAccountData] = useState<AccountDto | null>(null);

    const handleSuccess = () => {
        setShowCreateForm(false);
        refetch();
    };

    const handleEdit = (account: AccountDto) => {
        setEditAccount(account);
    };

    const handleDelete = (accountId: string) => {
        const account = accounts.find(acc => acc.id === accountId);
        if (account) {
            setDeleteAccountData(account);
        }
    };

    const handleConfirmEdit = async (accountId: string, newName: string) => {
        await updateAccountName(accountId, newName);
        setEditAccount(null);
        refetch();
    };

    const handleConfirmDelete = async (accountId: string) => {
        await deleteAccount(accountId);
        setDeleteAccountData(null);
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
                <AccountList
                    accounts={accounts}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            <EditAccountDialog
                account={editAccount}
                open={editAccount !== null}
                onOpenChange={(open) => !open && setEditAccount(null)}
                onConfirm={handleConfirmEdit}
            />

            <DeleteAccountDialog
                account={deleteAccountData}
                open={deleteAccountData !== null}
                onOpenChange={(open) => !open && setDeleteAccountData(null)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}
