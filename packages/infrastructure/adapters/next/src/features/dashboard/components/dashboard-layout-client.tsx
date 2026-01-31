'use client';

import { useAuth, useLogout } from '@workspace/adapter-next/features/auth';
import { NotificationBadge } from '@workspace/adapter-next/features/notifications';
import { Button } from '@workspace/ui-react/components/button';
import { DashboardShell, DashboardHeader, DashboardNav, DashboardUserInfo, DashboardLoading } from '@workspace/ui-react';
import type { NavItem } from '@workspace/ui-react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { UserRole } from '@workspace/domain/entities';
import { useLocalizedPath } from '../../../hooks/useLocalizedPath';
import { useTranslations } from '@workspace/ui-react/contexts';

interface DashboardLayoutClientProps {
    children: ReactNode;
}

const getRoleName = (role: UserRole, t: (key: string) => string): string => {
    switch (role) {
        case UserRole.CLIENT: return t('common.labels.client');
        case UserRole.ADVISOR: return t('common.labels.advisor');
        case UserRole.DIRECTOR: return t('common.labels.director');
        default: return role;
    }
};

const getNavigationByRole = (role: UserRole, localizedPath: (path: string) => string): NavItem[] => {
    const CLIENT_NAV: NavItem[] = [
        { href: localizedPath('/dashboard'), label: 'Vue d\'ensemble', icon: '🏠' },
        { href: localizedPath('/dashboard/accounts'), label: 'Mes comptes', icon: '💳' },
        { href: localizedPath('/dashboard/transactions'), label: 'Transactions', icon: '💸' },
        { href: localizedPath('/dashboard/savings'), label: 'Épargne', icon: '💰' },
        { href: localizedPath('/dashboard/stocks'), label: 'Actions', icon: '📈' },
        { href: localizedPath('/dashboard/news'), label: 'Actualités', icon: '📰' },
        { href: localizedPath('/dashboard/messages'), label: 'Messages', icon: '💬' },
    ];

    const ADVISOR_NAV: NavItem[] = [
        { href: localizedPath('/dashboard'), label: 'Vue d\'ensemble', icon: '🏠' },
        { href: localizedPath('/dashboard/clients'), label: 'Mes clients', icon: '👥' },
        { href: localizedPath('/dashboard/news'), label: 'Actualités', icon: '📰' },
        { href: localizedPath('/dashboard/messages'), label: 'Messagerie', icon: '💬' },
    ];

    const DIRECTOR_NAV: NavItem[] = [
        { href: localizedPath('/dashboard'), label: 'Vue d\'ensemble', icon: '🏠' },
        { href: localizedPath('/dashboard/users'), label: 'Utilisateurs', icon: '👥' },
        { href: localizedPath('/dashboard/savings-rate'), label: 'Taux d\'épargne', icon: '📊' },
        { href: localizedPath('/dashboard/stocks-management'), label: 'Gestion actions', icon: '📈' },
    ];
    
    switch (role) {
        case UserRole.CLIENT: return CLIENT_NAV;
        case UserRole.ADVISOR: return ADVISOR_NAV;
        case UserRole.DIRECTOR: return DIRECTOR_NAV;
        default: return [];
    }
};

export function DashboardLayoutClient({ children }: DashboardLayoutClientProps) {
    const { user, isLoading, isAuthenticated } = useAuth();
    const { logout, isLoading: isLoggingOut } = useLogout();
    const router = useRouter();
    const pathname = usePathname();
    const localizedPath = useLocalizedPath();
    const t = useTranslations();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push(localizedPath('/auth/login'));
        }
    }, [isLoading, isAuthenticated, router, localizedPath]);

    if (isLoading) {
        return <DashboardLoading />;
    }

    if (!user) {
        return null;
    }

    const navigation = getNavigationByRole(user.role, localizedPath, t);

    const header = (
        <DashboardHeader
            title="Avenir Bank"
            badge={getRoleName(user.role, t)}
            userInfo={
                <DashboardUserInfo
                    firstName={user.firstName}
                    lastName={user.lastName}
                    email={user.email}
                />
            }
            actions={
                <>
                    <NotificationBadge 
                        userId={user.id}
                        onClick={() => router.push(localizedPath('/dashboard/notifications'))}
                    />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={logout}
                        disabled={isLoggingOut}
                        aria-label={t('common.labels.logout')}
                    >
                        {isLoggingOut ? t('common.labels.loggingOut') : t('common.labels.logout')}
                    </Button>
                </>
            }
        />
    );

    const sidebar = (
        <DashboardNav items={navigation} currentPath={pathname} />
    );

    return (
        <DashboardShell header={header} sidebar={sidebar}>
            {children}
        </DashboardShell>
    );
}
