'use client';

import { useState } from 'react';
import { getConversationsClient } from '../../../client/conversations.client';

export function useAssignConversation() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const assignConversation = async (conversationId: string, advisorId: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const client = getConversationsClient();
            await client.assignConversation(conversationId, advisorId);
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to assign conversation');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        assignConversation,
        isLoading,
        error,
    };
}
