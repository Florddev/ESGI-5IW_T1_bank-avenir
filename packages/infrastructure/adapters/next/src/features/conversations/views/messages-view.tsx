'use client';

import { Button } from '@workspace/ui-react/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui-react/components/card';
import { useState, useEffect, useRef } from 'react';
import {
    useConversations,
    useConversationMessages,
    useSendMessage,
    useCreateConversation,
    useWaitingConversations,
    useAssignConversation,
    useMarkConversationRead
} from '@workspace/adapter-next/features/conversations';
import { useAuth } from '@workspace/adapter-next/features/auth';
import { UserRole } from '@workspace/domain/entities';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useRealtimeMessages } from '@workspace/adapter-next/features/realtime';
import { useRealtimeNotifications, useMarkAsRead } from '@workspace/adapter-next/features/notifications';
import { CreateConversationForm, SendMessageForm } from '../components';
import type { CreateConversationFormData } from '@workspace/adapter-common/validators';
import { useTranslations } from '@workspace/ui-react/contexts';

export function MessagesView() {
    const { user } = useAuth();
    const { conversations, isLoading, refresh } = useConversations();
    const { createConversation, isLoading: isCreating } = useCreateConversation();
    const [showNewMessage, setShowNewMessage] = useState(false);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const { messages: loadedMessages, isLoading: messagesLoading, refresh: refreshMessages } = useConversationMessages(selectedConversationId);
    const [messages, setMessages] = useState(loadedMessages);
    const { sendMessage, isLoading: isSending } = useSendMessage();
    const { waitingConversations, count: waitingCount, refresh: refreshWaiting } = useWaitingConversations();
    const { assignConversation } = useAssignConversation();
    const { markAsRead: markConversationAsRead } = useMarkConversationRead();

    const { events: realtimeEvents } = useRealtimeMessages(user?.id || '');
    const { events: notificationEvents } = useRealtimeNotifications(user?.id || '');
    const { markAsRead } = useMarkAsRead();
    const t = useTranslations();
    const processedRealtimeRef = useRef(0);
    const processedNotifRef = useRef(0);

    useEffect(() => {
        setMessages(loadedMessages);
    }, [loadedMessages]);

    useEffect(() => {
        if (selectedConversationId) {
            markConversationAsRead(selectedConversationId);
        }
    }, [selectedConversationId, markConversationAsRead]);

    useEffect(() => {
        if (realtimeEvents.length <= processedRealtimeRef.current) return;

        const newEvents = realtimeEvents.slice(0, realtimeEvents.length - processedRealtimeRef.current);
        processedRealtimeRef.current = realtimeEvents.length;

        for (const realtimeEvent of newEvents) {
            if (realtimeEvent.event === 'message_new') {
                const messageData = realtimeEvent.data as any;
                if (messageData?.conversationId === selectedConversationId) {
                    setMessages(prev => {
                        if (prev.some(m => m.id === messageData.id)) return prev;
                        return [...prev, {
                            id: messageData.id,
                            conversationId: messageData.conversationId,
                            authorId: messageData.senderId,
                            authorName: messageData.authorName || 'Unknown',
                            content: messageData.content,
                            isRead: false,
                            createdAt: new Date(messageData.createdAt)
                        }];
                    });
                }
            }
        }
    }, [realtimeEvents.length, selectedConversationId]);

    useEffect(() => {
        if (notificationEvents.length <= processedNotifRef.current) return;

        const newEvents = notificationEvents.slice(0, notificationEvents.length - processedNotifRef.current);
        processedNotifRef.current = notificationEvents.length;

        for (const notifEvent of newEvents) {
            if ((notifEvent.event === 'notification' || notifEvent.event === 'notification_new') &&
                notifEvent.data?.type === 'MESSAGE_RECEIVED' &&
                !notifEvent.data?.isRead &&
                notifEvent.data?.id) {
                markAsRead(notifEvent.data.id);
            }
        }
    }, [notificationEvents.length, markAsRead]);

    const handleCreateConversation = async (data: CreateConversationFormData) => {
        const result = await createConversation(data.subject, data.message);
        if (result) {
            setShowNewMessage(false);
            refresh();
        }
    };

    const handleSendReply = async (content: string) => {
        if (!selectedConversationId || !user?.id) return;

        const tempId = `temp-${Date.now()}`;
        const tempMessage = {
            id: tempId,
            conversationId: selectedConversationId,
            authorId: user.id,
            authorName: `${user.firstName} ${user.lastName}`,
            content: content,
            isRead: false,
            createdAt: new Date()
        };

        setMessages(prev => [...prev, tempMessage]);

        const success = await sendMessage(selectedConversationId, content);
        if (!success) {
            setMessages(prev => prev.filter(m => m.id !== tempId));
        }
        refresh();
    };

    const handleAssignToMe = async (conversationId: string) => {
        if (!user?.id) return;
        const success = await assignConversation(conversationId, user.id);
        if (success) {
            setSelectedConversationId(conversationId);
            await refreshWaiting();
            await refresh();
            refreshMessages();
        }
    };

    const isAdvisor = user?.role === UserRole.ADVISOR;
    const selectedConversation = conversations.find(c => c.id === selectedConversationId);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            <div className="lg:col-span-1 space-y-4 w-full">
                <div className="flex items-center justify-between w-full">
                    <h3 className="text-lg font-semibold">Conversations</h3>
                    {!isAdvisor && (
                        <Button size="sm" onClick={() => setShowNewMessage(!showNewMessage)}>
                            {showNewMessage ? 'Annuler' : '+ Nouveau'}
                        </Button>
                    )}
                </div>

                {showNewMessage && !isAdvisor && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Nouveau message</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CreateConversationForm
                                onSubmit={handleCreateConversation}
                                isLoading={isCreating}
                            />
                        </CardContent>
                    </Card>
                )}

                {isAdvisor && waitingCount > 0 && (
                    <Card className="border-amber-500/20 bg-amber-500/5">
                        <CardHeader>
                            <CardTitle className="text-amber-700 dark:text-amber-500">
                                En attente ({waitingCount})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {waitingConversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    className="p-3 bg-background rounded-lg cursor-pointer hover:bg-accent transition-colors"
                                    onClick={() => setSelectedConversationId(conv.id)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{conv.subject}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {conv.clientName}
                                            </p>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAssignToMe(conv.id);
                                            }}
                                        >
                                            Prendre
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>{isAdvisor ? 'Mes conversations' : 'Vos messages'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <p className="text-sm text-muted-foreground">Chargement...</p>
                        ) : conversations.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Aucune conversation</p>
                        ) : (
                            <div className="space-y-2">
                                {conversations.map((conv) => (
                                    <div
                                        key={conv.id}
                                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                            selectedConversationId === conv.id
                                                ? 'bg-primary text-primary-foreground'
                                                : 'hover:bg-accent hover:text-accent-foreground'
                                        }`}
                                        onClick={() => setSelectedConversationId(conv.id)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">{conv.subject}</p>
                                                <p className="text-xs opacity-80 truncate">{conv.lastMessage}</p>
                                            </div>
                                            {conv.unreadCount > 0 && (
                                                <span className="ml-2 px-2 py-0.5 bg-destructive text-destructive-foreground text-xs rounded-full">
                                                    {conv.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {conv.lastMessageAt && formatDistanceToNow(new Date(conv.lastMessageAt), {
                                                addSuffix: true,
                                                locale: fr
                                            })}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-2">
                {selectedConversation ? (
                    <Card className="flex flex-col h-[600px]">
                        <CardHeader className="border-b px-6 py-4 flex-shrink-0">
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-xl">{selectedConversation.subject}</CardTitle>
                                    {isAdvisor && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Client: {selectedConversation.clientName}
                                        </p>
                                    )}
                                    {selectedConversation.advisorName && (
                                        <p className="text-sm text-muted-foreground">
                                            Conseiller: {selectedConversation.advisorName}
                                        </p>
                                    )}
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    selectedConversation.status === 'ASSIGNED' || selectedConversation.status === 'OPEN'
                                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-500 border border-emerald-500/20'
                                        : selectedConversation.status === 'WAITING'
                                        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-500 border border-amber-500/20'
                                        : 'bg-muted text-muted-foreground border border-border'
                                }`}>
                                    {selectedConversation.status === 'ASSIGNED' || selectedConversation.status === 'OPEN' ? 'Ouverte' :
                                     selectedConversation.status === 'WAITING' ? 'En attente' : 'Fermée'}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col p-0 min-h-0">
                            <div className="flex-1 overflow-y-auto px-6 py-4 bg-muted/30">
                                {messagesLoading ? (
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
                                            return (
                                                <div
                                                    key={msg.id}
                                                    className={`flex w-full ${isCurrentUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                                                >
                                                    <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} max-w-[75%]`}>
                                                        <div
                                                            className={`px-4 py-3 rounded-2xl shadow-sm ${
                                                                isCurrentUser
                                                                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                                                                    : 'bg-card text-card-foreground border rounded-bl-sm'
                                                            }`}
                                                        >
                                                            {!isCurrentUser && (
                                                                <p className="text-xs font-semibold mb-1 opacity-70">{msg.authorName}</p>
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
                                    </div>
                                )}
                            </div>
                            {(selectedConversation.status === 'ASSIGNED' || selectedConversation.status === 'OPEN') && (
                                <div className="border-t bg-background px-6 py-4 flex-shrink-0">
                                    <SendMessageForm
                                        onSend={handleSendReply}
                                        isSending={isSending}
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="h-full flex items-center justify-center">
                        <CardContent className="text-center py-12">
                            <p className="text-muted-foreground mb-4">
                                Sélectionnez une conversation pour afficher les messages
                            </p>
                            {!isAdvisor && (
                                <Button onClick={() => setShowNewMessage(true)}>
                                    Créer une conversation
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
