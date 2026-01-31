'use client';

import { useState } from 'react';
import { Card, CardContent } from '@workspace/ui-react/components/card';
import { Button } from '@workspace/ui-react/components/button';
import { useAdvisorClients, useSendAdvisorNotification } from '@workspace/adapter-next/features/advisor';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Bell, MessageSquare, User } from 'lucide-react';
import { useTranslations } from '@workspace/ui-react/contexts';
import { SendNotificationForm } from '../components/send-notification-form';
import type { SendAdvisorNotificationFormData } from '@workspace/adapter-common/validators';

export function ClientsView() {
    const { clients, isLoading } = useAdvisorClients();
    const { sendNotification, isLoading: isSending, error: sendError, success, reset } = useSendAdvisorNotification();
    const [showNotificationForm, setShowNotificationForm] = useState(false);
    const t = useTranslations();

    const totalClients = clients.length;
    const totalActiveConversations = clients.reduce((sum, c) => sum + c.activeConversationsCount, 0);

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const newClientsThisMonth = clients.filter(c => new Date(c.createdAt) >= oneMonthAgo).length;

    const handleSendNotification = async (data: SendAdvisorNotificationFormData) => {
        const result = await sendNotification(data);
        if (result) {
            setTimeout(() => {
                setShowNotificationForm(false);
                reset();
            }, 2000);
        }
    };

    const handleCancel = () => {
        setShowNotificationForm(false);
        reset();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t('features.admin.messages.myClients')}</h2>
                    <p className="text-muted-foreground">{t('features.admin.messages.myClientsDescription')}</p>
                </div>
                {clients.length > 0 && (
                    <Button
                        onClick={() => {
                            setShowNotificationForm(!showNotificationForm);
                            reset();
                        }}
                        variant={showNotificationForm ? 'outline' : 'default'}
                    >
                        <Bell className="h-4 w-4 mr-2" />
                        {t('features.advisor.messages.notifyClients')}
                    </Button>
                )}
            </div>

            {showNotificationForm && (
                <div className="space-y-2">
                    <SendNotificationForm
                        onSubmit={handleSendNotification}
                        onCancel={handleCancel}
                        isLoading={isSending}
                    />
                    {sendError && (
                        <p className="text-sm text-destructive">{sendError}</p>
                    )}
                    {success && (
                        <p className="text-sm text-green-600">{t('features.advisor.messages.notificationSent')}</p>
                    )}
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('features.admin.messages.totalClients')}</h3>
                    <p className="text-4xl font-bold">{isLoading ? '...' : totalClients}</p>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('features.admin.messages.newThisMonth')}</h3>
                    <p className="text-4xl font-bold">{isLoading ? '...' : newClientsThisMonth}</p>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('features.admin.messages.activeConversations')}</h3>
                    <p className="text-4xl font-bold">{isLoading ? '...' : totalActiveConversations}</p>
                </div>
            </div>

            <div className="bg-card rounded-lg border shadow-sm">
                <div className="p-6 border-b">
                    <h3 className="text-xl font-semibold">{t('features.admin.messages.clientList')}</h3>
                </div>
                {isLoading ? (
                    <div className="p-12 text-center text-muted-foreground">
                        <p>{t('features.admin.messages.loading')}</p>
                    </div>
                ) : clients.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground">
                        <p>{t('features.admin.messages.noClientsAssigned')}</p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {clients.map((client) => (
                            <Card key={client.id} className="border-0 rounded-none shadow-none">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                <User className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-lg">
                                                    {client.firstName} {client.lastName}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">{client.email}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {t('features.admin.messages.clientSince')} {formatDistanceToNow(new Date(client.createdAt), {
                                                        addSuffix: true,
                                                        locale: fr
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MessageSquare className="h-4 w-4" />
                                            <span>{client.activeConversationsCount} conversation{client.activeConversationsCount > 1 ? 's' : ''}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
