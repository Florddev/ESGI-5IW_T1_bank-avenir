import { BaseClient } from './base.client';
import { RoutesConfigService } from './config/routes.config';
import type { TransactionDto, DepositMoneyDto, WithdrawMoneyDto, TransferMoneyDto } from '@workspace/application/dtos';

export class TransactionsClient extends BaseClient {
    private routesConfig: RoutesConfigService;

    constructor(routesConfig?: RoutesConfigService) {
        super();
        this.routesConfig = routesConfig || RoutesConfigService.getShared();
    }

    private static instance: TransactionsClient | null = null;

    static configure(routesConfig?: RoutesConfigService): void {
        if (TransactionsClient.instance) {
            throw new Error('TransactionsClient already initialized. Call configure() before first use.');
        }
        TransactionsClient.instance = new TransactionsClient(routesConfig);
    }

    static getInstance(): TransactionsClient {
        if (!TransactionsClient.instance) {
            TransactionsClient.instance = new TransactionsClient();
        }
        return TransactionsClient.instance;
    }

    static resetInstance(): void {
        TransactionsClient.instance = null;
    }

    async getAccountTransactions(accountId: string): Promise<TransactionDto[]> {
        const routes = this.routesConfig.getTransactionsRoutes();
        return this.get<TransactionDto[]>(routes.list.replace(':accountId', accountId));
    }

    async deposit(data: DepositMoneyDto): Promise<TransactionDto> {
        const routes = this.routesConfig.getTransactionsRoutes();
        return this.post<TransactionDto>(routes.deposit, data);
    }

    async withdraw(data: WithdrawMoneyDto): Promise<TransactionDto> {
        const routes = this.routesConfig.getTransactionsRoutes();
        return this.post<TransactionDto>(routes.withdraw, data);
    }

    async transfer(data: TransferMoneyDto): Promise<TransactionDto> {
        const routes = this.routesConfig.getTransactionsRoutes();
        return this.post<TransactionDto>(routes.transfer, data);
    }
}

export function getTransactionsClient(): TransactionsClient {
    return TransactionsClient.getInstance();
}
