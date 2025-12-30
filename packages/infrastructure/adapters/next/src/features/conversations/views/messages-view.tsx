'use client';

import { Button } from '@workspace/ui-react/components/button';
import { Input } from '@workspace/ui-react/components/input';
import { Label } from '@workspace/ui-react/components/label';
import { Textarea } from '@workspace/ui-react/components/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui-react/components/card';
import { useState } from 'react';
import { 
    useConversations, 
    useConversationMessages, 
    useSendMessage, 
    useCreateConversation,
    useWaitingConversations,
    useAssignConversation
} from '@workspace/adapter-next/features/conversations';
import { useAuth } from '@workspace/adapter-next/features/auth';
import { UserRole } from '@workspace/domain/entities';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export function MessagesView() {
    const { user } = useAuth();
    const { conversations, isLoading, refresh } = useConversations();
    const { createConversation, isLoading: isCreating } = useCreateConversation();
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [showNewMessage, setShowNewMessage] = useState(false);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const { messages, isLoading: messagesLoading, refresh: refreshMessages } = useConversationMessages(selectedConversationId);
    const { sendMessage, isLoading: isSending } = useSendMessage();
    const [replyMessage, setReplyMessage] = useState('');
    const { waitingConversations, count: waitingCount, refresh: refreshWaiting } = useWaitingConversations();
    const { assignConversation } = useAssignConversation();

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
        if (!selectedConversationId || !replyMessage.trim()) return;
        
        const success = await sendMessage(selectedConversationId, replyMessage);
        if (success) {
            setReplyMessage('');
            refreshMessages();
            refresh();
        }
    };

    const handleAssignToMe = async (conversationId: string) => {
        if (!user?.id) return;
        const success = await assignConversation(conversationId, user.id);
        if (success) {
            refreshWaiting();
            refresh();
        }
    };

    const isAdvisor = user?.role === UserRole.ADVISOR;
    const selectedConversation = conversations.find(c => c.id === selectedConversationId);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
                <div className="flex items-center justify-between">
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
                    <Card className="h-full flex flex-col">
                        <CardHeader className="border-b">
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle>{selectedConversation.subject}</CardTitle>
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
                                    selectedConversation.status === 'OPEN' 
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                        : selectedConversation.status === 'WAITING'
                                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                }`}>
                                    {selectedConversation.status === 'OPEN' ? 'Ouverte' : 
                                     selectedConversation.status === 'WAITING' ? 'En attente' : 'Fermée'}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col p-4">
                            <div className="flex-1 space-y-4 overflow-y-auto mb-4" style={{ maxHeight: '500px' }}>
                                {messagesLoading ? (
                                    <p className="text-sm text-muted-foreground">Chargement des messages...</p>
                                ) : messages.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">Aucun message</p>
                                ) : (
                                    messages.map((msg) => {
                                        const isCurrentUser = msg.authorId === user?.id;
                                        return (
                                            <div
                                                key={msg.id}
                                                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[80%] p-3 rounded-lg ${
                                                        isCurrentUser
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'bg-gray-100 dark:bg-gray-800'
                                                    }`}
                                                >
                                                    <p className="text-xs font-medium mb-1">{msg.authorName}</p>
                                                    <p className="text-sm">{msg.content}</p>
                                                    <p className="text-xs opacity-70 mt-1">
                                                        {formatDistanceToNow(new Date(msg.createdAt), { 
                                                            addSuffix: true, 
                                                            locale: fr 
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                            {selectedConversation.status === 'OPEN' && (
                                <form onSubmit={handleSendReply} className="flex gap-2">
                                    <Input
                                        placeholder="Votre réponse..."
                                        value={replyMessage}
                                        onChange={(e) => setReplyMessage(e.target.value)}
                                        required
                                    />
                                    <Button type="submit" disabled={isSending}>
                                        {isSending ? 'Envoi...' : 'Envoyer'}
                                    </Button>
                                </form>
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
