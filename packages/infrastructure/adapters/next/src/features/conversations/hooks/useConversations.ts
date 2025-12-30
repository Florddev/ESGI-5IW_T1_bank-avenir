'use client';

import { useState, useEffect } from 'react';
import { getConversationsClient } from '@workspace/adapter-next/client';
import type { ConversationDto } from '@workspace/application/dtos';

export function useConversations() {
    const [conversations, setConversations] = useState<ConversationDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadConversations = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const client = getConversationsClient();
            const data = await client.getUserConversations();
            setConversations(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load conversations');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadConversations();
    }, []);

    return {
        conversations,
        isLoading,
        error,
        refresh: loadConversations,
    };
}
