export interface IRealtimeService {
    sendEventToUser<T = any>(userId: string, event: string, data: T): Promise<void>;
    sendEventToUsers<T = any>(userIds: string[], event: string, data: T): Promise<void>;
    broadcastEvent<T = any>(event: string, data: T): Promise<void>;
    registerClient(userId: string, clientId: string, connectionContext?: any): void;
    unregisterClient(clientId: string): void;
    getConnectedClients(userId: string): string[];
    isUserConnected(userId: string): boolean;
    shutdown?(): Promise<void>;
}
