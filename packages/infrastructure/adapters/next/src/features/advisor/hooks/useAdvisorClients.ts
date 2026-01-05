'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAdvisorClient } from '@workspace/adapter-next/client';
import type { AdvisorClientDto } from '@workspace/application/use-cases';

export function useAdvisorClients() {
    const [clients, setClients] = useState<AdvisorClientDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadClients = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const client = getAdvisorClient();
            const data = await client.getClients();
            setClients(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load clients');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadClients();
    }, [loadClients]);

    return {
        clients,
        isLoading,
        error,
        refresh: loadClients,
    };
}
