'use client';

import { Button } from '@workspace/ui-react/components/button';

export function ClientsView() {
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
                    <p className="text-4xl font-bold">0</p>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Nouveaux ce mois</h3>
                    <p className="text-4xl font-bold">0</p>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Conversations actives</h3>
                    <p className="text-4xl font-bold">0</p>
                </div>
            </div>

            <div className="bg-card rounded-lg border shadow-sm">
                <div className="p-6 border-b">
                    <h3 className="text-xl font-semibold">Liste des clients</h3>
                </div>
                <div className="p-12 text-center text-muted-foreground">
                    <p>Aucun client assigné pour le moment</p>
                </div>
            </div>
        </div>
    );
}
