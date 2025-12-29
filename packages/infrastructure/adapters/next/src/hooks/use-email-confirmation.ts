import { useState, useEffect, useCallback } from 'react';

interface UseEmailConfirmationResult {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}

export function useEmailConfirmation(token: string | null): UseEmailConfirmationResult {
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

  return { status, message };
}
