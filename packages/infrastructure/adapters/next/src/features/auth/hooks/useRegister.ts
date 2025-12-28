'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/auth.context';
import { AuthClient, type RegisterInput } from '../../../client/auth.client';

export function useRegister() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setUser } = useAuth();
    const router = useRouter();

    const register = async (data: RegisterInput) => {
        setIsLoading(true);
        setError(null);

        try {
            const authClient = new AuthClient();
            await authClient.register(data);

            router.push('/auth/confirm-email');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    };

    return { register, isLoading, error };
}
