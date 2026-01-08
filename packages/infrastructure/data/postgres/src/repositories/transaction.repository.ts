import { eq, desc, or } from 'drizzle-orm';
import { Repository, TOKENS } from '@workspace/shared/di';
import type { ITransactionRepository } from '@workspace/application/ports';
import { Transaction, TransactionType, TransactionStatus } from '@workspace/domain/entities';
import { Money } from '@workspace/domain/value-objects';
import { getDatabase } from '../database';
import { transactions } from '../schema';

@Repository(TOKENS.ITransactionRepository)
export class PostgresTransactionRepository implements ITransactionRepository {
  private get db() {
    return getDatabase();
  }

  async findById(id: string): Promise<Transaction | null> {
    const result = await this.db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id))
      .limit(1);

    if (result.length === 0) return null;

    return this.rowToEntity(result[0]!);
  }

  async findByAccountId(accountId: string): Promise<Transaction[]> {
    const result = await this.db
      .select()
      .from(transactions)
      .where(
        or(
          eq(transactions.fromAccountId, accountId),
          eq(transactions.toAccountId, accountId)
        )
      )
      .orderBy(desc(transactions.createdAt));

    return result.map(row => this.rowToEntity(row));
  }

  async findByAccountIdPaginated(
    accountId: string,
    limit: number,
    offset: number
  ): Promise<Transaction[]> {
    const result = await this.db
      .select()
      .from(transactions)
      .where(
        or(
          eq(transactions.fromAccountId, accountId),
          eq(transactions.toAccountId, accountId)
        )
      )
      .orderBy(desc(transactions.createdAt))
      .limit(limit)
      .offset(offset);

    return result.map(row => this.rowToEntity(row));
  }

  async save(transaction: Transaction): Promise<Transaction> {
    const values = {
      id: transaction.id,
      fromAccountId: transaction.fromAccountId,
      toAccountId: transaction.toAccountId,
      type: transaction.type,
      status: transaction.status,
      amount: transaction.amount.getAmount().toString(),
      description: transaction.description || null,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };

    await this.db
      .insert(transactions)
      .values(values)
      .onConflictDoUpdate({
        target: transactions.id,
        set: values,
      });

    return transaction;
  }

  private rowToEntity(row: typeof transactions.$inferSelect): Transaction {
    return Transaction.fromPersistence({
      id: row.id,
      fromAccountId: row.fromAccountId,
      toAccountId: row.toAccountId,
      amount: Money.fromAmount(parseFloat(row.amount)),
      type: row.type as TransactionType,
      status: row.status as TransactionStatus,
      description: row.description || undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
