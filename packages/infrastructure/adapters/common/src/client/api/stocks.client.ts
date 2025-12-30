import { BaseClient, ApiClient } from '@workspace/adapter-common/client';
import { RoutesConfigService, getRoute } from '../config/routes.config';
import type { StockDto } from '@workspace/application/dtos';

@ApiClient()
export class StocksClient extends BaseClient {
    private routesConfig: RoutesConfigService;
    private routes: ReturnType<RoutesConfigService['getStocksRoutes']>;

    constructor(routesConfig?: RoutesConfigService) {
        super();
        this.routesConfig = routesConfig || RoutesConfigService.getShared();
        this.routes = this.routesConfig.getStocksRoutes();
    }

    async getAllStocks(): Promise<StockDto[]> {
        return this.get<StockDto[]>(getRoute(this.routes.list, '/api/stocks'));
    }

    async getStock(stockId: string): Promise<StockDto> {
        const route = getRoute(this.routes.get, '/api/stocks/:id');
        return this.get<StockDto>(route.replace(':id', stockId));
    }

    async getUserPortfolio(userId: string): Promise<any[]> {
        const route = getRoute(this.routes.portfolio, '/api/stocks/portfolio/:userId');
        return this.get<any[]>(route.replace(':userId', userId));
    }

    async buyStock(stockId: string, data: { accountId: string; quantity: number }): Promise<any> {
        const route = getRoute(this.routes.buy, '/api/stocks/:id/buy');
        return this.post<any>(route.replace(':id', stockId), data);
    }

    async sellStock(stockId: string, data: { accountId: string; quantity: number }): Promise<any> {
        const route = getRoute(this.routes.sell, '/api/stocks/:id/sell');
        return this.post<any>(route.replace(':id', stockId), data);
    }
}

export function getStocksClient(): StocksClient {
    return StocksClient.getInstance();
}
