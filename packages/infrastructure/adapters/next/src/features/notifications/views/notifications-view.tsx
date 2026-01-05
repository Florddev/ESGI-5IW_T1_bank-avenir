'use client';

import { useAuth } from '../../auth';
import { NotificationList } from '../components';

export function NotificationsView() {
    const { user } = useAuth();

    if (!user) {
        return null;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                <p className="text-muted-foreground">
                    Consultez vos notifications en temps réel
                </p>
            </div>
            <NotificationList userId={user.id} maxHeight="calc(100vh - 200px)" />
        </div>
    );
}
