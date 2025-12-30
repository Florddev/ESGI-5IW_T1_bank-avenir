'use client';

import { useState } from 'react';
import { Button } from '@workspace/ui-react/components/button';
import { Input } from '@workspace/ui-react/components/input';
import { Label } from '@workspace/ui-react/components/label';
import { Textarea } from '@workspace/ui-react/components/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui-react/components/tabs';

export function StocksManagementView() {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [symbol, setSymbol] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [initialPrice, setInitialPrice] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setShowCreateForm(false);
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
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="symbol">Symbole</Label>
                                <Input
                                    id="symbol"
                                    value={symbol}
                                    onChange={(e) => setSymbol(e.target.value)}
                                    placeholder="Ex: AAPL"
                                    required
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Code boursier unique (3-5 caractères)
                                </p>
                            </div>
                            <div>
                                <Label htmlFor="initialPrice">Prix initial (€)</Label>
                                <Input
                                    id="initialPrice"
                                    type="number"
                                    step="0.01"
                                    value={initialPrice}
                                    onChange={(e) => setInitialPrice(e.target.value)}
                                    placeholder="Ex: 150.00"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="name">Nom de l'entreprise</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ex: Apple Inc."
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Description de l'entreprise et de son secteur d'activité..."
                                rows={4}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit">Créer l'action</Button>
                            <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                                Annuler
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-4">
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Actions disponibles</h3>
                    <p className="text-4xl font-bold">0</p>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Volume total</h3>
                    <p className="text-4xl font-bold">0</p>
                    <p className="text-xs text-muted-foreground mt-1">Ordres en attente</p>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Capitalisation</h3>
                    <p className="text-4xl font-bold">0 €</p>
                    <p className="text-xs text-muted-foreground mt-1">Total marché</p>
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
                        <div className="p-12 text-center text-muted-foreground">
                            <p className="mb-4">Aucune action disponible</p>
                            <Button onClick={() => setShowCreateForm(true)}>
                                Ajouter la première action
                            </Button>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="suspended" className="space-y-4">
                    <div className="bg-card rounded-lg border shadow-sm">
                        <div className="p-6 border-b">
                            <h3 className="text-xl font-semibold">Actions temporairement suspendues</h3>
                        </div>
                        <div className="p-12 text-center text-muted-foreground">
                            <p>Aucune action suspendue</p>
                        </div>
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
