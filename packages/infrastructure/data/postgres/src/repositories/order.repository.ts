import { eq, and, or } from 'drizzle-orm';
import { Repository, TOKENS } from '@workspace/shared/di';
import type { IOrderRepository } from '@workspace/application/ports';
import { Order, OrderType, OrderStatus } from '@workspace/domain/entities';
import { Money } from '@workspace/domain/value-objects';
import { getDatabase } from '../database';
import { orders } from '../schema';

@Repository(TOKENS.IOrderRepository)
export class PostgresOrderRepository implements IOrderRepository {
  private get db() {
    return getDatabase();
  }

  async findById(id: string): Promise<Order | null> {
    const result = await this.db
      .select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1);

    if (result.length === 0) return null;

    return this.rowToEntity(result[0]!);
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const result = await this.db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId));

    return result.map(row => this.rowToEntity(row));
  }

  async findByStockId(stockId: string): Promise<Order[]> {
    const result = await this.db
      .select()
      .from(orders)
      .where(eq(orders.stockId, stockId));

    return result.map(row => this.rowToEntity(row));
  }

  async findPendingByStock(stockId: string, type: OrderType): Promise<Order[]> {
    const result = await this.db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.stockId, stockId),
          eq(orders.type, type),
          or(
            eq(orders.status, 'PENDING'),
            eq(orders.status, 'PARTIALLY_FILLED')
          )
        )
      );

    return result.map(row => this.rowToEntity(row));
  }

  async save(order: Order): Promise<Order> {
    const values = {
      id: order.id,
      userId: order.userId,
      stockId: order.stockId,
      type: order.type,
      quantity: order.quantity,
      pricePerShare: order.pricePerShare.getAmount().toString(),
      remainingQuantity: order.remainingQuantity,
      fees: order.fees.getAmount().toString(),
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };

    await this.db
      .insert(orders)
      .values(values)
      .onConflictDoUpdate({
        target: orders.id,
        set: values,
      });

    return order;
  }

  private rowToEntity(row: typeof orders.$inferSelect): Order {
    return Order.fromPersistence({
      id: row.id,
      userId: row.userId,
      stockId: row.stockId,
      type: row.type as OrderType,
      quantity: row.quantity,
      pricePerShare: Money.fromAmount(parseFloat(row.pricePerShare)),
      remainingQuantity: row.remainingQuantity,
      fees: Money.fromAmount(parseFloat(row.fees)),
      status: row.status as OrderStatus,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
