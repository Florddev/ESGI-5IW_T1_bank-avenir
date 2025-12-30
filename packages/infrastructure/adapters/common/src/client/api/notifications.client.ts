import { BaseClient, ApiClient } from '@workspace/adapter-common/client';
import { RoutesConfigService, getRoute } from '../config/routes.config';
import type { NotificationDto } from '@workspace/application/dtos';

@ApiClient()
export class NotificationsClient extends BaseClient {
    private routesConfig: RoutesConfigService;
    private routes: ReturnType<RoutesConfigService['getNotificationsRoutes']>;

    constructor(routesConfig?: RoutesConfigService) {
        super();
        this.routesConfig = routesConfig || RoutesConfigService.getShared();
        this.routes = this.routesConfig.getNotificationsRoutes();
    }

    async getUserNotifications(userId: string): Promise<NotificationDto[]> {
        const route = getRoute(this.routes.list, '/api/notifications');
        return this.get<NotificationDto[]>(`${route}?userId=${userId}`);
    }

    async markAsRead(notificationId: string): Promise<NotificationDto> {
        const route = getRoute(this.routes.markAsRead, '/api/notifications/:id/read');
        return this.put<NotificationDto>(route.replace(':id', notificationId), {});
    }
}

export function getNotificationsClient(): NotificationsClient {
    return NotificationsClient.getInstance();
}
