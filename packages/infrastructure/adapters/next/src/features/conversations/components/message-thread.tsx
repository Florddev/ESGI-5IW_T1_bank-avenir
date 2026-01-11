'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui-react/components/card';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { SendMessageForm } from './send-message-form';

interface Message {
    id: string;
    authorId: string;
    authorName: string;
    content: string;
    createdAt: Date;
}

interface Conversation {
    id: string;
    subject: string;
    clientName?: string;
    advisorName?: string;
    status: string;
}

interface MessageThreadProps {
    conversation: Conversation;
    messages: Message[];
    currentUserId: string | null;
    onSendMessage: (content: string) => Promise<void>;
    messagesLoading: boolean;
    isSending: boolean;
    isAdvisor: boolean;
}

export function MessageThread({
    conversation,
    messages,
    currentUserId,
    onSendMessage,
    messagesLoading,
    isSending,
    isAdvisor,
}: MessageThreadProps) {
    const handleSendMessage = async (content: string) => {
        await onSendMessage(content);
    };

    return (
        <Card className="flex flex-col h-[600px]">
            <CardHeader className="border-b px-6 py-4 flex-shrink-0">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-xl">{conversation.subject}</CardTitle>
                        {isAdvisor && conversation.clientName && (
                            <p className="text-sm text-muted-foreground mt-1">
                                Client: {conversation.clientName}
                            </p>
                        )}
                        {conversation.advisorName && (
                            <p className="text-sm text-muted-foreground">
                                Conseiller: {conversation.advisorName}
                            </p>
                        )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        conversation.status === 'ASSIGNED' || conversation.status === 'OPEN'
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-500 border border-emerald-500/20'
                            : conversation.status === 'WAITING'
                            ? 'bg-amber-500/10 text-amber-700 dark:text-amber-500 border border-amber-500/20'
                            : 'bg-muted text-muted-foreground border border-border'
                    }`}>
                        {conversation.status === 'ASSIGNED' || conversation.status === 'OPEN' ? 'Ouverte' :
                         conversation.status === 'WAITING' ? 'En attente' : 'Fermée'}
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
                                const isCurrentUser = msg.authorId === currentUserId;
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
                {(conversation.status === 'ASSIGNED' || conversation.status === 'OPEN') && (
                    <div className="border-t bg-background px-6 py-4 flex-shrink-0">
                        <SendMessageForm
                            onSend={handleSendMessage}
                            isSending={isSending}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

