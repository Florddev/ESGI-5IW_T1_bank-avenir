'use client';

import { Button } from '@workspace/ui-react/components/button';
import { Input } from '@workspace/ui-react/components/input';
import { Label } from '@workspace/ui-react/components/label';
import { Textarea } from '@workspace/ui-react/components/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui-react/components/card';
import { useState, useEffect } from 'react';
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

export function MessagesView() {
    const { user } = useAuth();
    const { conversations, isLoading, refresh } = useConversations();
    const { createConversation, isLoading: isCreating } = useCreateConversation();
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [showNewMessage, setShowNewMessage] = useState(false);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const { messages: loadedMessages, isLoading: messagesLoading, refresh: refreshMessages } = useConversationMessages(selectedConversationId);
    const [messages, setMessages] = useState(loadedMessages);
    const { sendMessage, isLoading: isSending } = useSendMessage();
    const [replyMessage, setReplyMessage] = useState('');
    const { waitingConversations, count: waitingCount, refresh: refreshWaiting } = useWaitingConversations();
    const { assignConversation } = useAssignConversation();
    const { markAsRead: markConversationAsRead } = useMarkConversationRead();

    const { events: realtimeEvents } = useRealtimeMessages(user?.id || '');
    const { events: notificationEvents } = useRealtimeNotifications(user?.id || '');
    const { markAsRead } = useMarkAsRead();

    useEffect(() => {
        setMessages(loadedMessages);
    }, [loadedMessages]);

    useEffect(() => {
        if (selectedConversationId) {
            markConversationAsRead(selectedConversationId);
        }
    }, [selectedConversationId, markConversationAsRead]);

    useEffect(() => {
        if (!realtimeEvents || realtimeEvents.length === 0) return;

        const lastEvent = realtimeEvents[realtimeEvents.length - 1];
        if (lastEvent.event === 'message_new') {
            const messageData = lastEvent.data as any;
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
    }, [realtimeEvents.length, selectedConversationId]);

    useEffect(() => {
        if (!notificationEvents || notificationEvents.length === 0) return;

        const lastNotification = notificationEvents[notificationEvents.length - 1];
        if (lastNotification.event === 'notification_new' &&
            lastNotification.data.type === 'MESSAGE_RECEIVED' &&
            !lastNotification.data.isRead) {
            markAsRead(lastNotification.data.id);
        }
    }, [notificationEvents.length, markAsRead]);

    const handleCreateConversation = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !message.trim()) return;
        
        const result = await createConversation(subject, message);
        if (result) {
            setSubject('');
            setMessage('');
            setShowNewMessage(false);
            refresh();
        }
    };

    const handleSendReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedConversationId || !replyMessage.trim() || !user?.id) return;

        const tempId = `temp-${Date.now()}`;
        const tempMessage = {
            id: tempId,
            conversationId: selectedConversationId,
            authorId: user.id,
            authorName: `${user.firstName} ${user.lastName}`,
            content: replyMessage,
            isRead: false,
            createdAt: new Date()
        };

        setMessages(prev => [...prev, tempMessage]);
        setReplyMessage('');

        const success = await sendMessage(selectedConversationId, replyMessage);
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
                            <form onSubmit={handleCreateConversation} className="space-y-4">
                                <div>
                                    <Label htmlFor="subject">Sujet</Label>
                                    <Input
                                        id="subject"
                                        placeholder="Objet"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Votre message..."
                                        rows={4}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={isCreating}>
                                    {isCreating ? 'Envoi...' : 'Envoyer'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {isAdvisor && waitingCount > 0 && (
                    <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950">
                        <CardHeader>
                            <CardTitle className="text-orange-900 dark:text-orange-100">
                                En attente ({waitingCount})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {waitingConversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    className="p-3 bg-white dark:bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
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
                                                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                        onClick={() => setSelectedConversationId(conv.id)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">{conv.subject}</p>
                                                <p className="text-xs opacity-80 truncate">{conv.lastMessage}</p>
                                            </div>
                                            {conv.unreadCount > 0 && (
                                                <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                                                    {conv.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs opacity-70 mt-1">
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
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                        : selectedConversation.status === 'WAITING'
                                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                }`}>
                                    {selectedConversation.status === 'ASSIGNED' || selectedConversation.status === 'OPEN' ? 'Ouverte' :
                                     selectedConversation.status === 'WAITING' ? 'En attente' : 'Fermée'}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col p-0 min-h-0">
                            <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50 dark:bg-gray-950">
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
                                                                    : 'bg-white dark:bg-gray-800 rounded-bl-sm'
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
                                <div className="border-t bg-white dark:bg-gray-900 px-6 py-4 flex-shrink-0">
                                    <form onSubmit={handleSendReply} className="flex gap-3">
                                        <Input
                                            placeholder="Écrivez votre message..."
                                            value={replyMessage}
                                            onChange={(e) => setReplyMessage(e.target.value)}
                                            required
                                            className="flex-1"
                                        />
                                        <Button type="submit" disabled={isSending} size="default">
                                            {isSending ? 'Envoi...' : 'Envoyer'}
                                        </Button>
                                    </form>
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
