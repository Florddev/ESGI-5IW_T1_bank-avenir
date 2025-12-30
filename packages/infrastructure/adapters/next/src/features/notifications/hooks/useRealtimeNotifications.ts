'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import type { RealtimeEventDto, RealtimeNotificationDto } from '@workspace/application/dtos';

export interface UseRealtimeNotificationsOptions {
    userId: string;
    onNotification?: (notification: RealtimeNotificationDto) => void;
    onNotificationRead?: (notificationId: string) => void;
    onError?: (error: Error) => void;
    autoReconnect?: boolean;
    reconnectInterval?: number;
}

export interface UseRealtimeNotificationsReturn {
    notifications: RealtimeNotificationDto[];
    isConnected: boolean;
    connectionError: Error | null;
    reconnect: () => void;
    disconnect: () => void;
}

/**
 * Hook React pour gérer les notifications en temps réel via SSE
 * 
 * @example
 * ```tsx
 * const { notifications, isConnected } = useRealtimeNotifications({
 *   userId: currentUser.id,
 *   onNotification: (notif) => console.log('New notification:', notif),
 * });
 * ```
 */
export function useRealtimeNotifications(
    options: UseRealtimeNotificationsOptions
): UseRealtimeNotificationsReturn {
    const {
        userId,
        onNotification,
        onNotificationRead,
        onError,
        autoReconnect = true,
        reconnectInterval = 5000,
    } = options;

    const [notifications, setNotifications] = useState<RealtimeNotificationDto[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState<Error | null>(null);

    const eventSourceRef = useRef<EventSource | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const clientIdRef = useRef<string>(crypto.randomUUID());

    const disconnect = useCallback(() => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }
        setIsConnected(false);
    }, []);

    const connect = useCallback(() => {
        // Éviter les connexions multiples
        if (eventSourceRef.current) {
            return;
        }

        try {
            const url = `/api/realtime/sse?userId=${encodeURIComponent(userId)}&clientId=${clientIdRef.current}`;
            const eventSource = new EventSource(url);

            eventSource.onopen = () => {
                console.log('[SSE] Connexion établie');
                setIsConnected(true);
                setConnectionError(null);
            };

            eventSource.onmessage = (event) => {
                try {
                    const data: RealtimeEventDto = JSON.parse(event.data);

                    switch (data.event) {
                        case 'notification': {
                            const notification = data.data as RealtimeNotificationDto;
                            setNotifications((prev) => [notification, ...prev]);
                            onNotification?.(notification);
                            break;
                        }

                        case 'notification_read': {
                            const { notificationId } = data.data as { notificationId: string };
                            setNotifications((prev) =>
                                prev.map((n) =>
                                    n.id === notificationId ? { ...n, isRead: true } : n
                                )
                            );
                            onNotificationRead?.(notificationId);
                            break;
                        }

                        case 'notification_deleted': {
                            const { notificationId } = data.data as { notificationId: string };
                            setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
                            break;
                        }

                        default:
                            // Événements système (ping, connected, etc.)
                            break;
                    }
                } catch (error) {
                    console.error('[SSE] Erreur parsing message:', error);
                }
            };

            eventSource.onerror = (event) => {
                console.error('[SSE] Erreur connexion:', event);
                const error = new Error('SSE connection error');
                setConnectionError(error);
                setIsConnected(false);
                onError?.(error);

                // Fermer la connexion actuelle
                eventSource.close();
                eventSourceRef.current = null;

                // Auto-reconnect si activé
                if (autoReconnect) {
                    reconnectTimeoutRef.current = setTimeout(() => {
                        console.log('[SSE] Tentative de reconnexion...');
                        connect();
                    }, reconnectInterval);
                }
            };

            eventSourceRef.current = eventSource;
        } catch (error) {
            console.error('[SSE] Erreur initialisation:', error);
            const err = error instanceof Error ? error : new Error('Failed to initialize SSE');
            setConnectionError(err);
            onError?.(err);
        }
    }, [userId, onNotification, onNotificationRead, onError, autoReconnect, reconnectInterval]);

    // Connexion automatique au mount
    useEffect(() => {
        connect();

        return () => {
            disconnect();
        };
    }, [connect, disconnect]);

    return {
        notifications,
        isConnected,
        connectionError,
        reconnect: connect,
        disconnect,
    };
}
