export interface IRealtimeConnection {
    connect(userId: string, clientId: string, onMessage: (data: any) => void, onError: (error: any) => void): void;
    disconnect(): void;
    isConnected(): boolean;
    send?(data: any): void;
}

export interface RealtimeClientConfig {
    protocol?: 'sse' | 'websocket';
    wsUrl?: string;
    sseUrl?: string;
}
