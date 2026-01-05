import { BaseClient, ApiClient } from '@workspace/adapter-common/client';
import { RoutesConfig, RoutesConfigService, getRoute } from '../config/routes.config';
import type { TransactionDto, DepositMoneyDto, WithdrawMoneyDto, TransferMoneyDto } from '@workspace/application/dtos';

@ApiClient()
export class TransactionsClient extends BaseClient {
    private routesConfig: RoutesConfigService;
    private routes: RoutesConfig['transactions'] | undefined;

    constructor(routesConfig?: RoutesConfigService) {
        super();
        this.routesConfig = routesConfig || RoutesConfigService.getShared();
        this.routes = this.routesConfig.getTransactionsRoutes();
    }

    async getAccountTransactions(accountId: string): Promise<TransactionDto[]> {
        const route = getRoute(this.routes?.list, '/api/transactions/account/:accountId');
        return this.get<TransactionDto[]>(route.replace(':accountId', accountId));
    }

    async deposit(data: DepositMoneyDto): Promise<TransactionDto> {
        return this.post<TransactionDto>(
            getRoute(this.routes?.deposit, '/api/transactions/deposit'),
            data
        );
    }

    async withdraw(data: WithdrawMoneyDto): Promise<TransactionDto> {
        return this.post<TransactionDto>(
            getRoute(this.routes?.withdraw, '/api/transactions/withdraw'),
            data
        );
    }

    async transfer(data: TransferMoneyDto): Promise<TransactionDto> {
        return this.post<TransactionDto>(
            getRoute(this.routes?.transfer, '/api/transactions/transfer'),
            data
        );
    }
}

export function getTransactionsClient(): TransactionsClient {
    return TransactionsClient.getInstance();
}
