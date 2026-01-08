'use client';

import { useTranslations } from '@workspace/ui-react/contexts';
import { Button } from '@workspace/ui-react/components/button';
import Link from 'next/link';

export function LocalizedHomeView() {
    const t = useTranslations();

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-3xl mx-auto text-center space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-5xl font-bold tracking-tight">
                            Avenir Bank
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            {t('common.messages.info')}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg">
                            <Link href="/auth/login">
                                {t('features.auth.actions.login.label')}
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg">
                            <Link href="/auth/register">
                                {t('features.auth.actions.register.label')}
                            </Link>
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 pt-8">
                        <div className="p-6 border rounded-lg space-y-2">
                            <h3 className="font-semibold text-lg">
                                {t('common.labels.accounts')}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {t('common.messages.accountsDescription')}
                            </p>
                        </div>
                        <div className="p-6 border rounded-lg space-y-2">
                            <h3 className="font-semibold text-lg">
                                {t('common.labels.transactions')}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {t('common.messages.transactionsDescription')}
                            </p>
                        </div>
                        <div className="p-6 border rounded-lg space-y-2">
                            <h3 className="font-semibold text-lg">
                                {t('common.labels.investments')}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {t('common.messages.investmentsDescription')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
