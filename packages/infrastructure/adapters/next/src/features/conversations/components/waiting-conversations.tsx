'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui-react/components/card';
import { Button } from '@workspace/ui-react/components/button';

interface WaitingConversation {
    id: string;
    subject: string;
    clientName: string;
}

interface WaitingConversationsProps {
    conversations: WaitingConversation[];
    count: number;
    onAssign: (id: string) => void;
    onSelect: (id: string) => void;
}

export function WaitingConversations({ conversations, count, onAssign, onSelect }: WaitingConversationsProps) {
    return (
        <Card className="border-amber-500/20 bg-amber-500/5">
            <CardHeader>
                <CardTitle className="text-amber-700 dark:text-amber-500">
                    En attente ({count})
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {conversations.map((conv) => (
                    <div
                        key={conv.id}
                        className="p-3 bg-background rounded-lg cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => onSelect(conv.id)}
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
                                    onAssign(conv.id);
                                }}
                            >
                                Prendre
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
