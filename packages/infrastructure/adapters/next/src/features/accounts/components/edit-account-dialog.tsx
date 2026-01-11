'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { AccountDto } from '@workspace/application/dtos';
import { updateAccountNameSchema, type UpdateAccountNameFormData } from '@workspace/adapter-common/validators';
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<UpdateAccountNameFormData>({
        resolver: zodResolver(updateAccountNameSchema),
        defaultValues: {
            customName: '',
        },
    });

    useEffect(() => {
        if (open && account) {
            reset({ customName: account.customName });
            setError(null);
        }
    }, [open, account, reset]);

    const handleOpenChange = (newOpen: boolean) => {
        onOpenChange(newOpen);
    };

    const onSubmit = async (data: UpdateAccountNameFormData) => {
        if (!account) return;

        setError(null);
        setIsSubmitting(true);

        try {
            await onConfirm(account.id, data.customName.trim());
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

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="customName">Nouveau nom</Label>
                        <Input
                            id="customName"
                            type="text"
                            {...register('customName')}
                            placeholder="Mon compte courant"
                        />
                        {errors.customName && (
                            <p className="text-sm text-destructive mt-1">{errors.customName.message}</p>
                        )}
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
