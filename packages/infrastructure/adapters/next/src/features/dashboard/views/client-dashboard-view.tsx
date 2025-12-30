'use client';

import { useAccounts } from '@workspace/adapter-next/features/accounts';
import { useStocks } from '@workspace/adapter-next/features/stocks';
import type { UserDto } from '@workspace/application/dtos';
import Link from 'next/link';
import { Button } from '@workspace/ui-react/components/button';

interface ClientDashboardViewProps {
    user: UserDto;
}

export function ClientDashboardView({ user }: ClientDashboardViewProps) {
    const { accounts, isLoading: accountsLoading } = useAccounts();
    const { stocks, isLoading: stocksLoading } = useStocks();

    const totalBalance = accounts?.reduce((sum, acc) => sum + acc.balance, 0) || 0;
    const savingsAccounts = accounts?.filter(acc => acc.accountType === 'SAVINGS') || [];
    const totalSavings = savingsAccounts.reduce((sum, acc) => sum + acc.balance, 0);
    
    const portfolioValue = stocks?.reduce((sum, stock) => sum + (stock.currentPrice * stock.quantity), 0) || 0;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2">
                    Bienvenue, {user.firstName} !
                </h2>
                <p className="text-muted-foreground">
                    Voici votre vue d'ensemble financière
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Solde total</h3>
                    {accountsLoading ? (
                        <div className="h-8 w-32 bg-muted animate-pulse rounded" />
                    ) : (
                        <p className="text-3xl font-bold">{totalBalance.toFixed(2)} €</p>
                    )}
                    <Link href="/dashboard/accounts" className="text-xs text-primary hover:underline mt-2 inline-block">
                        Voir les comptes →
                    </Link>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Épargne</h3>
                    {accountsLoading ? (
                        <div className="h-8 w-32 bg-muted animate-pulse rounded" />
                    ) : (
                        <p className="text-3xl font-bold">{totalSavings.toFixed(2)} €</p>
                    )}
                    <Link href="/dashboard/savings" className="text-xs text-primary hover:underline mt-2 inline-block">
                        Gérer l'épargne →
                    </Link>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Portfolio actions</h3>
                    {stocksLoading ? (
                        <div className="h-8 w-32 bg-muted animate-pulse rounded" />
                    ) : (
                        <p className="text-3xl font-bold">{portfolioValue.toFixed(2)} €</p>
                    )}
                    <Link href="/dashboard/stocks" className="text-xs text-primary hover:underline mt-2 inline-block">
                        Voir le portfolio →
                    </Link>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Mes comptes</h3>
                    {accountsLoading ? (
                        <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                    ) : (
                        <p className="text-3xl font-bold">{accounts?.length || 0}</p>
                    )}
                    <Link href="/dashboard/accounts" className="text-xs text-primary hover:underline mt-2 inline-block">
                        Créer un compte →
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold">Actions rapides</h3>
                    </div>
                    <div className="grid gap-3">
                        <Link href="/dashboard/transactions">
                            <Button className="w-full justify-start" variant="outline">
                                <span className="mr-2">💸</span>
                                Effectuer un transfert
                            </Button>
                        </Link>
                        <Link href="/dashboard/accounts">
                            <Button className="w-full justify-start" variant="outline">
                                <span className="mr-2">💳</span>
                                Créer un nouveau compte
                            </Button>
                        </Link>
                        <Link href="/dashboard/stocks">
                            <Button className="w-full justify-start" variant="outline">
                                <span className="mr-2">📈</span>
                                Acheter des actions
                            </Button>
                        </Link>
                        <Link href="/dashboard/messages">
                            <Button className="w-full justify-start" variant="outline">
                                <span className="mr-2">💬</span>
                                Contacter un conseiller
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold">Mes comptes</h3>
                        <Link href="/dashboard/accounts">
                            <Button variant="ghost" size="sm">Voir tout</Button>
                        </Link>
                    </div>
                    {accountsLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-16 bg-muted animate-pulse rounded" />
                            ))}
                        </div>
                    ) : accounts && accounts.length > 0 ? (
                        <div className="space-y-3">
                            {accounts.slice(0, 3).map((account) => (
                                <div key={account.id} className="flex items-center justify-between p-3 rounded border">
                                    <div>
                                        <p className="font-medium">{account.name}</p>
                                        <p className="text-xs text-muted-foreground">{account.iban}</p>
                                    </div>
                                    <p className="font-semibold">{account.balance.toFixed(2)} €</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <p className="mb-4">Aucun compte</p>
                            <Link href="/dashboard/accounts">
                                <Button size="sm">Créer mon premier compte</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
