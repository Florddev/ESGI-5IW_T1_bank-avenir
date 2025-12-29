'use client';

import { useAuth, useLogout } from '@workspace/adapter-next/features/auth';
import { Button } from '@workspace/ui-react/components/button';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { UserRole } from '@workspace/domain/entities';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Chargement...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const clientNav = [
        { href: '/dashboard', label: 'Vue d\'ensemble', icon: '🏠' },
        { href: '/dashboard/accounts', label: 'Mes comptes', icon: '💳' },
        { href: '/dashboard/transactions', label: 'Transactions', icon: '💸' },
        { href: '/dashboard/savings', label: 'Épargne', icon: '💰' },
        { href: '/dashboard/stocks', label: 'Actions', icon: '📈' },
        { href: '/dashboard/messages', label: 'Messages', icon: '💬' },
    ];

    const advisorNav = [
        { href: '/dashboard', label: 'Vue d\'ensemble', icon: '🏠' },
        { href: '/dashboard/clients', label: 'Mes clients', icon: '👥' },
        { href: '/dashboard/loans', label: 'Crédits', icon: '🏦' },
        { href: '/dashboard/messages', label: 'Messagerie', icon: '💬' },
    ];

    const directorNav = [
        { href: '/dashboard', label: 'Vue d\'ensemble', icon: '🏠' },
        { href: '/dashboard/users', label: 'Utilisateurs', icon: '👥' },
        { href: '/dashboard/savings-rate', label: 'Taux d\'épargne', icon: '📊' },
        { href: '/dashboard/stocks-management', label: 'Gestion actions', icon: '📈' },
        { href: '/dashboard/reports', label: 'Rapports', icon: '📄' },
    ];

    const navigation = 
        user.role === UserRole.CLIENT ? clientNav :
        user.role === UserRole.ADVISOR ? advisorNav :
        user.role === UserRole.DIRECTOR ? directorNav :
        [];

    const getRoleName = (role: UserRole) => {
        switch (role) {
            case UserRole.CLIENT: return 'Client';
            case UserRole.ADVISOR: return 'Conseiller';
            case UserRole.DIRECTOR: return 'Directeur';
            default: return role;
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-primary">Avenir Bank</h1>
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                            {getRoleName(user.role)}
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-right">
                            <p className="font-medium">{user.firstName} {user.lastName}</p>
                            <p className="text-muted-foreground text-xs">{user.email}</p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={logout}
                            disabled={isLoggingOut}
                        >
                            {isLoggingOut ? '...' : 'Déconnexion'}
                        </Button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-6 flex gap-6">
                <aside className="w-64 flex-shrink-0">
                    <nav className="space-y-1 sticky top-24">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href || 
                                (item.href !== '/dashboard' && pathname.startsWith(item.href));
                            
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                                        ${isActive 
                                            ? 'bg-primary text-primary-foreground font-medium' 
                                            : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                                        }
                                    `}
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                <main className="flex-1 min-w-0">
                    {children}
                </main>
            </div>
        </div>
    );
}
