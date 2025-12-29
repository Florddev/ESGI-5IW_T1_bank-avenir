'use client';

import type { UserDto } from '@workspace/application/dtos';
import Link from 'next/link';
import { Button } from '@workspace/ui-react/components/button';

interface AdvisorDashboardProps {
    user: UserDto;
}

export default function AdvisorDashboard({ user }: AdvisorDashboardProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2">
                    Bienvenue, {user.firstName} !
                </h2>
                <p className="text-muted-foreground">
                    Tableau de bord conseiller bancaire
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Mes clients</h3>
                    <p className="text-3xl font-bold">0</p>
                    <Link href="/dashboard/clients" className="text-xs text-primary hover:underline mt-2 inline-block">
                        Voir tous les clients →
                    </Link>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Crédits actifs</h3>
                    <p className="text-3xl font-bold">0</p>
                    <Link href="/dashboard/loans" className="text-xs text-primary hover:underline mt-2 inline-block">
                        Gérer les crédits →
                    </Link>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Messages en attente</h3>
                    <p className="text-3xl font-bold text-orange-500">0</p>
                    <Link href="/dashboard/messages" className="text-xs text-primary hover:underline mt-2 inline-block">
                        Voir les messages →
                    </Link>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Conversations actives</h3>
                    <p className="text-3xl font-bold">0</p>
                    <Link href="/dashboard/messages" className="text-xs text-primary hover:underline mt-2 inline-block">
                        Voir les conversations →
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold">Actions rapides</h3>
                    </div>
                    <div className="grid gap-3">
                        <Link href="/dashboard/loans">
                            <Button className="w-full justify-start" variant="outline">
                                <span className="mr-2">🏦</span>
                                Octroyer un crédit
                            </Button>
                        </Link>
                        <Link href="/dashboard/messages">
                            <Button className="w-full justify-start" variant="outline">
                                <span className="mr-2">💬</span>
                                Répondre aux messages
                            </Button>
                        </Link>
                        <Link href="/dashboard/clients">
                            <Button className="w-full justify-start" variant="outline">
                                <span className="mr-2">👥</span>
                                Voir mes clients
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold">Messages récents</h3>
                        <Link href="/dashboard/messages">
                            <Button variant="ghost" size="sm">Voir tout</Button>
                        </Link>
                    </div>
                    <div className="text-center py-8 text-muted-foreground">
                        <p>Aucun message pour le moment</p>
                    </div>
                </div>
            </div>

            <div className="bg-card p-6 rounded-lg border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">Crédits en cours</h3>
                    <Link href="/dashboard/loans">
                        <Button variant="ghost" size="sm">Voir tout</Button>
                    </Link>
                </div>
                <div className="text-center py-8 text-muted-foreground">
                    <p>Aucun crédit pour le moment</p>
                </div>
            </div>
        </div>
    );
}
