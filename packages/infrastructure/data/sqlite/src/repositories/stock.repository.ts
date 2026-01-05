import { IStockRepository } from '@workspace/application/ports';
import { Stock, StockStatus, Money } from '@workspace/domain';
import { Repository, TOKENS } from '@workspace/shared/di';
import { db } from '../database';

interface StockRow {
    id: string;
    symbol: string;
    company_name: string;
    status: string;
    current_price: number | null;
    created_at: number;
    updated_at: number;
}

@Repository(TOKENS.IStockRepository)
export class SqliteStockRepository implements IStockRepository {
    private rowToStock(row: StockRow): Stock {
        return Stock.fromPersistence({
            id: row.id,
            symbol: row.symbol,
            companyName: row.company_name,
            status: row.status as StockStatus,
            currentPrice: row.current_price ? Money.fromAmount(row.current_price) : undefined,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at),
        });
    }

    async findById(id: string): Promise<Stock | null> {
        const stmt = db.prepare('SELECT * FROM stocks WHERE id = ?');
        const row = stmt.get(id) as StockRow | undefined;
        return row ? this.rowToStock(row) : null;
    }

    async findBySymbol(symbol: string): Promise<Stock | null> {
        const stmt = db.prepare('SELECT * FROM stocks WHERE symbol = ?');
        const row = stmt.get(symbol.toUpperCase()) as StockRow | undefined;
        return row ? this.rowToStock(row) : null;
    }

    async findAll(): Promise<Stock[]> {
        const stmt = db.prepare('SELECT * FROM stocks ORDER BY symbol ASC');
        const rows = stmt.all() as StockRow[];
        return rows.map((row) => this.rowToStock(row));
    }

    async findAvailable(): Promise<Stock[]> {
        const stmt = db.prepare('SELECT * FROM stocks WHERE status = ? ORDER BY symbol ASC');
        const rows = stmt.all(StockStatus.AVAILABLE) as StockRow[];
        return rows.map((row) => this.rowToStock(row));
    }

    async save(stock: Stock): Promise<Stock> {
        const stmt = db.prepare(`
            INSERT INTO stocks (id, symbol, company_name, status, current_price, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run(
            stock.id,
            stock.symbol,
            stock.companyName,
            stock.status,
            stock.currentPrice?.getAmount() || null,
            stock.createdAt.getTime(),
            stock.updatedAt.getTime()
        );
        
        return stock;
    }

    async update(stock: Stock): Promise<Stock> {
        const stmt = db.prepare(`
            UPDATE stocks
            SET symbol = ?, company_name = ?, status = ?, current_price = ?, updated_at = ?
            WHERE id = ?
        `);
        
        stmt.run(
            stock.symbol,
            stock.companyName,
            stock.status,
            stock.currentPrice?.getAmount() || null,
            stock.updatedAt.getTime(),
            stock.id
        );
        
        return stock;
    }

    async delete(id: string): Promise<void> {
        const stmt = db.prepare('DELETE FROM stocks WHERE id = ?');
        stmt.run(id);
    }
}
