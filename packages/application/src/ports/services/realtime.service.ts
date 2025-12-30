/**
 * Service de communication temps réel générique.
 * Supporte tous types d'événements : notifications, messages, transactions, etc.
 */
export interface IRealtimeService {
    /**
     * Envoie un événement à un utilisateur spécifique
     * @param userId - ID de l'utilisateur cible
     * @param event - Type d'événement (notification, message, transaction, etc.)
     * @param data - Données de l'événement
     */
    sendEventToUser<T = any>(userId: string, event: string, data: T): Promise<void>;

    /**
     * Envoie un événement à plusieurs utilisateurs
     * @param userIds - IDs des utilisateurs cibles
     * @param event - Type d'événement
     * @param data - Données de l'événement
     */
    sendEventToUsers<T = any>(userIds: string[], event: string, data: T): Promise<void>;

    /**
     * Diffuse un événement à tous les clients connectés
     * @param event - Type d'événement
     * @param data - Données de l'événement
     */
    broadcastEvent<T = any>(event: string, data: T): Promise<void>;

    /**
     * Enregistre un client SSE/WebSocket
     */
    registerClient(userId: string, clientId: string): void;

    /**
     * Désinscrit un client
     */
    unregisterClient(clientId: string): void;

    /**
     * Obtient la liste des clients connectés pour un utilisateur
     */
    getConnectedClients(userId: string): string[];

    /**
     * Vérifie si un utilisateur est connecté
     */
    isUserConnected(userId: string): boolean;
}
