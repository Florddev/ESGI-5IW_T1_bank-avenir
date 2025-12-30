'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/auth.context';
import { getAuthClient } from '@workspace/adapter-next/client';

export function useLogout() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setUser } = useAuth();
    const router = useRouter();

    const logout = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const authClient = getAuthClient();
            await authClient.logout();

            setUser(null);
            router.push('/auth/login');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    };

    return { logout, isLoading, error };
}
