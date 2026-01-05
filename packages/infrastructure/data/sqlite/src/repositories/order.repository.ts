import { IOrderRepository } from '@workspace/application/ports';
import { Order, OrderType, OrderStatus, Money } from '@workspace/domain';
import { Repository, TOKENS } from '@workspace/shared/di';
import { db } from '../database';

interface OrderRow {
    id: string;
    user_id: string;
    stock_id: string;
    type: string;
    quantity: number;
    price: number;
    status: string;
    created_at: number;
    updated_at: number;
}

@Repository(TOKENS.IOrderRepository)
export class SqliteOrderRepository implements IOrderRepository {
    private rowToOrder(row: OrderRow): Order {
        return Order.fromPersistence({
            id: row.id,
            userId: row.user_id,
            stockId: row.stock_id,
            type: row.type as OrderType,
            quantity: row.quantity,
            price: Money.fromAmount(row.price),
            status: row.status as OrderStatus,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at),
        });
    }

    async findById(id: string): Promise<Order | null> {
        const stmt = db.prepare('SELECT * FROM orders WHERE id = ?');
        const row = stmt.get(id) as OrderRow | undefined;
        return row ? this.rowToOrder(row) : null;
    }

    async findByUserId(userId: string): Promise<Order[]> {
        const stmt = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC');
        const rows = stmt.all(userId) as OrderRow[];
        return rows.map((row) => this.rowToOrder(row));
    }

    async findAll(): Promise<Order[]> {
        const stmt = db.prepare('SELECT * FROM orders ORDER BY created_at DESC');
        const rows = stmt.all() as OrderRow[];
        return rows.map((row) => this.rowToOrder(row));
    }

    async findPending(): Promise<Order[]> {
        const stmt = db.prepare('SELECT * FROM orders WHERE status = ? ORDER BY created_at ASC');
        const rows = stmt.all(OrderStatus.PENDING) as OrderRow[];
        return rows.map((row) => this.rowToOrder(row));
    }

    async save(order: Order): Promise<Order> {
        const stmt = db.prepare(`
            INSERT INTO orders (id, user_id, stock_id, type, quantity, price, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run(
            order.id,
            order.userId,
            order.stockId,
            order.type,
            order.quantity,
            order.price.getAmount(),
            order.status,
            order.createdAt.getTime(),
            order.updatedAt.getTime()
        );
        
        return order;
    }

    async update(order: Order): Promise<Order> {
        const stmt = db.prepare(`
            UPDATE orders
            SET status = ?, updated_at = ?
            WHERE id = ?
        `);
        
        stmt.run(order.status, order.updatedAt.getTime(), order.id);
        
        return order;
    }

    async delete(id: string): Promise<void> {
        const stmt = db.prepare('DELETE FROM orders WHERE id = ?');
        stmt.run(id);
    }
}
