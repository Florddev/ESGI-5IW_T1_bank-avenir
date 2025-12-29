import { Button } from '@workspace/ui-react/components/button';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Accueil',
    description:
        'Bienvenue sur Avenir Bank, votre partenaire bancaire de confiance. Découvrez nos services de banque en ligne : comptes, transactions, prêts et investissements.',
    openGraph: {
        title: 'Avenir Bank - Votre partenaire bancaire de confiance',
        description:
            'Découvrez nos services de banque en ligne : comptes, transactions, prêts et investissements.',
        url: 'https://avenir-bank.com',
    },
};

export default function Page() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-3xl mx-auto text-center space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-5xl font-bold tracking-tight">
                            Avenir Bank
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Votre partenaire bancaire de confiance
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/auth/register">
                            <Button size="lg" className="w-full sm:w-auto">
                                Ouvrir un compte
                            </Button>
                        </Link>
                        <Link href="/auth/login">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                Se connecter
                            </Button>
                        </Link>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3 mt-16">
                        <div className="bg-card p-6 rounded-lg border shadow-sm">
                            <h3 className="font-semibold text-lg mb-2">Sécurisé</h3>
                            <p className="text-sm text-muted-foreground">
                                Vos données sont protégées par les dernières technologies de sécurité
                            </p>
                        </div>

                        <div className="bg-card p-6 rounded-lg border shadow-sm">
                            <h3 className="font-semibold text-lg mb-2">Simple</h3>
                            <p className="text-sm text-muted-foreground">
                                Interface intuitive et facile à utiliser pour gérer vos finances
                            </p>
                        </div>

                        <div className="bg-card p-6 rounded-lg border shadow-sm">
                            <h3 className="font-semibold text-lg mb-2">Rapide</h3>
                            <p className="text-sm text-muted-foreground">
                                Transactions instantanées et service client réactif 24/7
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
