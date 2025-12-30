import { BaseClient, ApiClient } from '@workspace/adapter-common/client';
import { RoutesConfigService, getRoute } from '../config/routes.config';
import type { AccountDto, CreateAccountDto } from '@workspace/application/dtos';

@ApiClient()
export class AccountsClient extends BaseClient {
    private routesConfig: RoutesConfigService;
    private routes: ReturnType<RoutesConfigService['getAccountsRoutes']>;

    constructor(routesConfig?: RoutesConfigService) {
        super();
        this.routesConfig = routesConfig || RoutesConfigService.getShared();
        this.routes = this.routesConfig.getAccountsRoutes();
    }

    async getUserAccounts(): Promise<AccountDto[]> {
        const route = getRoute(this.routes.list, '/api/accounts');
        return this.get<AccountDto[]>(route);
    }

    async getAllAccounts(): Promise<AccountDto[]> {
        const route = getRoute(this.routes.list, '/api/accounts');
        return this.get<AccountDto[]>(route);
    }

    async getAccount(accountId: string): Promise<AccountDto> {
        const route = getRoute(this.routes.get, '/api/accounts/:id');
        return this.get<AccountDto>(route.replace(':id', accountId));
    }

    async createAccount(data: CreateAccountDto): Promise<AccountDto> {
        return this.post<AccountDto>(
            getRoute(this.routes.create, '/api/accounts'),
            data
        );
    }

    async updateAccountName(accountId: string, customName: string): Promise<AccountDto> {
        const route = getRoute(this.routes.updateName, '/api/accounts/:id/name');
        return this.put<AccountDto>(route.replace(':id', accountId), { customName });
    }

    async deleteAccount(accountId: string): Promise<{ message: string }> {
        const route = getRoute(this.routes.delete, '/api/accounts/:id');
        return this.delete<{ message: string }>(route.replace(':id', accountId));
    }
}

export function getAccountsClient(): AccountsClient {
    return AccountsClient.getInstance();
}
