import Link from 'next/link';
import { Button } from '@workspace/ui-react/components/button';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary">
                        <svg
                            className="w-10 h-10"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-6xl font-bold tracking-tight">404</h1>
                    <h2 className="text-2xl font-semibold">Page non trouvée</h2>
                    <p className="text-muted-foreground">
                        Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/">
                        <Button size="lg">Retour à l'accueil</Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button size="lg" variant="outline">
                            Tableau de bord
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
