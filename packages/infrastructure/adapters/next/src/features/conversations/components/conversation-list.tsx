'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui-react/components/card';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Conversation {
    id: string;
    subject: string;
    lastMessage: string;
    lastMessageAt: string;
    unreadCount: number;
}

interface ConversationListProps {
    conversations: Conversation[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    isLoading?: boolean;
}

export function ConversationList({ conversations, selectedId, onSelect, isLoading }: ConversationListProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Vos messages</CardTitle>
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
                                    selectedId === conv.id
                                        ? 'bg-primary text-primary-foreground'
                                        : 'hover:bg-accent hover:text-accent-foreground'
                                }`}
                                onClick={() => onSelect(conv.id)}
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
    );
}
