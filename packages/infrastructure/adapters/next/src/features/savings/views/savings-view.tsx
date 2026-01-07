'use client';

import { useAccounts } from '@workspace/adapter-next/features/accounts';
import { useAuth } from '@workspace/adapter-next/features/auth';
import { Button } from '@workspace/ui-react/components/button';
import Link from 'next/link';
import { useCurrentSavingsRate } from '../hooks';

export function SavingsView() {
    const { user } = useAuth();
    const { accounts, isLoading } = useAccounts();
    const { currentRate: fetchedRate, isLoading: isLoadingRate } = useCurrentSavingsRate();

    const savingsAccounts = accounts?.filter(acc => acc.type === 'SAVINGS') || [];
    const totalSavings = savingsAccounts.reduce((sum, acc) => sum + acc.balance, 0);
    const currentRate = fetchedRate?.toFixed(2) || '2.00';

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Épargne</h2>
                <p className="text-muted-foreground">Gérez vos comptes d'épargne et suivez leur rendement</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Épargne totale</h3>
                    {isLoading ? (
                        <div className="h-10 w-32 bg-muted animate-pulse rounded" />
                    ) : (
                        <p className="text-4xl font-bold">{totalSavings.toFixed(2)} €</p>
                    )}
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Taux actuel</h3>
                    {isLoadingRate ? (
                        <div className="h-10 w-24 bg-muted animate-pulse rounded" />
                    ) : (
                        <>
                            <p className="text-4xl font-bold text-green-600">{currentRate}%</p>
                            <p className="text-xs text-muted-foreground mt-1">Par an</p>
                        </>
                    )}
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Intérêts estimés/an</h3>
                    {isLoading ? (
                        <div className="h-10 w-32 bg-muted animate-pulse rounded" />
                    ) : (
                        <p className="text-4xl font-bold text-green-600">+{(totalSavings * (parseFloat(currentRate) / 100)).toFixed(2)} €</p>
                    )}
                </div>
            </div>

            <div className="bg-card p-6 rounded-lg border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">Mes comptes d'épargne</h3>
                    <Link href="/dashboard/accounts">
                        <Button variant="outline">Créer un compte épargne</Button>
                    </Link>
                </div>

                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-20 bg-muted animate-pulse rounded" />
                        ))}
                    </div>
                ) : savingsAccounts.length > 0 ? (
                    <div className="space-y-4">
                        {savingsAccounts.map((account) => {
                            const accountRate = account.savingsRate || parseFloat(currentRate) / 100;
                            return (
                                <div key={account.id} className="p-4 rounded-lg border bg-muted/50">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <h4 className="font-semibold text-lg">{account.customName}</h4>
                                            <p className="text-sm text-muted-foreground">{account.iban}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold">{account.balance.toFixed(2)} €</p>
                                            <p className="text-sm text-green-600">+{(account.balance * accountRate).toFixed(2)} € / an</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                        <Link href="/dashboard/transactions">
                                            <Button variant="outline" size="sm">Alimenter</Button>
                                        </Link>
                                        <Link href="/dashboard/transactions">
                                            <Button variant="outline" size="sm">Retirer</Button>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">Vous n'avez pas encore de compte d'épargne</p>
                        <Link href="/dashboard/accounts">
                            <Button>Créer mon premier compte épargne</Button>
                        </Link>
                    </div>
                )}
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Bon à savoir</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                    Vos comptes d'épargne sont rémunérés quotidiennement au taux en vigueur. 
                    Les intérêts sont calculés sur le solde de fin de journée et versés automatiquement.
                </p>
            </div>
        </div>
    );
}
