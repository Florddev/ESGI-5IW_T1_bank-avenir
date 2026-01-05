import { BaseClient, ApiClient } from '@workspace/adapter-common/client';
import { RoutesConfigService, getRoute } from '../config/routes.config';

@ApiClient()
export class RealtimeClient extends BaseClient {
    private routes: ReturnType<RoutesConfigService['getRealtimeRoutes']>;

    constructor(routesConfig?: RoutesConfigService) {
        super();
        this.routes = routesConfig?.getRealtimeRoutes();
    }

    async sendNotification(userId: string, type: string, title: string, message: string): Promise<any> {
        const route = getRoute(this.routes?.notify, '/api/realtime/notify');
        return this.post<any>(route, {
            userId,
            type,
            title,
            message,
        });
    }

    async getStats(userId?: string): Promise<any> {
        const route = getRoute(this.routes?.stats, '/api/realtime/stats');
        const url = userId 
            ? `${route}?userId=${userId}`
            : route;
        return this.get<any>(url);
    }

    /**
     * Crée une connexion EventSource pour recevoir des événements en temps réel
     * Utilise Server-Sent Events (SSE)
     * 
     * @param userId L'ID de l'utilisateur
     * @param clientId L'ID du client (optionnel, sera généré automatiquement si non fourni)
     * @returns EventSource instance pour écouter les événements
     */
    connectSSE(userId: string, clientId?: string): EventSource {
        const route = getRoute(this.routes?.sse, '/api/realtime/sse');
        const params = new URLSearchParams({ userId });
        if (clientId) {
            params.set('clientId', clientId);
        }
        
        const url = `${route}?${params.toString()}`;
        return new EventSource(url);
    }
}

export function getRealtimeClient(): RealtimeClient {
    return RealtimeClient.getInstance();
}
