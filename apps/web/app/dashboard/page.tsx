'use client';

import { useAuth } from '@workspace/adapter-next/features/auth';
import { UserRole } from '@workspace/domain/entities';
import ClientDashboard from './client-dashboard';
import AdvisorDashboard from './advisor-dashboard';
import DirectorDashboard from './director-dashboard';

export default function DashboardPage() {
    const { user } = useAuth();

    if (!user) {
        return null;
    }

    switch (user.role) {
        case UserRole.CLIENT:
            return <ClientDashboard user={user} />;
        case UserRole.ADVISOR:
            return <AdvisorDashboard user={user} />;
        case UserRole.DIRECTOR:
            return <DirectorDashboard user={user} />;
        default:
            return (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Rôle non reconnu</p>
                </div>
            );
    }
}
