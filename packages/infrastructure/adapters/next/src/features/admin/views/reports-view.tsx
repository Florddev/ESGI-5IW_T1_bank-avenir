'use client';

import { Button } from '@workspace/ui-react/components/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui-react/components/tabs';

export function ReportsView() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Rapports et statistiques</h2>
                <p className="text-muted-foreground">Vue d'ensemble des activités de la banque</p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Clients totaux</h3>
                    <p className="text-4xl font-bold">0</p>
                    <p className="text-xs text-green-600 mt-1">+0 ce mois</p>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Comptes actifs</h3>
                    <p className="text-4xl font-bold">0</p>
                    <p className="text-xs text-muted-foreground mt-1">Tous types</p>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Volume total</h3>
                    <p className="text-4xl font-bold">0 €</p>
                    <p className="text-xs text-muted-foreground mt-1">Dépôts cumulés</p>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Transactions/jour</h3>
                    <p className="text-4xl font-bold">0</p>
                    <p className="text-xs text-muted-foreground mt-1">Moyenne 30j</p>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                    <TabsTrigger value="accounts">Comptes</TabsTrigger>
                    <TabsTrigger value="transactions">Transactions</TabsTrigger>
                    <TabsTrigger value="loans">Crédits</TabsTrigger>
                    <TabsTrigger value="stocks">Actions</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="bg-card p-6 rounded-lg border shadow-sm">
                        <h3 className="text-xl font-semibold mb-4">Activité générale</h3>
                        <div className="h-64 flex items-center justify-center text-muted-foreground">
                            <p>Graphique d'activité à venir</p>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="bg-card p-6 rounded-lg border shadow-sm">
                            <h3 className="font-semibold mb-4">Répartition des comptes</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Comptes courants</span>
                                    <span className="font-semibold">0</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Comptes épargne</span>
                                    <span className="font-semibold">0</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card p-6 rounded-lg border shadow-sm">
                            <h3 className="font-semibold mb-4">Répartition des utilisateurs</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Clients</span>
                                    <span className="font-semibold">0</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Conseillers</span>
                                    <span className="font-semibold">0</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Directeurs</span>
                                    <span className="font-semibold">0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="accounts" className="space-y-4">
                    <div className="bg-card p-6 rounded-lg border shadow-sm">
                        <h3 className="text-xl font-semibold mb-4">Statistiques des comptes</h3>
                        <div className="p-12 text-center text-muted-foreground">
                            <p>Rapport détaillé à venir</p>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="transactions" className="space-y-4">
                    <div className="bg-card p-6 rounded-lg border shadow-sm">
                        <h3 className="text-xl font-semibold mb-4">Statistiques des transactions</h3>
                        <div className="p-12 text-center text-muted-foreground">
                            <p>Rapport détaillé à venir</p>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="loans" className="space-y-4">
                    <div className="bg-card p-6 rounded-lg border shadow-sm">
                        <h3 className="text-xl font-semibold mb-4">Statistiques des crédits</h3>
                        <div className="p-12 text-center text-muted-foreground">
                            <p>Rapport détaillé à venir</p>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="stocks" className="space-y-4">
                    <div className="bg-card p-6 rounded-lg border shadow-sm">
                        <h3 className="text-xl font-semibold mb-4">Statistiques du marché</h3>
                        <div className="p-12 text-center text-muted-foreground">
                            <p>Rapport détaillé à venir</p>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            <div className="flex gap-2">
                <Button>Exporter en PDF</Button>
                <Button variant="outline">Exporter en Excel</Button>
            </div>
        </div>
    );
}
