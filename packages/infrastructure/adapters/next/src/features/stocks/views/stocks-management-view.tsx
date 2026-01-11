'use client';

import { useState } from 'react';
import { Button } from '@workspace/ui-react/components/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui-react/components/tabs';
import { useStocks, useCreateStock } from '../hooks';
import { CreateStockForm } from '../components';

export function StocksManagementView() {
    const { stocks, isLoading, refetch } = useStocks();
    const { createStock, isLoading: isCreating, error: createError } = useCreateStock();

    const [showCreateForm, setShowCreateForm] = useState(false);

    const availableStocks = stocks?.filter(s => s.status === 'AVAILABLE') || [];
    const suspendedStocks = stocks?.filter(s => s.status === 'UNAVAILABLE') || [];

    const handleSubmit = async (data: { symbol: string; companyName: string }) => {
        try {
            await createStock(data);
            setShowCreateForm(false);
            await refetch();
        } catch (err) {
            // Error is handled by the hook
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Gestion des actions</h2>
                    <p className="text-muted-foreground">Créez, modifiez ou supprimez les actions disponibles</p>
                </div>
                <Button onClick={() => setShowCreateForm(!showCreateForm)}>
                    {showCreateForm ? 'Annuler' : '+ Nouvelle action'}
                </Button>
            </div>

            {showCreateForm && (
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-xl font-semibold mb-4">Ajouter une nouvelle action</h3>
                    <CreateStockForm
                        onSubmit={handleSubmit}
                        onCancel={() => setShowCreateForm(false)}
                        isLoading={isCreating}
                        error={createError}
                    />
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-4">
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Actions disponibles</h3>
                    {isLoading ? (
                        <div className="h-10 w-16 bg-muted animate-pulse rounded" />
                    ) : (
                        <p className="text-4xl font-bold">{availableStocks.length}</p>
                    )}
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Actions suspendues</h3>
                    {isLoading ? (
                        <div className="h-10 w-16 bg-muted animate-pulse rounded" />
                    ) : (
                        <p className="text-4xl font-bold">{suspendedStocks.length}</p>
                    )}
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Total actions</h3>
                    {isLoading ? (
                        <div className="h-10 w-16 bg-muted animate-pulse rounded" />
                    ) : (
                        <p className="text-4xl font-bold">{stocks.length}</p>
                    )}
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Investisseurs</h3>
                    <p className="text-4xl font-bold">0</p>
                    <p className="text-xs text-muted-foreground mt-1">Clients actifs</p>
                </div>
            </div>

            <Tabs defaultValue="available" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="available">Disponibles</TabsTrigger>
                    <TabsTrigger value="suspended">Suspendues</TabsTrigger>
                    <TabsTrigger value="orders">Carnet d'ordres</TabsTrigger>
                </TabsList>

                <TabsContent value="available" className="space-y-4">
                    <div className="bg-card rounded-lg border shadow-sm">
                        <div className="p-6 border-b">
                            <h3 className="text-xl font-semibold">Actions disponibles à la négociation</h3>
                        </div>
                        {isLoading ? (
                            <div className="p-6 space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-20 bg-muted animate-pulse rounded" />
                                ))}
                            </div>
                        ) : availableStocks.length > 0 ? (
                            <div className="divide-y">
                                {availableStocks.map((stock) => (
                                    <div key={stock.id} className="p-6 flex items-center justify-between">
                                        <div>
                                            <h4 className="font-semibold text-lg">{stock.symbol}</h4>
                                            <p className="text-sm text-muted-foreground">{stock.companyName}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold">
                                                {stock.currentPrice ? `${stock.currentPrice.toFixed(2)} €` : 'N/A'}
                                            </p>
                                            <p className="text-xs text-muted-foreground">Prix actuel</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center text-muted-foreground">
                                <p className="mb-4">Aucune action disponible</p>
                                <Button onClick={() => setShowCreateForm(true)}>
                                    Ajouter la première action
                                </Button>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="suspended" className="space-y-4">
                    <div className="bg-card rounded-lg border shadow-sm">
                        <div className="p-6 border-b">
                            <h3 className="text-xl font-semibold">Actions temporairement suspendues</h3>
                        </div>
                        {isLoading ? (
                            <div className="p-6 space-y-3">
                                {[1, 2].map((i) => (
                                    <div key={i} className="h-20 bg-muted animate-pulse rounded" />
                                ))}
                            </div>
                        ) : suspendedStocks.length > 0 ? (
                            <div className="divide-y">
                                {suspendedStocks.map((stock) => (
                                    <div key={stock.id} className="p-6 flex items-center justify-between">
                                        <div>
                                            <h4 className="font-semibold text-lg">{stock.symbol}</h4>
                                            <p className="text-sm text-muted-foreground">{stock.companyName}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded">
                                                Suspendue
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center text-muted-foreground">
                                <p>Aucune action suspendue</p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="orders" className="space-y-4">
                    <div className="bg-card rounded-lg border shadow-sm">
                        <div className="p-6 border-b">
                            <h3 className="text-xl font-semibold">Carnet d'ordres global</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Ordres d'achat et de vente en attente d'exécution
                            </p>
                        </div>
                        <div className="p-12 text-center text-muted-foreground">
                            <p>Aucun ordre en attente</p>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Fonctionnement du marché</h3>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
                    <li>Le cours d'une action est déterminé par le prix d'équilibre entre offre et demande</li>
                    <li>Les ordres d'achat et de vente sont appariés automatiquement dans le carnet d'ordres</li>
                    <li>Les clients sont propriétaires de leurs actions (pas de prêt de titres)</li>
                    <li>Frais fixes : 1€ par transaction (achat ou vente)</li>
                    <li>Vous pouvez suspendre temporairement la négociation d'une action</li>
                </ul>
            </div>
        </div>
    );
}
