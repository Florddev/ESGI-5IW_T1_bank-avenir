'use client';

import type { UserDto } from '@workspace/application/dtos';
import Link from 'next/link';
import { Button } from '@workspace/ui-react/components/button';

interface DirectorDashboardViewProps {
    user: UserDto;
}

export function DirectorDashboardView({ user }: DirectorDashboardViewProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2">
                    Bienvenue, {user.firstName} !
                </h2>
                <p className="text-muted-foreground">
                    Tableau de bord directeur de banque
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Utilisateurs</h3>
                    <p className="text-3xl font-bold">0</p>
                    <Link href="/dashboard/users" className="text-xs text-primary hover:underline mt-2 inline-block">
                        Gérer les utilisateurs →
                    </Link>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Taux d'épargne actuel</h3>
                    <p className="text-3xl font-bold">2.5%</p>
                    <Link href="/dashboard/savings-rate" className="text-xs text-primary hover:underline mt-2 inline-block">
                        Modifier le taux →
                    </Link>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Actions disponibles</h3>
                    <p className="text-3xl font-bold">0</p>
                    <Link href="/dashboard/stocks-management" className="text-xs text-primary hover:underline mt-2 inline-block">
                        Gérer les actions →
                    </Link>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Volume total</h3>
                    <p className="text-3xl font-bold">0 €</p>
                    <Link href="/dashboard/reports" className="text-xs text-primary hover:underline mt-2 inline-block">
                        Voir les rapports →
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold">Actions rapides</h3>
                    </div>
                    <div className="grid gap-3">
                        <Link href="/dashboard/users">
                            <Button className="w-full justify-start" variant="outline">
                                <span className="mr-2">👥</span>
                                Créer un utilisateur
                            </Button>
                        </Link>
                        <Link href="/dashboard/savings-rate">
                            <Button className="w-full justify-start" variant="outline">
                                <span className="mr-2">📊</span>
                                Modifier le taux d'épargne
                            </Button>
                        </Link>
                        <Link href="/dashboard/stocks-management">
                            <Button className="w-full justify-start" variant="outline">
                                <span className="mr-2">📈</span>
                                Ajouter une action
                            </Button>
                        </Link>
                        <Link href="/dashboard/reports">
                            <Button className="w-full justify-start" variant="outline">
                                <span className="mr-2">📄</span>
                                Consulter les rapports
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold">Statistiques</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Clients actifs</span>
                            <span className="font-semibold">0</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Conseillers</span>
                            <span className="font-semibold">0</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Comptes d'épargne</span>
                            <span className="font-semibold">0</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Crédits en cours</span>
                            <span className="font-semibold">0</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-card p-6 rounded-lg border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">Actions récemment ajoutées</h3>
                    <Link href="/dashboard/stocks-management">
                        <Button variant="ghost" size="sm">Gérer les actions</Button>
                    </Link>
                </div>
                <div className="text-center py-8 text-muted-foreground">
                    <p>Aucune action pour le moment</p>
                </div>
            </div>
        </div>
    );
}
