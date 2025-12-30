import { useEffect, useRef, useState, useCallback } from 'react';

export interface UseRealtimeOptions<T> {
    userId: string;
    events: string[]; // Liste des événements à écouter : ['message_new', 'message_read', 'typing_start']
    onEvent?: (event: string, data: T) => void;
    onError?: (error: Event) => void;
    autoReconnect?: boolean;
    reconnectInterval?: number; // ms
}

export interface RealtimeEvent<T = any> {
    event: string;
    data: T;
    timestamp: string;
    userId?: string;
}

/**
 * Hook générique pour se connecter au système temps réel
 * Peut être utilisé pour n'importe quel type d'événement
 */
export function useRealtime<T = any>(options: UseRealtimeOptions<T>) {
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const [events, setEvents] = useState<RealtimeEvent<T>[]>([]);
    
    const eventSourceRef = useRef<EventSource | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const connect = useCallback(() => {
        const params = new URLSearchParams({
            userId: options.userId,
            clientId: crypto.randomUUID(),
        });

        const eventSource = new EventSource(`/api/realtime/sse?${params.toString()}`);
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
            setIsConnected(true);
            setConnectionError(null);
            console.log('[Realtime] Connecté');
        };

        eventSource.onerror = (error) => {
            setIsConnected(false);
            setConnectionError('Erreur de connexion');
            options.onError?.(error);
            
            eventSource.close();

            // Auto-reconnexion
            if (options.autoReconnect !== false) {
                const interval = options.reconnectInterval || 5000;
                reconnectTimeoutRef.current = setTimeout(() => {
                    console.log('[Realtime] Tentative de reconnexion...');
                    connect();
                }, interval);
            }
        };

        // Écouter les événements spécifiques
        options.events.forEach((eventName) => {
            eventSource.addEventListener(eventName, (e: MessageEvent) => {
                try {
                    const data = JSON.parse((e as MessageEvent).data);
                    const realtimeEvent: RealtimeEvent<T> = {
                        event: eventName,
                        data: data.data || data,
                        timestamp: data.timestamp || new Date().toISOString(),
                        userId: data.userId,
                    };

                    setEvents((prev) => [realtimeEvent, ...prev]);
                    options.onEvent?.(eventName, realtimeEvent.data);
                } catch (error) {
                    console.error('[Realtime] Erreur parse:', error);
                }
            });
        });

        // Ping keep-alive
        eventSource.addEventListener('ping', () => {
            // Juste pour garder la connexion vivante
        });

    }, [options]);

    useEffect(() => {
        connect();

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
        };
    }, [connect]);

    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
        setIsConnected(false);
    }, []);

    const reconnect = useCallback(() => {
        disconnect();
        setTimeout(() => connect(), 100);
    }, [disconnect, connect]);

    const clearEvents = useCallback(() => {
        setEvents([]);
    }, []);

    return {
        isConnected,
        connectionError,
        events,
        reconnect,
        disconnect,
        clearEvents,
    };
}
