'use client';

import { useAuth } from '@workspace/adapter-next/features/auth';
import { UserRole } from '@workspace/domain/entities';
import { ClientDashboardView } from './client-dashboard-view';
import { AdvisorDashboardView } from './advisor-dashboard-view';
import { DirectorDashboardView } from './director-dashboard-view';

export function DashboardView() {
    const { user } = useAuth();

    if (!user) {
        return null;
    }

    switch (user.role) {
        case UserRole.CLIENT:
            return <ClientDashboardView user={user} />;
        case UserRole.ADVISOR:
            return <AdvisorDashboardView user={user} />;
        case UserRole.DIRECTOR:
            return <DirectorDashboardView user={user} />;
        default:
            return (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Rôle non reconnu: {user.role}</p>
                </div>
            );
    }
}
