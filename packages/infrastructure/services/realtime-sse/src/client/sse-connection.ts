import type { IRealtimeConnection } from '@workspace/application/ports';

export class SSEConnection implements IRealtimeConnection {
    private eventSource: EventSource | null = null;
    private _isConnected = false;
    private sseUrl: string;

    constructor(sseUrl?: string) {
        this.sseUrl = sseUrl || '/api/realtime/sse';
    }

    connect(userId: string, clientId: string, onMessage: (data: any) => void, onError: (error: any) => void): void {
        // Disconnect existing connection if any
        if (this.eventSource) {
            this.disconnect();
        }

        const params = new URLSearchParams({ userId, clientId });
        const url = `${this.sseUrl}?${params.toString()}`;

        try {
            this.eventSource = new EventSource(url);

            this.eventSource.onopen = () => {
                this._isConnected = true;
            };

            this.eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    onMessage(data);
                } catch (error) {
                    console.error('SSE message parse error:', error);
                    onError(error);
                }
            };

            this.eventSource.onerror = (error) => {
                this._isConnected = false;
                // Only report error if the connection was previously established
                // This prevents reconnection loops on page load
                if (this.eventSource && this.eventSource.readyState !== EventSource.CLOSED) {
                    onError(error);
                }
            };
        } catch (error) {
            console.error('SSE connection error:', error);
            this._isConnected = false;
            onError(error);
        }
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
