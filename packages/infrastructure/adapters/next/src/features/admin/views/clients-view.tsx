'use client';

import { Card, CardContent } from '@workspace/ui-react/components/card';
import { useAdvisorClients } from '@workspace/adapter-next/features/advisor';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MessageSquare, User } from 'lucide-react';

export function ClientsView() {
    const { clients, isLoading } = useAdvisorClients();

    const totalClients = clients.length;
    const totalActiveConversations = clients.reduce((sum, c) => sum + c.activeConversationsCount, 0);

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const newClientsThisMonth = clients.filter(c => new Date(c.createdAt) >= oneMonthAgo).length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Mes clients</h2>
                    <p className="text-muted-foreground">Liste des clients que vous accompagnez</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Total clients</h3>
                    <p className="text-4xl font-bold">{isLoading ? '...' : totalClients}</p>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Nouveaux ce mois</h3>
                    <p className="text-4xl font-bold">{isLoading ? '...' : newClientsThisMonth}</p>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Conversations actives</h3>
                    <p className="text-4xl font-bold">{isLoading ? '...' : totalActiveConversations}</p>
                </div>
            </div>

            <div className="bg-card rounded-lg border shadow-sm">
                <div className="p-6 border-b">
                    <h3 className="text-xl font-semibold">Liste des clients</h3>
                </div>
                {isLoading ? (
                    <div className="p-12 text-center text-muted-foreground">
                        <p>Chargement...</p>
                    </div>
                ) : clients.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground">
                        <p>Aucun client assigné pour le moment</p>
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
                                                    Client depuis {formatDistanceToNow(new Date(client.createdAt), {
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
