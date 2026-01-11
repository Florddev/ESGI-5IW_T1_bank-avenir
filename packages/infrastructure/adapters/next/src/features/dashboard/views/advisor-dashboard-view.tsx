'use client';

import type { UserDto } from '@workspace/application/dtos';
import Link from 'next/link';
import { Button } from '@workspace/ui-react/components/button';
import { useLocalizedPath } from '../../../hooks/useLocalizedPath';
import { useTranslations } from '@workspace/ui-react/contexts';

interface AdvisorDashboardViewProps {
    user: UserDto;
}

export function AdvisorDashboardView({ user }: AdvisorDashboardViewProps) {
    const localizedPath = useLocalizedPath();
    const t = useTranslations();
    
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2">
                    {t('features.dashboard.messages.welcomeClient')} {user.firstName}{t('features.dashboard.messages.exclamation')}
                </h2>
                <p className="text-muted-foreground">
                    {t('features.dashboard.messages.advisorTitle')}
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('features.dashboard.messages.myClients')}</h3>
                    <p className="text-3xl font-bold">0</p>
                    <Link href={localizedPath('/dashboard/clients')} className="text-xs text-primary hover:underline mt-2 inline-block">
                        {t('features.dashboard.messages.viewAllClients')}
                    </Link>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('features.dashboard.messages.activeLoans')}</h3>
                    <p className="text-3xl font-bold">0</p>
                    <Link href={localizedPath('/dashboard/loans')} className="text-xs text-primary hover:underline mt-2 inline-block">
                        {t('features.dashboard.messages.manageLoans')}
                    </Link>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('features.dashboard.messages.pendingMessages')}</h3>
                    <p className="text-3xl font-bold text-orange-500">0</p>
                    <Link href={localizedPath('/dashboard/messages')} className="text-xs text-primary hover:underline mt-2 inline-block">
                        {t('features.dashboard.messages.viewMessages')}
                    </Link>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('features.dashboard.messages.activeConversations')}</h3>
                    <p className="text-3xl font-bold">0</p>
                    <Link href={localizedPath('/dashboard/messages')} className="text-xs text-primary hover:underline mt-2 inline-block">
                        {t('features.dashboard.messages.viewConversations')}
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold">{t('features.dashboard.messages.quickActions')}</h3>
                    </div>
                    <div className="grid gap-3">
                        <Link href={localizedPath('/dashboard/loans')}>
                            <Button className="w-full justify-start" variant="outline">
                                <span className="mr-2">🏦</span>
                                {t('features.dashboard.messages.grantLoan')}
                            </Button>
                        </Link>
                        <Link href={localizedPath('/dashboard/messages')}>
                            <Button className="w-full justify-start" variant="outline">
                                <span className="mr-2">💬</span>
                                {t('features.dashboard.messages.replyToMessages')}
                            </Button>
                        </Link>
                        <Link href={localizedPath('/dashboard/clients')}>
                            <Button className="w-full justify-start" variant="outline">
                                <span className="mr-2">👥</span>
                                {t('features.dashboard.messages.viewMyClients')}
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold">{t('features.dashboard.messages.recentMessages')}</h3>
                        <Link href={localizedPath('/dashboard/messages')}>
                            <Button variant="ghost" size="sm">{t('features.dashboard.messages.viewAll')}</Button>
                        </Link>
                    </div>
                    <div className="text-center py-8 text-muted-foreground">
                        <p>{t('features.dashboard.messages.noMessagesYet')}</p>
                    </div>
                </div>
            </div>

            <div className="bg-card p-6 rounded-lg border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">{t('features.dashboard.messages.loansInProgress')}</h3>
                    <Link href={localizedPath('/dashboard/loans')}>
                        <Button variant="ghost" size="sm">{t('features.dashboard.messages.viewAll')}</Button>
                    </Link>
                </div>
                <div className="text-center py-8 text-muted-foreground">
                    <p>{t('features.dashboard.messages.noLoansYet')}</p>
                </div>
            </div>
        </div>
    );
}
