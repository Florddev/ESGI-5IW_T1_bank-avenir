'use client';

import { useAuth } from '../../auth';
import { useStocks, usePortfolio } from '../hooks';
import { StockList } from '../components';
import { Button } from '@workspace/ui-react/components/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui-react/components/tabs';
import { useTranslations } from '@workspace/ui-react/contexts';

export function StocksView() {
    const { user } = useAuth();
    const { stocks, isLoading } = useStocks();
    const { portfolio, isLoading: portfolioLoading } = usePortfolio();
    const t = useTranslations();

    const portfolioValue = portfolio?.totalValue || 0;
    const portfolioGain = portfolio?.totalGainLoss || 0;
    const portfolioGainPercent = portfolioValue > 0 ? ((portfolioGain / (portfolioValue - portfolioGain)) * 100) : 0;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{t('features.stocks.messages.title')}</h2>
                <p className="text-muted-foreground">{t('features.stocks.messages.description')}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('features.stocks.labels.portfolioValue')}</h3>
                    {portfolioLoading ? (
                        <div className="h-10 w-32 bg-muted animate-pulse rounded" />
                    ) : (
                        <p className="text-4xl font-bold">{portfolioValue.toFixed(2)} €</p>
                    )}
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('features.stocks.labels.gainLoss')}</h3>
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
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('features.stocks.labels.sharesOwned')}</h3>
                    {portfolioLoading ? (
                        <div className="h-10 w-16 bg-muted animate-pulse rounded" />
                    ) : (
                        <p className="text-4xl font-bold">{portfolio?.portfolio?.length || 0}</p>
                    )}
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('features.stocks.labels.availableStocks')}</h3>
                    {isLoading ? (
                        <div className="h-10 w-16 bg-muted animate-pulse rounded" />
                    ) : (
                        <p className="text-4xl font-bold">{stocks?.length || 0}</p>
                    )}
                </div>
            </div>

            <Tabs defaultValue="market" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="market">{t('features.stocks.labels.market')}</TabsTrigger>
                    <TabsTrigger value="portfolio">{t('features.stocks.labels.myPortfolio')}</TabsTrigger>
                    <TabsTrigger value="orders">{t('features.stocks.labels.myOrders')}</TabsTrigger>
                </TabsList>

                <TabsContent value="market" className="space-y-4">
                    <div className="bg-card rounded-lg border shadow-sm">
                        <div className="p-6 border-b">
                            <h3 className="text-xl font-semibold">{t('features.stocks.messages.availableStocksLabel')}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                {t('features.stocks.messages.feesShort')}
                            </p>
                        </div>
                        <StockList stocks={stocks} isLoading={isLoading} mode="buy" />
                    </div>
                </TabsContent>

                <TabsContent value="portfolio" className="space-y-4">
                    <div className="bg-card rounded-lg border shadow-sm">
                        <div className="p-6 border-b">
                            <h3 className="text-xl font-semibold">{t('features.stocks.labels.myPortfolio')}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                {t('features.stocks.messages.sharesYouOwn')}
                            </p>
                        </div>
                        {portfolioLoading ? (
                            <div className="p-6 space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-20 bg-muted animate-pulse rounded" />
                                ))}
                            </div>
                        ) : portfolio?.portfolio && portfolio.portfolio.length > 0 ? (
                            <div className="divide-y">
                                {portfolio.portfolio.map((item: any) => {
                                    const gainLoss = item.gainLoss || 0;
                                    const totalValue = item.totalValue || 0;
                                    const investedValue = totalValue - gainLoss;
                                    const gainPercent = investedValue > 0 ? (gainLoss / investedValue) * 100 : 0;

                                    return (
                                        <div key={item.id} className="p-6 flex items-center justify-between hover:bg-muted/50 transition">
                                            <div className="flex-1">
                                                <h4 className="font-semibold">{item.stockSymbol}</h4>
                                                <p className="text-sm text-muted-foreground">ID: {item.stockId}</p>
                                            </div>
                                            <div className="text-right mr-8">
                                                <p className="font-semibold">{item.quantity} {t('features.stocks.labels.stocks')}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {t('features.stocks.labels.averagePrice')}: {item.averagePurchasePrice.toFixed(2)} €
                                                </p>
                                            </div>
                                            <div className="text-right mr-8">
                                                <p className="font-semibold">{totalValue.toFixed(2)} €</p>
                                                <p className={`text-sm ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {gainLoss >= 0 ? '+' : ''}{gainLoss.toFixed(2)} € ({gainLoss >= 0 ? '+' : ''}{gainPercent.toFixed(2)}%)
                                                </p>
                                            </div>
                                            <Button variant="outline" size="sm">{t('features.stocks.actions.sellStock')}</Button>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="p-12 text-center text-muted-foreground">
                                <p>{t('features.stocks.messages.noPortfolioShort')}</p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="orders" className="space-y-4">
                    <div className="bg-card rounded-lg border shadow-sm">
                        <div className="p-6 border-b">
                            <h3 className="text-xl font-semibold">{t('features.stocks.messages.orderHistory')}</h3>
                        </div>
                        <div className="p-12 text-center text-muted-foreground">
                            <p>{t('features.stocks.messages.noOrders')}</p>
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
