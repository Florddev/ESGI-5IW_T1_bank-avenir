import { BaseClient } from './base.client';
import { RoutesConfigService } from './config/routes.config';
import type { StockDto } from '@workspace/application/dtos';

export class StocksClient extends BaseClient {
    private routesConfig: RoutesConfigService;

    constructor(routesConfig?: RoutesConfigService) {
        super();
        this.routesConfig = routesConfig || RoutesConfigService.getShared();
    }

    private static instance: StocksClient | null = null;

    static configure(routesConfig?: RoutesConfigService): void {
        if (StocksClient.instance) {
            throw new Error('StocksClient already initialized. Call configure() before first use.');
        }
        StocksClient.instance = new StocksClient(routesConfig);
    }

    static getInstance(): StocksClient {
        if (!StocksClient.instance) {
            StocksClient.instance = new StocksClient();
        }
        return StocksClient.instance;
    }

    static resetInstance(): void {
        StocksClient.instance = null;
    }

    async getAllStocks(): Promise<StockDto[]> {
        const routes = this.routesConfig.getStocksRoutes();
        return this.get<StockDto[]>(routes.list);
    }

    async getStock(stockId: string): Promise<StockDto> {
        const routes = this.routesConfig.getStocksRoutes();
        return this.get<StockDto>(routes.get.replace(':id', stockId));
    }

    async getUserPortfolio(userId: string): Promise<any[]> {
        const routes = this.routesConfig.getStocksRoutes();
        return this.get<any[]>(routes.portfolio.replace(':userId', userId));
    }

    async buyStock(stockId: string, data: { accountId: string; quantity: number }): Promise<any> {
        const routes = this.routesConfig.getStocksRoutes();
        return this.post<any>(routes.buy.replace(':id', stockId), data);
    }

    async sellStock(stockId: string, data: { accountId: string; quantity: number }): Promise<any> {
        const routes = this.routesConfig.getStocksRoutes();
        return this.post<any>(routes.sell.replace(':id', stockId), data);
    }
}

export function getStocksClient(): StocksClient {
    return StocksClient.getInstance();
}
