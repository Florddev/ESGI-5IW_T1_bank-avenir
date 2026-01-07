'use client';

import { useState } from 'react';
import type { AccountDto } from '@workspace/application/dtos';
import { Button } from '@workspace/ui-react/components/button';
import { Input } from '@workspace/ui-react/components/input';
import { Label } from '@workspace/ui-react/components/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@workspace/ui-react/components/dialog';

interface EditAccountDialogProps {
    account: AccountDto | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (accountId: string, newName: string) => Promise<void>;
}

export function EditAccountDialog({
    account,
    open,
    onOpenChange,
    onConfirm,
}: EditAccountDialogProps) {
    const [customName, setCustomName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleOpenChange = (newOpen: boolean) => {
        if (newOpen && account) {
            setCustomName(account.customName);
            setError(null);
        }
        onOpenChange(newOpen);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!account) return;

        setError(null);
        setIsSubmitting(true);

        if (customName.trim().length < 2) {
            setError('Le nom doit contenir au moins 2 caractères');
            setIsSubmitting(false);
            return;
        }

        try {
            await onConfirm(account.id, customName.trim());
            onOpenChange(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Modifier le nom du compte</DialogTitle>
                    <DialogDescription>
                        Modifiez le nom personnalisé de votre compte
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="customName">Nouveau nom</Label>
                        <Input
                            id="customName"
                            type="text"
                            value={customName}
                            onChange={(e) => setCustomName(e.target.value)}
                            placeholder="Mon compte courant"
                            required
                            minLength={2}
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg border border-red-200 dark:border-red-800">
                            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Modification...' : 'Modifier'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
