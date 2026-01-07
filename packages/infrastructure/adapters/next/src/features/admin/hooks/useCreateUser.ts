'use client';

import { useState } from 'react';
import { getAdminClient } from '@workspace/adapter-next/client';
import type { UserDto } from '@workspace/application/dtos';

export function useCreateUser() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createUser = async (data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role: string;
    }): Promise<UserDto> => {
        setIsLoading(true);
        setError(null);

        try {
            const client = getAdminClient();
            const user = await client.createUser(data);
            return user;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Erreur lors de la création de l'utilisateur";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { createUser, isLoading, error };
}
