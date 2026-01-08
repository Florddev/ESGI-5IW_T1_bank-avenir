import { eq, and } from 'drizzle-orm';
import { Repository, TOKENS } from '@workspace/shared/di';
import type { IPortfolioRepository } from '@workspace/application/ports';
import { Portfolio } from '@workspace/domain/entities';
import { Money } from '@workspace/domain/value-objects';
import { getDatabase } from '../database';
import { portfolios } from '../schema';

@Repository(TOKENS.IPortfolioRepository)
export class PostgresPortfolioRepository implements IPortfolioRepository {
  private get db() {
    return getDatabase();
  }

  async findById(id: string): Promise<Portfolio | null> {
    const result = await this.db
      .select()
      .from(portfolios)
      .where(eq(portfolios.id, id))
      .limit(1);

    if (result.length === 0) return null;

    return this.rowToEntity(result[0]!);
  }

  async findByUserId(userId: string): Promise<Portfolio[]> {
    const result = await this.db
      .select()
      .from(portfolios)
      .where(eq(portfolios.userId, userId));

    return result.map(row => this.rowToEntity(row));
  }

  async findByUserIdAndStockId(userId: string, stockId: string): Promise<Portfolio | null> {
    const result = await this.db
      .select()
      .from(portfolios)
      .where(
        and(
          eq(portfolios.userId, userId),
          eq(portfolios.stockId, stockId)
        )
      )
      .limit(1);

    if (result.length === 0) return null;

    return this.rowToEntity(result[0]!);
  }

  async save(portfolio: Portfolio): Promise<Portfolio> {
    const values = {
      id: portfolio.id,
      userId: portfolio.userId,
      stockId: portfolio.stockId,
      quantity: portfolio.quantity,
      averagePurchasePrice: portfolio.averagePurchasePrice.getAmount().toString(),
      createdAt: portfolio.createdAt,
      updatedAt: portfolio.updatedAt,
    };

    await this.db
      .insert(portfolios)
      .values(values)
      .onConflictDoUpdate({
        target: portfolios.id,
        set: values,
      });

    return portfolio;
  }

  async update(portfolio: Portfolio): Promise<Portfolio> {
    await this.db
      .update(portfolios)
      .set({
        quantity: portfolio.quantity,
        averagePurchasePrice: portfolio.averagePurchasePrice.getAmount().toString(),
        updatedAt: portfolio.updatedAt,
      })
      .where(eq(portfolios.id, portfolio.id));

    return portfolio;
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(portfolios).where(eq(portfolios.id, id));
  }

  private rowToEntity(row: typeof portfolios.$inferSelect): Portfolio {
    return Portfolio.fromPersistence({
      id: row.id,
      userId: row.userId,
      stockId: row.stockId,
      quantity: row.quantity,
      averagePurchasePrice: Money.fromAmount(parseFloat(row.averagePurchasePrice)),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
