'use client';

import { Button } from '@workspace/ui-react/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui-react/components/card';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useConversationMessages, useSendMessage } from '@workspace/adapter-next/features/conversations';
import { useAuth } from '@workspace/adapter-next/features/auth';
import { UserRole } from '@workspace/domain/entities';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useRealtimeMessages } from '@workspace/adapter-next/features/realtime';
import { SendMessageForm } from '../components';
import { getMessagesClient } from '@workspace/adapter-common/client';

export function StaffGroupChatView() {
    const { user } = useAuth();
    const [conversationId, setConversationId] = useState<string | null>(null);
    const { messages: loadedMessages, isLoading, refresh } = useConversationMessages(conversationId);
    const [messages, setMessages] = useState(loadedMessages);
    const { sendMessage, isLoading: isSending } = useSendMessage();
    const { events: realtimeEvents } = useRealtimeMessages(user?.id || '');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        const fetchGroupChat = async () => {
            const response = await fetch('/api/conversations/staff-group');
            const data = await response.json();
            if (data.success) {
                setConversationId(data.data.id);
            }
        };
        fetchGroupChat();
    }, []);

    useEffect(() => {
        setMessages(loadedMessages);
    }, [loadedMessages]);

    useEffect(() => {
        scrollToBottom();
    }, [messages.length, scrollToBottom]);

    useEffect(() => {
        if (realtimeEvents.length === 0) return;

        const newEvents = realtimeEvents.slice(-1);
        for (const event of newEvents) {
            if (event.event === 'message_new') {
                const messageData = event.data as any;
                if (messageData?.conversationId === conversationId) {
                    setIsTyping(false);
                    setMessages(prev => {
                        if (prev.some(m => m.id === messageData.id)) return prev;
                        return [...prev, {
                            id: messageData.id,
                            conversationId: messageData.conversationId,
                            authorId: messageData.senderId,
                            authorName: messageData.senderName || 'Staff',
                            authorRole: messageData.senderRole,
                            content: messageData.content,
                            isRead: false,
                            createdAt: new Date(messageData.createdAt)
                        }];
                    });
                }
            }
            if (event.event === 'typing_start') {
                const typingData = event.data as any;
                if (typingData?.conversationId === conversationId && typingData.userId !== user?.id) {
                    setIsTyping(true);
                    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                    typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 4000);
                }
            }
            if (event.event === 'typing_stop') {
                const typingData = event.data as any;
                if (typingData?.conversationId === conversationId) {
                    setIsTyping(false);
                }
            }
        }
    }, [realtimeEvents.length, conversationId, user?.id]);

    const handleSendMessage = async (content: string) => {
        if (!conversationId || !user?.id) return;

        const tempId = `temp-${Date.now()}`;
        const tempMessage = {
            id: tempId,
            conversationId,
            authorId: user.id,
            authorName: `${user.firstName} ${user.lastName}`,
            authorRole: user.role,
            content,
            isRead: false,
            createdAt: new Date()
        };

        setMessages(prev => [...prev, tempMessage]);

        const success = await sendMessage(conversationId, content);
        if (!success) {
            setMessages(prev => prev.filter(m => m.id !== tempId));
        }
        refresh();
    };

    const handleTypingChange = useCallback((typing: boolean) => {
        if (!conversationId || !user?.id) return;
        fetch('/api/messages/typing', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                conversationId,
                userId: user.id,
                isTyping: typing
            })
        }).catch(() => {});
    }, [conversationId, user?.id]);

    if (!conversationId) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    return (
        <Card className="flex flex-col h-[calc(100vh-8rem)]">
            <CardHeader className="border-b px-6 py-4 flex-shrink-0">
                <CardTitle className="text-xl">Staff Group Chat</CardTitle>
                <p className="text-sm text-muted-foreground">Discussion entre conseillers et directeurs</p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0 min-h-0">
                <div className="flex-1 overflow-y-auto px-6 py-4 bg-muted/30">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-sm text-muted-foreground">Chargement des messages...</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-sm text-muted-foreground">Aucun message</p>
                        </div>
                    ) : (
                        <div className="space-y-4 w-full">
                            {messages.map((msg) => {
                                const isCurrentUser = msg.authorId === user?.id;
                                const isDirector = msg.authorRole === UserRole.DIRECTOR;
                                
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex w-full ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} max-w-[75%]`}>
                                            <div
                                                className={`px-4 py-3 rounded-2xl shadow-sm ${
                                                    isCurrentUser
                                                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                                                        : isDirector
                                                        ? 'bg-amber-500 text-white border-2 border-amber-600 rounded-bl-sm'
                                                        : 'bg-card text-card-foreground border rounded-bl-sm'
                                                }`}
                                            >
                                                {!isCurrentUser && (
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="text-xs font-semibold opacity-70">{msg.authorName}</p>
                                                        {isDirector && (
                                                            <span className="text-xs px-1.5 py-0.5 bg-amber-600 rounded-full font-bold">
                                                                Directeur
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                                            </div>
                                            <p className={`text-xs text-muted-foreground mt-1 px-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                                                {formatDistanceToNow(new Date(msg.createdAt), {
                                                    addSuffix: true,
                                                    locale: fr
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>
                <div className="border-t bg-background px-6 py-4 flex-shrink-0">
                    {isTyping && (
                        <div className="flex items-center gap-2 px-1 pb-2">
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:0ms]" />
                                <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:150ms]" />
                                <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:300ms]" />
                            </div>
                            <span className="text-xs text-muted-foreground italic">
                                Un membre de l'équipe est en train d'écrire...
                            </span>
                        </div>
                    )}
                    <SendMessageForm
                        onSend={handleSendMessage}
                        isSending={isSending}
                        onTypingChange={handleTypingChange}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
