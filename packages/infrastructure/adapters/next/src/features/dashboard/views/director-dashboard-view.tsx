'use client';

import type { UserDto } from '@workspace/application/dtos';
import Link from 'next/link';
import { Button } from '@workspace/ui-react/components/button';
import { useLocalizedPath } from '../../../hooks/useLocalizedPath';
import { useTranslations } from '@workspace/ui-react/contexts';

interface DirectorDashboardViewProps {
    user: UserDto;
}

export function DirectorDashboardView({ user }: DirectorDashboardViewProps) {
    const localizedPath = useLocalizedPath();
    const t = useTranslations();
    
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2">
                    {t('features.dashboard.messages.welcomeClient')} {user.firstName}{t('features.dashboard.messages.exclamation')}
                </h2>
                <p className="text-muted-foreground">
                    {t('features.dashboard.messages.directorTitle')}
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('features.dashboard.messages.users')}</h3>
                    <p className="text-3xl font-bold">0</p>
                    <Link href={localizedPath('/dashboard/users')} className="text-xs text-primary hover:underline mt-2 inline-block">
                        {t('features.dashboard.messages.manageUsers')}
                    </Link>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('features.dashboard.messages.currentSavingsRate')}</h3>
                    <p className="text-3xl font-bold">2.5%</p>
                    <Link href={localizedPath('/dashboard/savings-rate')} className="text-xs text-primary hover:underline mt-2 inline-block">
                        {t('features.dashboard.messages.modifyRate')}
                    </Link>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('features.dashboard.messages.availableStocks')}</h3>
                    <p className="text-3xl font-bold">0</p>
                    <Link href={localizedPath('/dashboard/stocks-management')} className="text-xs text-primary hover:underline mt-2 inline-block">
                        {t('features.dashboard.messages.manageStocks')}
                    </Link>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('features.dashboard.messages.totalVolume')}</h3>
                    <p className="text-3xl font-bold">0 €</p>
                    <Link href={localizedPath('/dashboard/reports')} className="text-xs text-primary hover:underline mt-2 inline-block">
                        {t('features.dashboard.messages.viewReports')}
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold">{t('features.dashboard.messages.quickActions')}</h3>
                    </div>
                    <div className="grid gap-3">
                        <Link href={localizedPath('/dashboard/users')}>
                            <Button className="w-full justify-start" variant="outline">
                                <span className="mr-2">👥</span>
                                {t('features.dashboard.messages.createUser')}
                            </Button>
                        </Link>
                        <Link href={localizedPath('/dashboard/savings-rate')}>
                            <Button className="w-full justify-start" variant="outline">
                                <span className="mr-2">📊</span>
                                {t('features.dashboard.messages.modifySavingsRate')}
                            </Button>
                        </Link>
                        <Link href={localizedPath('/dashboard/stocks-management')}>
                            <Button className="w-full justify-start" variant="outline">
                                <span className="mr-2">📈</span>
                                {t('features.dashboard.messages.addStock')}
                            </Button>
                        </Link>
                        <Link href={localizedPath('/dashboard/reports')}>
                            <Button className="w-full justify-start" variant="outline">
                                <span className="mr-2">📄</span>
                                {t('features.dashboard.messages.viewReportsAction')}
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold">{t('features.dashboard.messages.statisticsTitle')}</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">{t('features.dashboard.messages.activeClients')}</span>
                            <span className="font-semibold">0</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">{t('features.dashboard.messages.advisors')}</span>
                            <span className="font-semibold">0</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">{t('features.dashboard.messages.savingsAccounts')}</span>
                            <span className="font-semibold">0</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">{t('features.dashboard.messages.loansInProgress')}</span>
                            <span className="font-semibold">0</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-card p-6 rounded-lg border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">{t('features.dashboard.messages.recentlyAddedStocks')}</h3>
                    <Link href={localizedPath('/dashboard/stocks-management')}>
                        <Button variant="ghost" size="sm">{t('features.dashboard.messages.manageStocksAction')}</Button>
                    </Link>
                </div>
                <div className="text-center py-8 text-muted-foreground">
                    <p>{t('features.dashboard.messages.noStocksYet')}</p>
                </div>
            </div>
        </div>
    );
}
