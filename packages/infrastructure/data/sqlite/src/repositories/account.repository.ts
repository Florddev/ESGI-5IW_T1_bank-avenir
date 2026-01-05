import { IAccountRepository } from '@workspace/application/ports';
import { Account, AccountType, Money } from '@workspace/domain';
import { Repository, TOKENS } from '@workspace/shared/di';
import { db } from '../database';

interface AccountRow {
    id: string;
    user_id: string;
    account_number: string;
    account_type: string;
    balance: number;
    interest_rate: number;
    created_at: number;
    updated_at: number;
}

@Repository(TOKENS.IAccountRepository)
export class SqliteAccountRepository implements IAccountRepository {
    private rowToAccount(row: AccountRow): Account {
        return Account.fromPersistence({
            id: row.id,
            userId: row.user_id,
            accountNumber: row.account_number,
            type: row.account_type as AccountType,
            balance: Money.fromAmount(row.balance),
            interestRate: row.interest_rate,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at),
        });
    }

    async findById(id: string): Promise<Account | null> {
        const stmt = db.prepare('SELECT * FROM accounts WHERE id = ?');
        const row = stmt.get(id) as AccountRow | undefined;
        return row ? this.rowToAccount(row) : null;
    }

    async findByUserId(userId: string): Promise<Account[]> {
        const stmt = db.prepare('SELECT * FROM accounts WHERE user_id = ? ORDER BY created_at DESC');
        const rows = stmt.all(userId) as AccountRow[];
        return rows.map((row) => this.rowToAccount(row));
    }

    async findByAccountNumber(accountNumber: string): Promise<Account | null> {
        const stmt = db.prepare('SELECT * FROM accounts WHERE account_number = ?');
        const row = stmt.get(accountNumber) as AccountRow | undefined;
        return row ? this.rowToAccount(row) : null;
    }

    async findAll(): Promise<Account[]> {
        const stmt = db.prepare('SELECT * FROM accounts ORDER BY created_at DESC');
        const rows = stmt.all() as AccountRow[];
        return rows.map((row) => this.rowToAccount(row));
    }

    async save(account: Account): Promise<Account> {
        const stmt = db.prepare(`
            INSERT INTO accounts (id, user_id, account_number, account_type, balance, interest_rate, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run(
            account.id,
            account.userId,
            account.accountNumber,
            account.type,
            account.balance.getAmount(),
            account.interestRate,
            account.createdAt.getTime(),
            account.updatedAt.getTime()
        );
        
        return account;
    }

    async update(account: Account): Promise<Account> {
        const stmt = db.prepare(`
            UPDATE accounts
            SET account_number = ?, account_type = ?, balance = ?, interest_rate = ?, updated_at = ?
            WHERE id = ?
        `);
        
        stmt.run(
            account.accountNumber,
            account.type,
            account.balance.getAmount(),
            account.interestRate,
            account.updatedAt.getTime(),
            account.id
        );
        
        return account;
    }

    async delete(id: string): Promise<void> {
        const stmt = db.prepare('DELETE FROM accounts WHERE id = ?');
        stmt.run(id);
    }
}
