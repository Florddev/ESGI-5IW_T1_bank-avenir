import type { IRealtimeConnection } from '@workspace/application/ports';

export class WebSocketConnection implements IRealtimeConnection {
    private ws: WebSocket | null = null;
    private _isConnected = false;
    private wsUrl: string;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000;

    constructor(wsUrl?: string) {
        this.wsUrl = wsUrl || 'ws://localhost:3001';
    }

    connect(userId: string, clientId: string, onMessage: (data: any) => void, onError: (error: any) => void): void {
        const params = new URLSearchParams({ userId, clientId });
        const url = `${this.wsUrl}?${params.toString()}`;
        
        try {
            this.ws = new WebSocket(url);
            
            this.ws.onopen = () => {
                this._isConnected = true;
                this.reconnectAttempts = 0;
            };
            
            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    onMessage(data);
                } catch (error) {
                    onError(error);
                }
            };
            
            this.ws.onerror = (error) => {
                this._isConnected = false;
                onError(error);
            };
            
            this.ws.onclose = () => {
                this._isConnected = false;
                
                if (this.reconnectAttempts < this.maxReconnectAttempts) {
                    this.reconnectAttempts++;
                    const delay = this.reconnectDelay * this.reconnectAttempts;
                    setTimeout(() => {
                        this.connect(userId, clientId, onMessage, onError);
                    }, delay);
                }
            };
        } catch (error) {
            this._isConnected = false;
            onError(error);
        }
    }

    disconnect(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this._isConnected = false;
        this.reconnectAttempts = this.maxReconnectAttempts;
    }

    isConnected(): boolean {
        return this._isConnected && this.ws?.readyState === WebSocket.OPEN;
    }

    send(data: any): void {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            throw new Error('WebSocket not connected');
        }
        this.ws.send(JSON.stringify(data));
    }
}
