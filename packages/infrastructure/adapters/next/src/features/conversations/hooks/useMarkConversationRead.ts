'use client';

import { useState, useCallback } from 'react';
import { getConversationsClient } from '@workspace/adapter-next/client';

export function useMarkConversationRead() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const markAsRead = useCallback(async (conversationId: string): Promise<boolean> => {
        try {
            setIsLoading(true);
            setError(null);
            const client = getConversationsClient();
            await client.markConversationRead(conversationId);
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to mark conversation as read');
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        markAsRead,
        isLoading,
        error,
    };
}
