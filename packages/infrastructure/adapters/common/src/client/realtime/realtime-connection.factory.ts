import type { IRealtimeConnection, RealtimeClientConfig } from '@workspace/application/ports';

export class RealtimeConnectionFactory {
    private static config: RealtimeClientConfig = {
        protocol: 'sse',
    };
    
    private static SSEConnection: new (sseUrl?: string) => IRealtimeConnection;
    private static WebSocketConnection: new (wsUrl?: string) => IRealtimeConnection;

    static registerImplementations(
        sseConnection: new (sseUrl?: string) => IRealtimeConnection,
        websocketConnection: new (wsUrl?: string) => IRealtimeConnection
    ): void {
        this.SSEConnection = sseConnection;
        this.WebSocketConnection = websocketConnection;
    }

    static configure(config: RealtimeClientConfig): void {
        this.config = { ...this.config, ...config };
    }

    static create(): IRealtimeConnection {
        if (this.config.protocol === 'websocket') {
            if (!this.WebSocketConnection) {
                throw new Error('WebSocketConnection not registered. Call RealtimeConnectionFactory.registerImplementations() first.');
            }
            return new this.WebSocketConnection(this.config.wsUrl);
        }
        
        if (!this.SSEConnection) {
            throw new Error('SSEConnection not registered. Call RealtimeConnectionFactory.registerImplementations() first.');
        }
        return new this.SSEConnection(this.config.sseUrl);
    }
}

