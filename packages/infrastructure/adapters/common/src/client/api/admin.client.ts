import { BaseClient, ApiClient } from '@workspace/adapter-common/client';
import { RoutesConfig, RoutesConfigService, getRoute } from '../config/routes.config';
import type { UserDto } from '@workspace/application/dtos';

@ApiClient()
export class AdminClient extends BaseClient {
    private routesConfig: RoutesConfigService;
    private routes: RoutesConfig['admin'] | undefined;

    constructor(routesConfig?: RoutesConfigService) {
        super();
        this.routesConfig = routesConfig || RoutesConfigService.getShared();
        this.routes = this.routesConfig.getAdminRoutes();
    }

    async getAllUsers(): Promise<UserDto[]> {
        return this.get<UserDto[]>(
            getRoute(this.routes?.getAllUsers, '/api/admin/users')
        );
    }

    async createUser(data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role: string;
    }): Promise<UserDto> {
        return this.post<UserDto>(
            getRoute(this.routes?.createUser, '/api/admin/users'),
            data
        );
    }

    async updateUser(
        userId: string,
        data: {
        firstName?: string;
        lastName?: string;
        email?: string;
        },
    ): Promise<UserDto> {
        const route = getRoute(this.routes?.updateUser, '/api/admin/users/:id');
        return this.put<UserDto>(route.replace(':id', userId), data);
    }

    async deleteUser(userId: string): Promise<void> {
        const route = getRoute(this.routes?.deleteUser, '/api/admin/users/:id');
        await this.delete(route.replace(':id', userId));
    }

    async banUser(userId: string, reason?: string): Promise<UserDto> {
        const route = getRoute(this.routes?.banUser, '/api/admin/users/:id/ban');
        return this.post<UserDto>(route.replace(':id', userId), {
            reason,
        });
    }

    async updateSavingsRate(newRate: number): Promise<{ message: string }> {
        return this.patch<{ message: string }>(
            getRoute(this.routes?.updateSavingsRate, '/api/admin/savings/rate'),
            { newRate }
        );
    }

    async applySavingsInterest(): Promise<{ processed: number; message: string }> {
        return this.post<{ processed: number; message: string }>(
            getRoute(this.routes?.applySavingsInterest, '/api/admin/savings/apply-interest')
        );
    }
}

export function getAdminClient(): AdminClient {
    return AdminClient.getInstance();
}
