'use client';

import { useStocks, useStockOperations } from '@workspace/adapter-next/features/stocks';
import { StockList } from '@workspace/adapter-next/features/stocks/components';
import { Button } from '@workspace/ui-react/components/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui-react/components/tabs';
import { useAuth } from '@workspace/adapter-next/features/auth';

export default function StocksPage() {
    const { user } = useAuth();
    const { stocks, isLoading } = useStocks();
    const { portfolio, isLoading: portfolioLoading } = useStocks();

    const portfolioValue = portfolio?.totalValue || 0;
    const portfolioGain = portfolio?.totalGain || 0;
    const portfolioGainPercent = portfolioValue > 0 ? ((portfolioGain / (portfolioValue - portfolioGain)) * 100) : 0;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Actions</h2>
                <p className="text-muted-foreground">Investissez dans les actions disponibles et gérez votre portfolio</p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Valeur du portfolio</h3>
                    {portfolioLoading ? (
                        <div className="h-10 w-32 bg-muted animate-pulse rounded" />
                    ) : (
                        <p className="text-4xl font-bold">{portfolioValue.toFixed(2)} €</p>
                    )}
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Plus/Moins-value</h3>
                    {portfolioLoading ? (
                        <div className="h-10 w-32 bg-muted animate-pulse rounded" />
                    ) : (
                        <div>
                            <p className={`text-4xl font-bold ${portfolioGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {portfolioGain >= 0 ? '+' : ''}{portfolioGain.toFixed(2)} €
                            </p>
                            <p className={`text-sm ${portfolioGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {portfolioGain >= 0 ? '+' : ''}{portfolioGainPercent.toFixed(2)}%
                            </p>
                        </div>
                    )}
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Actions détenues</h3>
                    {portfolioLoading ? (
                        <div className="h-10 w-16 bg-muted animate-pulse rounded" />
                    ) : (
                        <p className="text-4xl font-bold">{portfolio?.stocks?.length || 0}</p>
                    )}
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Actions disponibles</h3>
                    {isLoading ? (
                        <div className="h-10 w-16 bg-muted animate-pulse rounded" />
                    ) : (
                        <p className="text-4xl font-bold">{stocks?.length || 0}</p>
                    )}
                </div>
            </div>

            <Tabs defaultValue="market" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="market">Marché</TabsTrigger>
                    <TabsTrigger value="portfolio">Mon Portfolio</TabsTrigger>
                    <TabsTrigger value="orders">Mes ordres</TabsTrigger>
                </TabsList>

                <TabsContent value="market" className="space-y-4">
                    <div className="bg-card rounded-lg border shadow-sm">
                        <div className="p-6 border-b">
                            <h3 className="text-xl font-semibold">Actions disponibles</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Frais : 1€ par transaction (achat ou vente)
                            </p>
                        </div>
                        <StockList stocks={stocks} isLoading={isLoading} mode="buy" />
                    </div>
                </TabsContent>

                <TabsContent value="portfolio" className="space-y-4">
                    <div className="bg-card rounded-lg border shadow-sm">
                        <div className="p-6 border-b">
                            <h3 className="text-xl font-semibold">Mon Portfolio</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Actions que vous possédez actuellement
                            </p>
                        </div>
                        {portfolioLoading ? (
                            <div className="p-6 space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-20 bg-muted animate-pulse rounded" />
                                ))}
                            </div>
                        ) : portfolio?.stocks && portfolio.stocks.length > 0 ? (
                            <div className="divide-y">
                                {portfolio.stocks.map((stock: any) => (
                                    <div key={stock.id} className="p-6 flex items-center justify-between hover:bg-muted/50 transition">
                                        <div className="flex-1">
                                            <h4 className="font-semibold">{stock.name}</h4>
                                            <p className="text-sm text-muted-foreground">{stock.symbol}</p>
                                        </div>
                                        <div className="text-right mr-8">
                                            <p className="font-semibold">{stock.quantity} actions</p>
                                            <p className="text-sm text-muted-foreground">
                                                Prix moyen: {stock.averagePrice.toFixed(2)} €
                                            </p>
                                        </div>
                                        <div className="text-right mr-8">
                                            <p className="font-semibold">{(stock.quantity * stock.currentPrice).toFixed(2)} €</p>
                                            <p className={`text-sm ${stock.gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {stock.gain >= 0 ? '+' : ''}{stock.gain.toFixed(2)} € ({stock.gainPercent >= 0 ? '+' : ''}{stock.gainPercent.toFixed(2)}%)
                                            </p>
                                        </div>
                                        <Button variant="outline" size="sm">Vendre</Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center text-muted-foreground">
                                <p>Vous ne possédez aucune action pour le moment</p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="orders" className="space-y-4">
                    <div className="bg-card rounded-lg border shadow-sm">
                        <div className="p-6 border-b">
                            <h3 className="text-xl font-semibold">Historique des ordres</h3>
                        </div>
                        <div className="p-12 text-center text-muted-foreground">
                            <p>Aucun ordre pour le moment</p>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            <div className="bg-yellow-50 dark:bg-yellow-950 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">⚠️ Avertissement</h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    L'investissement en actions comporte des risques. La valeur de vos investissements peut varier. 
                    Les performances passées ne préjugent pas des performances futures. Frais: 1€ par transaction.
                </p>
            </div>
        </div>
    );
}

