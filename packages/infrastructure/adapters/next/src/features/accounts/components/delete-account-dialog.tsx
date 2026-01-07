'use client';

import { useState } from 'react';
import type { AccountDto } from '@workspace/application/dtos';
import { Button } from '@workspace/ui-react/components/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@workspace/ui-react/components/dialog';

interface DeleteAccountDialogProps {
    account: AccountDto | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (accountId: string) => Promise<void>;
}

export function DeleteAccountDialog({
    account,
    open,
    onOpenChange,
    onConfirm,
}: DeleteAccountDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConfirm = async () => {
        if (!account) return;

        setError(null);
        setIsSubmitting(true);

        try {
            await onConfirm(account.id);
            onOpenChange(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Supprimer le compte</DialogTitle>
                    <DialogDescription>
                        Êtes-vous sûr de vouloir supprimer ce compte ?
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {account && (
                        <div className="bg-muted p-4 rounded-lg">
                            <p className="font-semibold">{account.customName}</p>
                            <p className="text-sm text-muted-foreground">{account.iban}</p>
                            <p className="text-sm mt-2">
                                Solde actuel: <span className="font-semibold">{account.balance.toFixed(2)} €</span>
                            </p>
                        </div>
                    )}

                    {account && account.balance > 0 ? (
                        <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                ⚠️ Vous ne pouvez pas supprimer ce compte car son solde n'est pas à zéro. Veuillez transférer ou retirer tous les fonds avant de supprimer ce compte.
                            </p>
                        </div>
                    ) : (
                        <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg border border-red-200 dark:border-red-800">
                            <p className="text-sm text-red-700 dark:text-red-300">
                                ⚠️ Cette action est irréversible. Toutes les données associées à ce compte seront définitivement supprimées.
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg border border-red-200 dark:border-red-800">
                            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                    >
                        Annuler
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={isSubmitting || (account?.balance ?? 0) > 0}
                    >
                        {isSubmitting ? 'Suppression...' : 'Supprimer'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
