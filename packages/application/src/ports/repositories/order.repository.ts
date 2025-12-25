import { Order, OrderType } from '@workspace/domain/entities';

export interface IOrderRepository {
    findById(id: string): Promise<Order | null>;
    findByUserId(userId: string): Promise<Order[]>;
    findByStockId(stockId: string): Promise<Order[]>;
    findPendingByStock(stockId: string, type: OrderType): Promise<Order[]>;
    save(order: Order): Promise<Order>;
}
