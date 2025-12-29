'use client';

import { useState, useEffect } from 'react';
import { getConversationsClient } from '../../../client/conversations.client';
import type { MessageDto } from '@workspace/application/dtos';

export function useConversationMessages(conversationId: string | null) {
    const [messages, setMessages] = useState<MessageDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadMessages = async () => {
        if (!conversationId) return;
        
        try {
            setIsLoading(true);
            setError(null);
            const client = getConversationsClient();
            const data = await client.getMessages(conversationId);
            setMessages(data.messages);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load messages');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadMessages();
    }, [conversationId]);

    return {
        messages,
        isLoading,
        error,
        refresh: loadMessages,
    };
}
