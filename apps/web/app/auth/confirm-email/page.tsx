import Link from 'next/link';
import { Button } from '@workspace/ui-react/components/button';

export default function ConfirmEmailPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-primary"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight">Vérifiez votre email</h1>
                    <p className="text-muted-foreground">
                        Nous vous avons envoyé un email de confirmation.
                        <br />
                        Cliquez sur le lien dans l'email pour activer votre compte.
                    </p>
                </div>

                <div className="bg-card p-6 rounded-lg border space-y-4">
                    <div className="text-sm text-muted-foreground space-y-2">
                        <p>Vous n'avez pas reçu l'email ?</p>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                            <li>Vérifiez votre dossier spam</li>
                            <li>Assurez-vous que l'adresse email est correcte</li>
                            <li>L'email peut prendre quelques minutes à arriver</li>
                        </ul>
                    </div>
                </div>

                <div className="text-center">
                    <Link href="/auth/login">
                        <Button variant="outline" className="w-full">
                            Retour à la connexion
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
