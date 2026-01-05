'use client';

import { useEffect } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { useRealtimeNotifications } from '../hooks/useRealtimeNotifications';
import { useNotifications } from '../hooks/useNotifications';
import { useMarkAsRead } from '../hooks/useMarkAsRead';
import type { RealtimeNotificationDto } from '@workspace/application/dtos';

export interface NotificationCenterProps {
    userId: string;
    onNotificationClick?: (notification: RealtimeNotificationDto) => void;
}

export function NotificationCenter({ userId, onNotificationClick }: NotificationCenterProps) {
    const { notifications: existingNotifications, refetch } = useNotifications(userId);
    const { markAsRead } = useMarkAsRead();
    const { events, isConnected, connectionError } = useRealtimeNotifications(userId);

    useEffect(() => {
        if (events.length > 0 && events[0].event === 'notification_new') {
            refetch();
        }
    }, [events.length, refetch]);

    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    const unreadCount = existingNotifications?.filter((n) => !n.isRead).length || 0;

    const handleMarkAsRead = (notificationId: string) => {
        markAsRead(notificationId);
        refetch();
    };

    return (
        <div className="relative">
            <button
                type="button"
                className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                aria-label="Notifications"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <div className="absolute top-0 right-0">
                {isConnected ? (
                    <div
                        className="w-2 h-2 bg-green-500 rounded-full"
                        title="Connecté en temps réel"
                    />
                ) : (
                    <div
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        title={connectionError ? 'Erreur de connexion' : 'Déconnecté'}
                    />
                )}
            </div>
        </div>
    );
}

export interface NotificationListProps {
    userId: string;
    maxHeight?: string;
    onNotificationClick?: (notification: RealtimeNotificationDto) => void;
}

export function NotificationList({
    userId,
    maxHeight = '400px',
    onNotificationClick,
}: NotificationListProps) {
    const { notifications, isLoading, refetch } = useNotifications(userId);
    const { markAsRead } = useMarkAsRead();
    const { events, isConnected } = useRealtimeNotifications(userId);

    useEffect(() => {
        if (events.length > 0 && events[0].event === 'notification_new') {
            refetch();
        }
    }, [events.length, refetch]);

    const handleMarkAsRead = async (notificationId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        await markAsRead(notificationId);
        refetch();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
            </div>
        );
    }

    if (!notifications || notifications.length === 0) {
        return (
            <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucune notification</p>
            </div>
        );
    }

    return (
        <div className="space-y-2" style={{ maxHeight, overflowY: 'auto' }}>
            {/* Badge connexion temps réel */}
            {isConnected && (
                <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-sm text-green-700 dark:text-green-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>Notifications en temps réel activées</span>
                </div>
            )}

            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`
                        p-4 rounded-lg border cursor-pointer transition-all
                        ${notification.isRead 
                            ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
                            : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                        }
                        hover:shadow-md
                    `}
                    onClick={() => onNotificationClick?.(notification)}
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                {notification.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                {new Date(notification.createdAt).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            {!notification.isRead && (
                                <button
                                    type="button"
                                    onClick={(e) => handleMarkAsRead(notification.id, e)}
                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                    title="Marquer comme lu"
                                >
                                    <Check className="w-4 h-4 text-green-600" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Badge type de notification */}
                    <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            {notification.type}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
