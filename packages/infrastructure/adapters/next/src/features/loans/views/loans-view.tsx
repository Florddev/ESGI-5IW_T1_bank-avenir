'use client';

import { useState } from 'react';
import { useLoans, useLoanOperations } from '../hooks';
import { useAuth } from '@workspace/adapter-next/features/auth';
import { LoanList } from '../components';
import { Button } from '@workspace/ui-react/components/button';
import { Input } from '@workspace/ui-react/components/input';
import { Label } from '@workspace/ui-react/components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui-react/components/select';

export function LoansView() {
    const { user } = useAuth();
    const { loans, isLoading, refetch } = useLoans(user?.id || null);
    const { create, isCreating } = useLoanOperations();
    const [showCreateForm, setShowCreateForm] = useState(false);

    const [clientId, setClientId] = useState('');
    const [amount, setAmount] = useState('');
    const [annualRate, setAnnualRate] = useState('');
    const [insuranceRate, setInsuranceRate] = useState('');
    const [durationMonths, setDurationMonths] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await create({
            clientId,
            amount: parseFloat(amount),
            annualRate: parseFloat(annualRate),
            insuranceRate: parseFloat(insuranceRate),
            durationMonths: parseInt(durationMonths),
        });
        refetch();
        setShowCreateForm(false);
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
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-xl font-semibold mb-4">Octroyer un nouveau crédit</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="clientId">Client</Label>
                                <Select value={clientId} onValueChange={setClientId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un client" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="client1">Jean Dupont</SelectItem>
                                        <SelectItem value="client2">Marie Martin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="amount">Montant du crédit (€)</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Ex: 10000"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="annualRate">Taux annuel (%)</Label>
                                <Input
                                    id="annualRate"
                                    type="number"
                                    step="0.01"
                                    value={annualRate}
                                    onChange={(e) => setAnnualRate(e.target.value)}
                                    placeholder="Ex: 3.5"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="insuranceRate">Taux assurance (%)</Label>
                                <Input
                                    id="insuranceRate"
                                    type="number"
                                    step="0.01"
                                    value={insuranceRate}
                                    onChange={(e) => setInsuranceRate(e.target.value)}
                                    placeholder="Ex: 0.36"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="durationMonths">Durée (mois)</Label>
                                <Input
                                    id="durationMonths"
                                    type="number"
                                    value={durationMonths}
                                    onChange={(e) => setDurationMonths(e.target.value)}
                                    placeholder="Ex: 120"
                                    required
                                />
                            </div>
                        </div>

                        <div className="bg-muted p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">Calcul estimatif</h4>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Mensualité</p>
                                    <p className="font-semibold">--- €</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Coût total</p>
                                    <p className="font-semibold">--- €</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Coût crédit</p>
                                    <p className="font-semibold">--- €</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={isCreating}>
                                {isCreating ? 'Création...' : 'Octroyer le crédit'}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                                Annuler
                            </Button>
                        </div>
                    </form>
                </div>
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
