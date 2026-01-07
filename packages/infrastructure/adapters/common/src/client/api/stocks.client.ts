import { BaseClient, ApiClient } from '@workspace/adapter-common/client';
import { RoutesConfig, RoutesConfigService, getRoute } from '../config/routes.config';
import type { StockDto } from '@workspace/application/dtos';

@ApiClient()
export class StocksClient extends BaseClient {
    private routesConfig: RoutesConfigService;
    private routes: RoutesConfig['stocks'] | undefined;

    constructor(routesConfig?: RoutesConfigService) {
        super();
        this.routesConfig = routesConfig || RoutesConfigService.getShared();
        this.routes = this.routesConfig.getStocksRoutes();
    }

    async getAllStocks(): Promise<StockDto[]> {
        return this.get<StockDto[]>(getRoute(this.routes?.list, '/api/stocks'));
    }

    async createStock(data: { symbol: string; companyName: string }): Promise<StockDto> {
        const route = getRoute(this.routes?.create, '/api/stocks');
        return this.post<StockDto>(route, data);
    }

    async getStock(stockId: string): Promise<StockDto> {
        const route = getRoute(this.routes?.get, '/api/stocks/:id');
        return this.get<StockDto>(route.replace(':id', stockId));
    }

    async getUserPortfolio(): Promise<any> {
        const route = getRoute(this.routes?.portfolio, '/api/portfolio');
        return this.get<any>(route);
    }

    async buyStock(stockId: string, data: { accountId: string; quantity: number }): Promise<any> {
        const route = getRoute(this.routes?.buy, '/api/stocks/:id/buy');
        return this.post<any>(route.replace(':id', stockId), data);
    }

    async sellStock(stockId: string, data: { accountId: string; quantity: number }): Promise<any> {
        const route = getRoute(this.routes?.sell, '/api/stocks/:id/sell');
        return this.post<any>(route.replace(':id', stockId), data);
    }

    async updateStock(stockId: string, data: { companyName?: string; makeAvailable?: boolean }): Promise<StockDto> {
        const route = getRoute(this.routes?.update, '/api/stocks/:id');
        return this.put<StockDto>(route.replace(':id', stockId), data);
    }

    async deleteStock(stockId: string): Promise<void> {
        const route = getRoute(this.routes?.delete, '/api/stocks/:id');
        await this.delete(route.replace(':id', stockId));
    }

    async toggleStockAvailability(stockId: string, data: { available: boolean }): Promise<StockDto> {
        const route = getRoute(this.routes?.update, '/api/stocks/:id');
        return this.put<StockDto>(route.replace(':id', stockId), { makeAvailable: data.available });
    }

    async matchOrders(stockId: string): Promise<any> {
        const route = getRoute(this.routes?.matchOrders, '/api/stocks/match-orders');
        return this.post<any>(route, { stockId });
    }

    async calculateEquilibriumPrice(stockId: string): Promise<any> {
        const route = getRoute(this.routes?.matchOrders, '/api/stocks/match-orders');
        return this.get<any>(`${route}?stockId=${stockId}`);
    }

    async placeOrder(data: { stockId: string; type: 'BUY' | 'SELL'; quantity: number; pricePerShare: number }): Promise<any> {
        const route = getRoute(this.routes?.placeOrder, '/api/stocks/orders');
        return this.post<any>(route, data);
    }
}

export function getStocksClient(): StocksClient {
    return StocksClient.getInstance();
}
