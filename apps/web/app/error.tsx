'use client';

import { useEffect } from 'react';
import { Button } from '@workspace/ui-react/components/button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 text-destructive">
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
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Une erreur est survenue</h1>
                    <p className="text-muted-foreground">
                        Nous nous excusons pour ce désagrément. Une erreur inattendue s'est produite.
                    </p>
                    {error.digest && (
                        <p className="text-sm text-muted-foreground font-mono">
                            Code d'erreur: {error.digest}
                        </p>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button size="lg" onClick={() => reset()}>
                        Réessayer
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => (window.location.href = '/')}>
                        Retour à l'accueil
                    </Button>
                </div>
            </div>
        </div>
    );
}
