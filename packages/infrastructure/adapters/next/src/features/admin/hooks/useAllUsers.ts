'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAdminClient } from '@workspace/adapter-next/client';
import type { UserDto } from '@workspace/application/dtos';

export function useAllUsers() {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const client = getAdminClient();
            const data = await client.getAllUsers();
            setUsers(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors du chargement des utilisateurs');
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    return { users, isLoading, error, refetch: loadUsers };
}
