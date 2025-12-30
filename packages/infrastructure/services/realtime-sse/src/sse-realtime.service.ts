import { injectable } from 'tsyringe';
import { IRealtimeService } from '@workspace/application/ports';

interface SSEClient {
    userId: string;
    clientId: string;
    response: any; // Response object from Next.js/Express
    controller: ReadableStreamDefaultController;
}

/**
 * Implémentation Server-Sent Events (SSE) du service de temps réel GÉNÉRIQUE
 * Supporte tous types d'événements : notifications, messages, transactions, etc.
 * SSE est unidirectionnel (serveur → client) et basé sur HTTP
 */
@injectable()
export class SSERealtimeService implements IRealtimeService {
    private clients: Map<string, SSEClient> = new Map();
    private userClientIds: Map<string, Set<string>> = new Map();

    registerClient(userId: string, clientId: string): void {
        // Will be called from API route with response object
        if (!this.userClientIds.has(userId)) {
            this.userClientIds.set(userId, new Set());
        }
        this.userClientIds.get(userId)!.add(clientId);
    }

    /**
     * Enregistre un client SSE avec son stream
     */
    registerSSEClient(
        userId: string,
        clientId: string,
        response: any,
        controller: ReadableStreamDefaultController
    ): void {
        const client: SSEClient = {
            userId,
            clientId,
            response,
            controller,
        };

        this.clients.set(clientId, client);
        this.registerClient(userId, clientId);

        console.log(`[SSE] Client ${clientId} connecté pour utilisateur ${userId}`);
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
            this.clients.delete(clientId);
            console.log(`[SSE] Client ${clientId} déconnecté`);
        }
    }

    /**
     * Envoie un événement générique à un utilisateur
     * Exemples : 
     * - sendEventToUser(userId, 'notification', notificationDto)
     * - sendEventToUser(userId, 'message_new', messageDto)
     * - sendEventToUser(userId, 'transaction_completed', transactionDto)
     */
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

    /**
     * Envoie un événement à plusieurs utilisateurs
     */
    async sendEventToUsers<T = any>(userIds: string[], event: string, data: T): Promise<void> {
        const promises = userIds.map(userId =>
            this.sendEventToUser(userId, event, data)
        );
        await Promise.all(promises);
    }

    /**
     * Diffuse un événement à tous les utilisateurs connectés
     */
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

    /**
     * Envoie un événement SSE à un client spécifique
     */
    private async sendToClient(clientId: string, data: any): Promise<void> {
        const client = this.clients.get(clientId);
        if (!client) {
            console.warn(`[SSE] Client ${clientId} introuvable`);
            return;
        }

        try {
            const sseMessage = this.formatSSEMessage(data);
            const encoder = new TextEncoder();
            client.controller.enqueue(encoder.encode(sseMessage));
        } catch (error) {
            console.error(`[SSE] Erreur envoi au client ${clientId}:`, error);
            this.unregisterClient(clientId);
        }
    }

    /**
     * Formate un message au format SSE
     * Format: data: {json}\n\n
     */
    private formatSSEMessage(data: any): string {
        return `data: ${JSON.stringify(data)}\n\n`;
    }

    /**
     * Envoie un ping keep-alive à tous les clients
     */
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

    /**
     * Récupère les statistiques de connexion
     */
    getStats() {
        return {
            totalClients: this.clients.size,
            totalUsers: this.userClientIds.size,
            userConnections: Array.from(this.userClientIds.entries()).map(([userId, clients]) => ({
                userId,
                clientCount: clients.size,
            })),
        };
    }
}
