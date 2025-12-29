import { BaseClient } from './base.client';
import { RoutesConfigService } from './config/routes.config';
import type { NotificationDto } from '@workspace/application/dtos';

export class NotificationsClient extends BaseClient {
    private routesConfig: RoutesConfigService;

    constructor(routesConfig?: RoutesConfigService) {
        super();
        this.routesConfig = routesConfig || RoutesConfigService.getShared();
    }

    private static instance: NotificationsClient | null = null;

    static configure(routesConfig?: RoutesConfigService): void {
        if (NotificationsClient.instance) {
            throw new Error('NotificationsClient already initialized. Call configure() before first use.');
        }
        NotificationsClient.instance = new NotificationsClient(routesConfig);
    }

    static getInstance(): NotificationsClient {
        if (!NotificationsClient.instance) {
            NotificationsClient.instance = new NotificationsClient();
        }
        return NotificationsClient.instance;
    }

    static resetInstance(): void {
        NotificationsClient.instance = null;
    }

    async getUserNotifications(userId: string): Promise<NotificationDto[]> {
        const routes = this.routesConfig.getNotificationsRoutes();
        return this.get<NotificationDto[]>(`${routes.list}?userId=${userId}`);
    }

    async markAsRead(notificationId: string): Promise<NotificationDto> {
        const routes = this.routesConfig.getNotificationsRoutes();
        return this.put<NotificationDto>(routes.markAsRead.replace(':id', notificationId), {});
    }
}

export function getNotificationsClient(): NotificationsClient {
    return NotificationsClient.getInstance();
}
