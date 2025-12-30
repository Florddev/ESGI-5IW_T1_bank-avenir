'use client';

import Link from 'next/link';
import { RegisterForm } from '../components/register-form';

export function RegisterView() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight">Créer un compte</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Rejoignez Avenir Bank aujourd&apos;hui
                    </p>
                </div>

                <div className="bg-card p-8 rounded-lg border shadow-sm">
                    <RegisterForm />
                </div>

                <div className="text-center text-sm">
                    <span className="text-muted-foreground">Vous avez déjà un compte ? </span>
                    <Link href="/auth/login" className="text-primary hover:underline font-medium">
                        Se connecter
                    </Link>
                </div>
            </div>
        </div>
    );
}
