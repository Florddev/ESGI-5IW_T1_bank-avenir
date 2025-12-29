'use client';

import { useEffect } from 'react';

export default function GlobalError({
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
        <html>
            <body>
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>
                    <div style={{
                        maxWidth: '28rem',
                        width: '100%',
                        textAlign: 'center'
                    }}>
                        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                            Erreur Critique
                        </h1>
                        <p style={{ color: '#666', marginBottom: '2rem' }}>
                            Une erreur critique s'est produite. Veuillez recharger la page.
                        </p>
                        {error.digest && (
                            <p style={{ fontSize: '0.875rem', color: '#999', fontFamily: 'monospace' }}>
                                Code: {error.digest}
                            </p>
                        )}
                        <button
                            onClick={() => reset()}
                            style={{
                                padding: '0.5rem 2rem',
                                fontSize: '1rem',
                                fontWeight: '500',
                                backgroundColor: '#000',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '0.375rem',
                                cursor: 'pointer',
                                marginTop: '1rem'
                            }}
                        >
                            Réessayer
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
