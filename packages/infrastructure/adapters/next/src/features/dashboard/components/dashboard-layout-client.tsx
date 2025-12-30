'use client';

import { useAuth, useLogout } from '@workspace/adapter-next/features/auth';
import { Button } from '@workspace/ui-react/components/button';
import { DashboardShell, DashboardHeader, DashboardNav, DashboardUserInfo, DashboardLoading } from '@workspace/ui-react';
import type { NavItem } from '@workspace/ui-react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { UserRole } from '@workspace/domain/entities';

interface DashboardLayoutClientProps {
    children: ReactNode;
}

const CLIENT_NAV: NavItem[] = [
    { href: '/dashboard', label: 'Vue d\'ensemble', icon: '🏠' },
    { href: '/dashboard/accounts', label: 'Mes comptes', icon: '💳' },
    { href: '/dashboard/transactions', label: 'Transactions', icon: '💸' },
    { href: '/dashboard/savings', label: 'Épargne', icon: '💰' },
    { href: '/dashboard/stocks', label: 'Actions', icon: '📈' },
    { href: '/dashboard/messages', label: 'Messages', icon: '💬' },
];

const ADVISOR_NAV: NavItem[] = [
    { href: '/dashboard', label: 'Vue d\'ensemble', icon: '🏠' },
    { href: '/dashboard/clients', label: 'Mes clients', icon: '👥' },
    { href: '/dashboard/loans', label: 'Crédits', icon: '🏦' },
    { href: '/dashboard/messages', label: 'Messagerie', icon: '💬' },
];

const DIRECTOR_NAV: NavItem[] = [
    { href: '/dashboard', label: 'Vue d\'ensemble', icon: '🏠' },
    { href: '/dashboard/users', label: 'Utilisateurs', icon: '👥' },
    { href: '/dashboard/savings-rate', label: 'Taux d\'épargne', icon: '📊' },
    { href: '/dashboard/stocks-management', label: 'Gestion actions', icon: '📈' },
    { href: '/dashboard/reports', label: 'Rapports', icon: '📄' },
];

const getRoleName = (role: UserRole): string => {
    switch (role) {
        case UserRole.CLIENT: return 'Client';
        case UserRole.ADVISOR: return 'Conseiller';
        case UserRole.DIRECTOR: return 'Directeur';
        default: return role;
    }
};

const getNavigationByRole = (role: UserRole): NavItem[] => {
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

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return <DashboardLoading />;
    }

    if (!user) {
        return null;
    }

    const navigation = getNavigationByRole(user.role);

    const header = (
        <DashboardHeader
            title="Avenir Bank"
            badge={getRoleName(user.role)}
            userInfo={
                <DashboardUserInfo
                    firstName={user.firstName}
                    lastName={user.lastName}
                    email={user.email}
                />
            }
            actions={
                <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    disabled={isLoggingOut}
                    aria-label="Se déconnecter"
                >
                    {isLoggingOut ? '...' : 'Déconnexion'}
                </Button>
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
