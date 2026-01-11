'use client';

import { useState } from 'react';
import type { UpdateSavingsRateFormData } from '@workspace/adapter-common/validators';
import { useUpdateSavingsRate, useCurrentSavingsRate } from '../hooks';
import { UpdateSavingsRateForm } from '../components';

export function SavingsRateView() {
    const { updateSavingsRate, isLoading, error } = useUpdateSavingsRate();
    const { currentRate: fetchedRate, isLoading: isLoadingRate, refetch } = useCurrentSavingsRate();

    const currentRate = fetchedRate?.toFixed(2) || '2.5';
    const [success, setSuccess] = useState(false);
    const [result, setResult] = useState<{ accountsUpdated: number; notificationsSent: number } | null>(null);

    const handleSubmit = async (data: UpdateSavingsRateFormData) => {
        setSuccess(false);

        try {
            const responseData = await updateSavingsRate(data.newRate, data.notificationMessage);
            setResult(responseData);
            await refetch();
            setSuccess(true);
        } catch (err) {
            // Error is handled by the hook
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Taux d'épargne</h2>
                <p className="text-muted-foreground">Modifiez le taux d'intérêt appliqué aux comptes d'épargne</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Taux actuel</h3>
                    <p className="text-5xl font-bold text-primary">{currentRate}%</p>
                    <p className="text-xs text-muted-foreground mt-2">Par an</p>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Comptes d'épargne actifs</h3>
                    <p className="text-5xl font-bold">0</p>
                    <p className="text-xs text-muted-foreground mt-2">Seront notifiés</p>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Dernière modification</h3>
                    <p className="text-2xl font-bold">--/--/----</p>
                    <p className="text-xs text-muted-foreground mt-2">Date</p>
                </div>
            </div>

            <div className="bg-card p-6 rounded-lg border shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Modifier le taux d'épargne</h3>
                <UpdateSavingsRateForm
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    error={error}
                    success={success}
                    result={result}
                />
            </div>

            <div className="bg-card p-6 rounded-lg border shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Historique des modifications</h3>
                <div className="space-y-3">
                    <div className="p-12 text-center text-muted-foreground">
                        <p>Aucune modification enregistrée</p>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Fonctionnement</h3>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
                    <li>Le taux est appliqué quotidiennement sur le solde de fin de journée</li>
                    <li>Les intérêts sont calculés prorata temporis (au prorata du temps)</li>
                    <li>Les intérêts sont versés automatiquement sur le compte d'épargne</li>
                    <li>Formule: Intérêts quotidiens = Solde × (Taux annuel / 365)</li>
                </ul>
            </div>
        </div>
    );
}
