import type { IRealtimeConnection } from '@workspace/application/ports';

export class SSEConnection implements IRealtimeConnection {
    private eventSource: EventSource | null = null;
    private _isConnected = false;
    private sseUrl: string;

    constructor(sseUrl?: string) {
        this.sseUrl = sseUrl || '/api/realtime/sse';
    }

    connect(userId: string, clientId: string, onMessage: (data: any) => void, onError: (error: any) => void): void {
        const params = new URLSearchParams({ userId, clientId });
        const url = `${this.sseUrl}?${params.toString()}`;
        
        this.eventSource = new EventSource(url);
        
        this.eventSource.onopen = () => {
            this._isConnected = true;
        };
        
        this.eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                onMessage(data);
            } catch (error) {
                onError(error);
            }
        };
        
        this.eventSource.onerror = (error) => {
            this._isConnected = false;
            onError(error);
        };
    }

    disconnect(): void {
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }
        this._isConnected = false;
    }

    isConnected(): boolean {
        return this._isConnected;
    }
}
