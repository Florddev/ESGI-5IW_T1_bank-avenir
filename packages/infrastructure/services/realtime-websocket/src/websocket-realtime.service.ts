import { injectable } from 'tsyringe';
import { IRealtimeService } from '@workspace/application/ports';
import { WebSocket } from 'ws';

interface WebSocketClient {
    userId: string;
    clientId: string;
    ws: WebSocket;
}

@injectable()
export class WebSocketRealtimeService implements IRealtimeService {
    private clients: Map<string, WebSocketClient> = new Map();
    private userClientIds: Map<string, Set<string>> = new Map();
    private pingInterval: NodeJS.Timeout | null = null;

    constructor() {
        this.startKeepAlive();
    }

    registerClient(userId: string, clientId: string, connectionContext?: any): void {
        if (!this.userClientIds.has(userId)) {
            this.userClientIds.set(userId, new Set());
        }
        this.userClientIds.get(userId)!.add(clientId);

        if (connectionContext?.ws) {
            const ws = connectionContext.ws as WebSocket;
            const client: WebSocketClient = {
                userId,
                clientId,
                ws,
            };
            this.clients.set(clientId, client);

            ws.on('close', () => {
                this.unregisterClient(clientId);
            });

            ws.on('error', () => {
                this.unregisterClient(clientId);
            });

            this.sendToClient(clientId, {
                event: 'connected',
                data: { userId, clientId, timestamp: new Date().toISOString() },
            });
        }
    }

    unregisterClient(clientId: string): void {
        const client = this.clients.get(clientId);
        if (client) {
            const userClients = this.userClientIds.get(client.userId);
            if (userClients) {
                userClients.delete(clientId);
                if (userClients.size === 0) {
                    this.userClientIds.delete(client.userId);
                }
            }
            
            if (client.ws.readyState === WebSocket.OPEN) {
                client.ws.close();
            }
            
            this.clients.delete(clientId);
        }
    }

    async sendEventToUser<T = any>(userId: string, event: string, data: T): Promise<void> {
        const clientIds = this.getConnectedClients(userId);

        for (const clientId of clientIds) {
            await this.sendToClient(clientId, {
                event,
                data,
                timestamp: new Date().toISOString(),
                userId,
            });
        }
    }

    async sendEventToUsers<T = any>(userIds: string[], event: string, data: T): Promise<void> {
        const promises = userIds.map(userId =>
            this.sendEventToUser(userId, event, data)
        );
        await Promise.all(promises);
    }

    async broadcastEvent<T = any>(event: string, data: T): Promise<void> {
        const allUserIds = Array.from(this.userClientIds.keys());
        await this.sendEventToUsers(allUserIds, event, data);
    }

    getConnectedClients(userId: string): string[] {
        return Array.from(this.userClientIds.get(userId) || []);
    }

    isUserConnected(userId: string): boolean {
        const clients = this.userClientIds.get(userId);
        return !!clients && clients.size > 0;
    }

    private async sendToClient(clientId: string, data: any): Promise<void> {
        const client = this.clients.get(clientId);
        if (!client) {
            console.warn(`[WebSocket] Client ${clientId} introuvable`);
            return;
        }

        try {
            if (client.ws.readyState === WebSocket.OPEN) {
                const message = JSON.stringify(data);
                client.ws.send(message);
            } else {
                console.warn(`[WebSocket] Client ${clientId} non connecté (readyState: ${client.ws.readyState})`);
                this.unregisterClient(clientId);
            }
        } catch (error) {
            console.error(`[WebSocket] Erreur envoi au client ${clientId}:`, error);
            this.unregisterClient(clientId);
        }
    }

    async sendKeepAlive(): Promise<void> {
        const allClientIds = Array.from(this.clients.keys());
        
        for (const clientId of allClientIds) {
            try {
                await this.sendToClient(clientId, {
                    event: 'ping',
                    data: { timestamp: new Date().toISOString() },
                });
            } catch (error) {
                // Client déconnecté, sera nettoyé
            }
        }
    }

    private startKeepAlive(): void {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
        }

        this.pingInterval = setInterval(() => {
            this.sendKeepAlive().catch(console.error);
        }, 30000);
    }

    shutdown(): void {
        console.log('[WebSocket] Arrêt du service...');
        
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }

        const allClientIds = Array.from(this.clients.keys());
        for (const clientId of allClientIds) {
            this.unregisterClient(clientId);
        }

        console.log('[WebSocket] Service arrêté');
    }

    getStats() {
        return {
            totalClients: this.clients.size,
            totalUsers: this.userClientIds.size,
            userConnections: Array.from(this.userClientIds.entries()).map(([userId, clients]) => ({
                userId,
                clientCount: clients.size,
                clientIds: Array.from(clients),
            })),
        };
    }
}
