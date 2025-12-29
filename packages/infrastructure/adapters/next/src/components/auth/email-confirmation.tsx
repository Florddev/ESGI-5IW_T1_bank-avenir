'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface EmailConfirmationProps {
  Button: React.ComponentType<any>;
}

export function EmailConfirmation({ Button }: EmailConfirmationProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) return;

    const confirmAccount = async () => {
      setStatus('loading');
      try {
        const response = await fetch('/api/auth/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message);
        } else {
          setStatus('error');
          setMessage(data.error || 'Erreur lors de la confirmation');
        }
      } catch {
        setStatus('error');
        setMessage('Erreur de connexion au serveur');
      }
    };

    confirmAccount();
  }, [token]);

  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => router.push('/auth/login'), 3000);
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
            </div>

            <h1 className="text-3xl font-bold tracking-tight">Compte confirmé !</h1>
            <p className="text-muted-foreground">{message}</p>
            <p className="text-sm text-muted-foreground">
              Redirection vers la page de connexion...
            </p>
          </div>

          <div className="text-center">
            <Link href="/auth/login">
              <Button className="w-full">Se connecter maintenant</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-destructive"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>

            <h1 className="text-3xl font-bold tracking-tight">Erreur</h1>
            <p className="text-destructive">{message}</p>
          </div>

          <div className="text-center space-y-4">
            <Link href="/auth/register">
              <Button variant="outline" className="w-full">
                Créer un nouveau compte
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost" className="w-full">
                Retour à la connexion
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Confirmation en cours...</h1>
            <p className="text-muted-foreground">Veuillez patienter</p>
          </div>
        </div>
      </div>
    );
  }

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
            <p>Vous n&apos;avez pas reçu l&apos;email ?</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Vérifiez votre dossier spam</li>
              <li>Assurez-vous que l&apos;adresse email est correcte</li>
              <li>L&apos;email peut prendre quelques minutes à arriver</li>
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
