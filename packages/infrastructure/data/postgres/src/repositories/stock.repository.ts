import { eq } from 'drizzle-orm';
import { Repository, TOKENS } from '@workspace/shared/di';
import type { IStockRepository } from '@workspace/application/ports';
import { Stock, StockStatus } from '@workspace/domain/entities';
import { Money } from '@workspace/domain/value-objects';
import { getDatabase } from '../database';
import { stocks } from '../schema';

@Repository(TOKENS.IStockRepository)
export class PostgresStockRepository implements IStockRepository {
  private get db() {
    return getDatabase();
  }

  async findById(id: string): Promise<Stock | null> {
    const result = await this.db
      .select()
      .from(stocks)
      .where(eq(stocks.id, id))
      .limit(1);

    if (result.length === 0) return null;

    return this.rowToEntity(result[0]!);
  }

  async findBySymbol(symbol: string): Promise<Stock | null> {
    const result = await this.db
      .select()
      .from(stocks)
      .where(eq(stocks.symbol, symbol.toUpperCase()))
      .limit(1);

    if (result.length === 0) return null;

    return this.rowToEntity(result[0]!);
  }

  async findAll(): Promise<Stock[]> {
    const result = await this.db.select().from(stocks);
    return result.map(row => this.rowToEntity(row));
  }

  async findAvailable(): Promise<Stock[]> {
    const result = await this.db
      .select()
      .from(stocks)
      .where(eq(stocks.status, 'AVAILABLE'));

    return result.map(row => this.rowToEntity(row));
  }

  async save(stock: Stock): Promise<Stock> {
    const values: any = {
      id: stock.id,
      symbol: stock.symbol,
      companyName: stock.companyName,
      status: stock.status,
      createdAt: stock.createdAt,
      updatedAt: stock.updatedAt,
    };

    if (stock.currentPrice) {
      values.currentPrice = stock.currentPrice.getAmount().toString();
    }

    await this.db
      .insert(stocks)
      .values(values)
      .onConflictDoUpdate({
        target: stocks.id,
        set: values,
      });

    return stock;
  }

  async update(stock: Stock): Promise<Stock> {
    const updates: any = {
      companyName: stock.companyName,
      status: stock.status,
      updatedAt: stock.updatedAt,
    };

    if (stock.currentPrice) {
      updates.currentPrice = stock.currentPrice.getAmount().toString();
    }

    await this.db
      .update(stocks)
      .set(updates)
      .where(eq(stocks.id, stock.id));

    return stock;
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(stocks).where(eq(stocks.id, id));
  }

  private rowToEntity(row: typeof stocks.$inferSelect): Stock {
    return Stock.fromPersistence({
      id: row.id,
      symbol: row.symbol,
      companyName: row.companyName,
      status: row.status as StockStatus,
      currentPrice: row.currentPrice ? Money.fromAmount(parseFloat(row.currentPrice)) : undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
