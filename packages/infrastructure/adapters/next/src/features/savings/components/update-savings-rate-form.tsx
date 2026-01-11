'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateSavingsRateSchema, type UpdateSavingsRateFormData } from '@workspace/adapter-common/validators';
import { Button } from '@workspace/ui-react/components/button';
import { Input } from '@workspace/ui-react/components/input';
import { Label } from '@workspace/ui-react/components/label';
import { Textarea } from '@workspace/ui-react/components/textarea';

interface UpdateSavingsRateFormProps {
    onSubmit: (data: UpdateSavingsRateFormData) => Promise<void>;
    isLoading: boolean;
    error: string | null;
    success: boolean;
    result: { accountsUpdated: number; notificationsSent: number } | null;
}

export function UpdateSavingsRateForm({
    onSubmit,
    isLoading,
    error,
    success,
    result,
}: UpdateSavingsRateFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<UpdateSavingsRateFormData>({
        resolver: zodResolver(updateSavingsRateSchema),
        defaultValues: {
            newRate: 0,
            notificationMessage: '',
        },
    });

    const handleFormSubmit = async (data: UpdateSavingsRateFormData) => {
        await onSubmit(data);
        reset();
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div>
                <Label htmlFor="newRate">Nouveau taux annuel (%)</Label>
                <Input
                    id="newRate"
                    type="number"
                    step="0.01"
                    {...register('newRate', { valueAsNumber: true })}
                    placeholder="Ex: 3.0"
                />
                {errors.newRate && (
                    <p className="text-sm text-destructive mt-1">{errors.newRate.message}</p>
                )}
                {!errors.newRate && (
                    <p className="text-sm text-muted-foreground mt-1">
                        Le taux est appliqué quotidiennement sur les comptes d'épargne
                    </p>
                )}
            </div>

            <div>
                <Label htmlFor="notificationMessage">Message de notification</Label>
                <Textarea
                    id="notificationMessage"
                    {...register('notificationMessage')}
                    placeholder="Message qui sera envoyé à tous les clients possédant un compte d'épargne..."
                    rows={4}
                />
                {errors.notificationMessage && (
                    <p className="text-sm text-destructive mt-1">{errors.notificationMessage.message}</p>
                )}
                {!errors.notificationMessage && (
                    <p className="text-sm text-muted-foreground mt-1">
                        Ce message sera envoyé comme notification à tous les détenteurs de comptes d'épargne
                    </p>
                )}
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
            )}

            {success && result && (
                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">✅ Taux mis à jour avec succès</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                        {result.accountsUpdated} compte(s) d'épargne mis à jour
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                        {result.notificationsSent} notification(s) envoyée(s) en temps réel
                    </p>
                </div>
            )}

            <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">⚠️ Attention</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    La modification du taux d'épargne :
                </p>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 list-disc list-inside mt-2 space-y-1">
                    <li>Sera appliquée immédiatement à tous les comptes d'épargne</li>
                    <li>Déclenchera l'envoi d'une notification à tous les clients concernés</li>
                    <li>Ne peut pas être annulée (mais peut être modifiée à nouveau)</li>
                </ul>
            </div>

            <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Modification en cours...' : 'Modifier le taux'}
                </Button>
                <Button type="button" variant="outline" onClick={() => reset()}>
                    Réinitialiser
                </Button>
            </div>
        </form>
    );
}
