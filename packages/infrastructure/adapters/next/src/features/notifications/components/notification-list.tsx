'use client';

import type { NotificationDto } from '@workspace/application/dtos';
import { Button } from '@workspace/ui-react/components/button';
import { Card, CardContent } from '@workspace/ui-react/components/card';

interface NotificationListProps {
    notifications: NotificationDto[];
    onMarkAsRead?: (notificationId: string) => void;
}

export function NotificationList({ notifications, onMarkAsRead }: NotificationListProps) {
    if (notifications.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                Aucune notification
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {notifications.map((notification) => (
                <Card key={notification.id} className={notification.readAt ? 'opacity-60' : ''}>
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                                <p className="font-medium mb-1">{notification.title}</p>
                                <p className="text-sm text-muted-foreground mb-2">{notification.content}</p>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(notification.createdAt).toLocaleString()}
                                </p>
                            </div>
                            {!notification.readAt && onMarkAsRead && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onMarkAsRead(notification.id)}
                                >
                                    Marquer lu
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
