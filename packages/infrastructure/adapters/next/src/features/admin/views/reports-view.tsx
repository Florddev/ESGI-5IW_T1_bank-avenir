'use client';

import { Button } from '@workspace/ui-react/components/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui-react/components/tabs';
import { useTranslations } from '@workspace/ui-react/contexts';

export function ReportsView() {
    const t = useTranslations();
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{t('features.admin.messages.reportsAndStatistics')}</h2>
                <p className="text-muted-foreground">{t('features.admin.messages.reportsDescription')}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('features.admin.messages.totalClients')}</h3>
                    <p className="text-4xl font-bold">0</p>
                    <p className="text-xs text-green-600 mt-1">+0 {t('features.admin.messages.thisMonth')}</p>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('features.admin.messages.activeAccounts')}</h3>
                    <p className="text-4xl font-bold">0</p>
                    <p className="text-xs text-muted-foreground mt-1">{t('features.admin.messages.allTypes')}</p>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('features.admin.messages.totalVolume')}</h3>
                    <p className="text-4xl font-bold">0 €</p>
                    <p className="text-xs text-muted-foreground mt-1">{t('features.admin.messages.cumulativeDeposits')}</p>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('features.admin.messages.transactionsPerDay')}</h3>
                    <p className="text-4xl font-bold">0</p>
                    <p className="text-xs text-muted-foreground mt-1">{t('features.admin.messages.average30Days')}</p>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">{t('features.admin.messages.overview')}</TabsTrigger>
                    <TabsTrigger value="accounts">{t('features.admin.messages.accounts')}</TabsTrigger>
                    <TabsTrigger value="transactions">{t('features.admin.messages.transactions')}</TabsTrigger>
                    <TabsTrigger value="loans">{t('features.admin.messages.loans')}</TabsTrigger>
                    <TabsTrigger value="stocks">{t('features.admin.messages.stocks')}</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="bg-card p-6 rounded-lg border shadow-sm">
                        <h3 className="text-xl font-semibold mb-4">{t('features.admin.messages.generalActivity')}</h3>
                        <div className="h-64 flex items-center justify-center text-muted-foreground">
                            <p>{t('features.admin.messages.chartComing')}</p>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="bg-card p-6 rounded-lg border shadow-sm">
                            <h3 className="font-semibold mb-4">{t('features.admin.messages.accountDistribution')}</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">{t('features.admin.messages.checkingAccounts')}</span>
                                    <span className="font-semibold">0</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">{t('features.admin.messages.savingsAccounts')}</span>
                                    <span className="font-semibold">0</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card p-6 rounded-lg border shadow-sm">
                            <h3 className="font-semibold mb-4">{t('features.admin.messages.userDistribution')}</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">{t('features.admin.messages.clients')}</span>
                                    <span className="font-semibold">0</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">{t('features.admin.messages.advisors')}</span>
                                    <span className="font-semibold">0</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">{t('features.admin.messages.directors')}</span>
                                    <span className="font-semibold">0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="accounts" className="space-y-4">
                    <div className="bg-card p-6 rounded-lg border shadow-sm">
                        <h3 className="text-xl font-semibold mb-4">{t('features.admin.messages.accountStatistics')}</h3>
                        <div className="p-12 text-center text-muted-foreground">
                            <p>{t('features.admin.messages.detailedReportComing')}</p>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="transactions" className="space-y-4">
                    <div className="bg-card p-6 rounded-lg border shadow-sm">
                        <h3 className="text-xl font-semibold mb-4">{t('features.admin.messages.transactionStatistics')}</h3>
                        <div className="p-12 text-center text-muted-foreground">
                            <p>{t('features.admin.messages.detailedReportComing')}</p>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="loans" className="space-y-4">
                    <div className="bg-card p-6 rounded-lg border shadow-sm">
                        <h3 className="text-xl font-semibold mb-4">{t('features.admin.messages.loanStatistics')}</h3>
                        <div className="p-12 text-center text-muted-foreground">
                            <p>{t('features.admin.messages.detailedReportComing')}</p>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="stocks" className="space-y-4">
                    <div className="bg-card p-6 rounded-lg border shadow-sm">
                        <h3 className="text-xl font-semibold mb-4">{t('features.admin.messages.marketStatistics')}</h3>
                        <div className="p-12 text-center text-muted-foreground">
                            <p>{t('features.admin.messages.detailedReportComing')}</p>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            <div className="flex gap-2">
                <Button>{t('features.admin.messages.exportPDF')}</Button>
                <Button variant="outline">{t('features.admin.messages.exportExcel')}</Button>
            </div>
        </div>
    );
}
