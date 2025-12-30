'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/auth.context';
import { getAuthClient } from '@workspace/adapter-next/client';
import type { LoginDto } from '@workspace/application/dtos';

export function useLogin() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setUser } = useAuth();
    const router = useRouter();

    const login = async (data: LoginDto) => {
        setIsLoading(true);
        setError(null);

        try {
            const authClient = getAuthClient();
            const result = await authClient.login(data);

            setUser({
                id: result.userId,
                email: result.email,
                firstName: result.firstName,
                lastName: result.lastName,
                role: result.role,
            });

            router.push('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    };

    return { login, isLoading, error };
}
