'use client';

import { useState } from 'react';
import { getConversationsClient } from '@workspace/adapter-next/client';

export function useSendMessage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = async (conversationId: string, content: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const client = getConversationsClient();
            await client.sendMessage(conversationId, { content });
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send message');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        sendMessage,
        isLoading,
        error,
    };
}
