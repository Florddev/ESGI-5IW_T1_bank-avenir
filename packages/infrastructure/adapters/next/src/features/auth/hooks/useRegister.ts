'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/auth.context';
import { getAuthClient } from '@workspace/adapter-next/client';
import type { RegisterUserDto } from '@workspace/application/dtos';

export function useRegister() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setUser } = useAuth();
    const router = useRouter();

    const register = async (data: RegisterUserDto) => {
        setIsLoading(true);
        setError(null);

        try {
            const authClient = getAuthClient();
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
