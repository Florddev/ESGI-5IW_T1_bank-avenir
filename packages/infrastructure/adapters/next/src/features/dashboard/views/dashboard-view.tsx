'use client';

import { useAuth } from '@workspace/adapter-next/features/auth';
import { UserRole } from '@workspace/domain/entities';
import { ClientDashboardView } from './client-dashboard-view';
import { AdvisorDashboardView } from './advisor-dashboard-view';
import { DirectorDashboardView } from './director-dashboard-view';
import { useTranslations } from '@workspace/ui-react/contexts';

export function DashboardView() {
    const { user } = useAuth();
    const t = useTranslations();

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
                    <p className="text-muted-foreground">{t('features.dashboard.messages.unrecognizedRole')} {user.role}</p>
                </div>
            );
    }
}
