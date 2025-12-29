'use client';

import { useState } from 'react';
import { getConversationsClient } from '../../../client/conversations.client';
import type { ConversationDto } from '@workspace/application/dtos';

export function useCreateConversation() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createConversation = async (subject: string, firstMessage: string): Promise<ConversationDto | null> => {
        try {
            setIsLoading(true);
            setError(null);
            const client = getConversationsClient();
            const conversation = await client.createConversation({ subject, firstMessage });
            return conversation;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create conversation');
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        createConversation,
        isLoading,
        error,
    };
}
