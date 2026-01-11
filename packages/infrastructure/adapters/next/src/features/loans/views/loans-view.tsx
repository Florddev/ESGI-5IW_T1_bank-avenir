'use client';

import { useState } from 'react';
import { useLoans, useLoanOperations } from '../hooks';
import { useAuth } from '@workspace/adapter-next/features/auth';
import { LoanList, CreateLoanForm } from '../components';
import { Button } from '@workspace/ui-react/components/button';
import type { CreateLoanFormData } from '@workspace/adapter-common/validators';

export function LoansView() {
    const { user } = useAuth();
    const { loans, isLoading, refetch } = useLoans(user?.id || null);
    const { create, isCreating } = useLoanOperations();
    const [showCreateForm, setShowCreateForm] = useState(false);

    const handleSubmit = async (data: CreateLoanFormData) => {
        try {
            await create(data);
            await refetch();
            setShowCreateForm(false);
        } catch (err) {
            // Error is handled by the hook
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Crédits</h2>
                    <p className="text-muted-foreground">Gérez les crédits de vos clients</p>
                </div>
                <Button onClick={() => setShowCreateForm(!showCreateForm)}>
                    {showCreateForm ? 'Annuler' : '+ Octroyer un crédit'}
                </Button>
            </div>

            {showCreateForm && (
                <CreateLoanForm
                    onSubmit={handleSubmit}
                    onCancel={() => setShowCreateForm(false)}
                    isLoading={isCreating}
                    clients={[]}
                />
            )}

            <div className="bg-card rounded-lg border shadow-sm">
                <div className="p-6 border-b">
                    <h3 className="text-xl font-semibold">Tous les crédits</h3>
                </div>
                <LoanList loans={loans} isLoading={isLoading} />
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Calcul des crédits</h3>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
                    <li>Méthode : Mensualités constantes</li>
                    <li>Taux d'intérêt : Calculé sur le capital restant dû chaque mois</li>
                    <li>Assurance : Obligatoire, calculée sur le total du crédit et prélevée sur les mensualités</li>
                    <li>Les mensualités incluent capital + intérêts + assurance</li>
                </ul>
            </div>
        </div>
    );
}
