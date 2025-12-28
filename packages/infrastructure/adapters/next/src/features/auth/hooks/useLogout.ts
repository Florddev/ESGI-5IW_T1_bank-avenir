'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/auth.context';
import { AuthClient } from '../../../client/auth.client';

export function useLogout() {
    const [isLoading, setIsLoading] = useState(false);
    const { setUser } = useAuth();
    const router = useRouter();

    const logout = async () => {
        setIsLoading(true);

        try {
            const authClient = new AuthClient();
            await authClient.logout();

            setUser(null);
            router.push('/auth/login');
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return { logout, isLoading };
}
