import { useEffect, useRef, useState, useCallback } from 'react';
import { RealtimeConnectionFactory } from '@workspace/adapter-common/client';

export interface UseRealtimeOptions<T> {
    userId: string;
    events: string[];
    onEvent?: (event: string, data: T) => void;
    onError?: (error: Event) => void;
    autoReconnect?: boolean;
    reconnectInterval?: number;
}

export interface RealtimeEvent<T = any> {
    event: string;
    data: T;
    timestamp: string;
    userId?: string;
}

export function useRealtime<T = any>(options: UseRealtimeOptions<T>) {
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const [events, setEvents] = useState<RealtimeEvent<T>[]>([]);

    const connectionRef = useRef<ReturnType<typeof RealtimeConnectionFactory.create> | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const clientIdRef = useRef<string>(crypto.randomUUID());
    const optionsRef = useRef(options);

    useEffect(() => {
        optionsRef.current = options;
    }, [options]);

    const connect = useCallback(() => {
        const connection = RealtimeConnectionFactory.create();
        connectionRef.current = connection;
        const currentOptions = optionsRef.current;

        connection.connect(
            currentOptions.userId,
            clientIdRef.current,
            (message) => {
                try {
                    if (currentOptions.events.includes(message.event)) {
                        const realtimeEvent: RealtimeEvent<T> = {
                            event: message.event,
                            data: message.data,
                            timestamp: message.timestamp || new Date().toISOString(),
                            userId: message.userId,
                        };

                        setEvents((prev) => [realtimeEvent, ...prev]);
                        currentOptions.onEvent?.(message.event, realtimeEvent.data);
                    }

                    if (message.event === 'connected') {
                        setIsConnected(true);
                        setConnectionError(null);
                    }
                } catch (error) {
                    currentOptions.onError?.(error as Event);
                }
            },
            (error) => {
                setIsConnected(false);
                setConnectionError('Erreur de connexion');
                currentOptions.onError?.(error);

                if (currentOptions.autoReconnect !== false) {
                    const interval = currentOptions.reconnectInterval || 5000;
                    reconnectTimeoutRef.current = setTimeout(() => {
                        connect();
                    }, interval);
                }
            }
        );

    }, []);

    useEffect(() => {
        connect();

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (connectionRef.current) {
                connectionRef.current.disconnect();
            }
        };
    }, [connect]);

    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }
        if (connectionRef.current) {
            connectionRef.current.disconnect();
            connectionRef.current = null;
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

    const sendMessage = useCallback((data: any) => {
        if (connectionRef.current && 'send' in connectionRef.current) {
            connectionRef.current.send?.(data);
        }
    }, []);

    return {
        isConnected,
        connectionError,
        events,
        reconnect,
        disconnect,
        clearEvents,
        sendMessage,
    };
}
