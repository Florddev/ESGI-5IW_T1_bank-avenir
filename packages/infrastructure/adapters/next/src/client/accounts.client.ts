import { BaseClient } from './base.client';
import { RoutesConfigService } from './config/routes.config';
import type { AccountDto, CreateAccountDto, UpdateAccountNameDto } from '@workspace/application/dtos';

export class AccountsClient extends BaseClient {
    private routesConfig: RoutesConfigService;

    constructor(routesConfig?: RoutesConfigService) {
        super();
        this.routesConfig = routesConfig || RoutesConfigService.getShared();
    }

    private static instance: AccountsClient | null = null;

    static configure(routesConfig?: RoutesConfigService): void {
        if (AccountsClient.instance) {
            throw new Error('AccountsClient already initialized. Call configure() before first use.');
        }
        AccountsClient.instance = new AccountsClient(routesConfig);
    }

    static getInstance(): AccountsClient {
        if (!AccountsClient.instance) {
            AccountsClient.instance = new AccountsClient();
        }
        return AccountsClient.instance;
    }

    static resetInstance(): void {
        AccountsClient.instance = null;
    }

    async getUserAccounts(userId: string): Promise<AccountDto[]> {
        const routes = this.routesConfig.getAccountsRoutes();
        return this.get<AccountDto[]>(`${routes.list}?userId=${userId}`);
    }

    async getAccount(accountId: string): Promise<AccountDto> {
        const routes = this.routesConfig.getAccountsRoutes();
        return this.get<AccountDto>(routes.get.replace(':id', accountId));
    }

    async createAccount(data: CreateAccountDto): Promise<AccountDto> {
        const routes = this.routesConfig.getAccountsRoutes();
        return this.post<AccountDto>(routes.create, data);
    }

    async updateAccountName(accountId: string, customName: string): Promise<AccountDto> {
        const routes = this.routesConfig.getAccountsRoutes();
        return this.put<AccountDto>(routes.updateName.replace(':id', accountId), { customName });
    }

    async deleteAccount(accountId: string): Promise<{ message: string }> {
        const routes = this.routesConfig.getAccountsRoutes();
        return this.delete<{ message: string }>(routes.delete.replace(':id', accountId));
    }
}

export function getAccountsClient(): AccountsClient {
    return AccountsClient.getInstance();
}
