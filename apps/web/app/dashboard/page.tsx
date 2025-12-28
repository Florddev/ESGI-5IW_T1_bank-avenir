'use client';

import { useAuth, useLogout } from '@workspace/adapter-next/features/auth';
import { Button } from '@workspace/ui-react/components/button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const { logout, isLoading: isLoggingOut } = useLogout();
    const router = useRouter();

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

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Avenir Bank</h1>
                    <div className="flex items-center gap-4">
                        <div className="text-sm">
                            <p className="font-medium">{user.firstName} {user.lastName}</p>
                            <p className="text-muted-foreground">{user.email}</p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={logout}
                            disabled={isLoggingOut}
                        >
                            {isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight mb-2">
                            Bienvenue, {user.firstName} !
                        </h2>
                        <p className="text-muted-foreground">
                            Voici votre tableau de bord Avenir Bank
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="bg-card p-6 rounded-lg border shadow-sm">
                            <h3 className="font-semibold mb-2">Compte Principal</h3>
                            <p className="text-3xl font-bold">0,00 €</p>
                            <p className="text-xs text-muted-foreground mt-2">Solde disponible</p>
                        </div>

                        <div className="bg-card p-6 rounded-lg border shadow-sm">
                            <h3 className="font-semibold mb-2">Épargne</h3>
                            <p className="text-3xl font-bold">0,00 €</p>
                            <p className="text-xs text-muted-foreground mt-2">Solde disponible</p>
                        </div>

                        <div className="bg-card p-6 rounded-lg border shadow-sm">
                            <h3 className="font-semibold mb-2">Rôle</h3>
                            <p className="text-2xl font-bold capitalize">{user.role.toLowerCase()}</p>
                            <p className="text-xs text-muted-foreground mt-2">Type de compte</p>
                        </div>
                    </div>

                    <div className="bg-card p-6 rounded-lg border shadow-sm">
                        <h3 className="text-xl font-semibold mb-4">Dernières transactions</h3>
                        <div className="text-center py-8 text-muted-foreground">
                            <p>Aucune transaction pour le moment</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
