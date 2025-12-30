import { IOrderRepository } from '@workspace/application/ports';
import { Order, OrderType, OrderStatus } from '@workspace/domain/entities';
import { Repository, TOKENS } from '@workspace/shared/di';

@Repository(TOKENS.IOrderRepository)
export class InMemoryOrderRepository implements IOrderRepository {
    private orders: Map<string, Order> = new Map();

    async findById(id: string): Promise<Order | null> {
        return this.orders.get(id) || null;
    }

    async findByUserId(userId: string): Promise<Order[]> {
        return Array.from(this.orders.values())
            .filter((order) => order.userId === userId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    async findByStockId(stockId: string): Promise<Order[]> {
        return Array.from(this.orders.values())
            .filter((order) => order.stockId === stockId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    async findPendingByStock(stockId: string, type: OrderType): Promise<Order[]> {
        return Array.from(this.orders.values())
            .filter(
                (order) =>
                    order.stockId === stockId &&
                    order.type === type &&
                    (order.status === OrderStatus.PENDING ||
                        order.status === OrderStatus.PARTIALLY_FILLED)
            )
            .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }

    async save(order: Order): Promise<Order> {
        this.orders.set(order.id, order);
        return order;
    }
}
