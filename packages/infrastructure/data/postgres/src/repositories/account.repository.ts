import { eq } from 'drizzle-orm';
import { Repository, TOKENS } from '@workspace/shared/di';
import type { IAccountRepository } from '@workspace/application/ports';
import { Account, AccountType } from '@workspace/domain/entities';
import { Money, Percentage, IBAN } from '@workspace/domain/value-objects';
import { getDatabase } from '../database';
import { accounts } from '../schema';

@Repository(TOKENS.IAccountRepository)
export class PostgresAccountRepository implements IAccountRepository {
  private get db() {
    return getDatabase();
  }

  async findById(id: string): Promise<Account | null> {
    const result = await this.db.select().from(accounts).where(eq(accounts.id, id)).limit(1);

    if (result.length === 0) return null;

    return this.rowToEntity(result[0]!);
  }

  async findByIban(iban: string): Promise<Account | null> {
    const result = await this.db.select().from(accounts).where(eq(accounts.iban, iban)).limit(1);

    if (result.length === 0) return null;

    return this.rowToEntity(result[0]!);
  }

  async findByUserId(userId: string): Promise<Account[]> {
    const result = await this.db.select().from(accounts).where(eq(accounts.userId, userId));

    return result.map(row => this.rowToEntity(row));
  }

  async findSavingsAccounts(): Promise<Account[]> {
    const result = await this.db.select().from(accounts).where(eq(accounts.type, 'SAVINGS'));

    return result.map(row => this.rowToEntity(row));
  }

  async save(account: Account): Promise<Account> {
    const values: any = {
      id: account.id,
      userId: account.userId,
      iban: account.iban.toString(),
      customName: account.customName,
      type: account.type,
      balance: account.balance.getAmount().toString(),
      savingsRate: account.savingsRate ? account.savingsRate.toDecimal().toString() : null,
      createdAt: account.createdAt,
      updatedAt: new Date(),
    };

    await this.db
      .insert(accounts)
      .values(values)
      .onConflictDoUpdate({
        target: accounts.id,
        set: values,
      });

    return account;
  }

  async update(account: Account): Promise<Account> {
    await this.db
      .update(accounts)
      .set({
        customName: account.customName,
        balance: account.balance.getAmount().toString(),
        savingsRate: account.savingsRate ? account.savingsRate.toDecimal().toString() : undefined,
        updatedAt: new Date(),
      })
      .where(eq(accounts.id, account.id));

    return account;
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(accounts).where(eq(accounts.id, id));
  }

  private rowToEntity(row: typeof accounts.$inferSelect): Account {
    return Account.fromPersistence({
      id: row.id,
      userId: row.userId,
      iban: IBAN.fromString(row.iban),
      customName: row.customName,
      type: row.type as AccountType,
      balance: Money.fromAmount(parseFloat(row.balance)),
      savingsRate: row.savingsRate ? Percentage.fromDecimal(parseFloat(row.savingsRate)) : undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
