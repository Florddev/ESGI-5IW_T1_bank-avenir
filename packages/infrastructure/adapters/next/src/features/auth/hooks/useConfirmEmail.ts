'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthClient } from '@workspace/adapter-next/client';

type ConfirmStatus = 'idle' | 'loading' | 'success' | 'error';

export function useConfirmEmail(token: string | null) {
    const [status, setStatus] = useState<ConfirmStatus>('idle');
    const [message, setMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (!token) return;

        const confirmAccount = async () => {
            setStatus('loading');
            try {
                const authClient = getAuthClient();
                const result = await authClient.confirmAccount({ token });
                
                setStatus('success');
                setMessage(result.message);
            } catch (err) {
                setStatus('error');
                setMessage(err instanceof Error ? err.message : 'Erreur lors de la confirmation');
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

    return { status, message };
}
