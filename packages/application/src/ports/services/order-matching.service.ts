import { Order } from '@workspace/domain/entities';

export interface MatchResult {
    buyOrder: Order;
    sellOrder: Order;
    quantity: number;
    price: number;
}

export interface IOrderMatchingService {
    matchOrders(stockId: string): Promise<MatchResult[]>;
    calculateCurrentPrice(stockId: string): Promise<number | null>;
}
