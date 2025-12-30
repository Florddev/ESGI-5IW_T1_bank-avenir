'use client';

import { useState, useEffect } from 'react';
import { getConversationsClient } from '@workspace/adapter-next/client';
import type { WaitingConversationsDto } from '@workspace/application/dtos';

export function useWaitingConversations() {
    const [data, setData] = useState<WaitingConversationsDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadWaitingConversations = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const client = getConversationsClient();
            const result = await client.getWaitingConversations();
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load waiting conversations');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadWaitingConversations();
    }, []);

    return {
        waitingConversations: data?.conversations || [],
        count: data?.count || 0,
        isLoading,
        error,
        refresh: loadWaitingConversations,
    };
}
