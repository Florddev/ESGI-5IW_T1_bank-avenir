import { ITransactionRepository } from '@workspace/application/ports';
import { Transaction, TransactionType, Money } from '@workspace/domain';
import { Repository, TOKENS } from '@workspace/shared/di';
import { db } from '../database';

interface TransactionRow {
    id: string;
    account_id: string;
    type: string;
    amount: number;
    description: string;
    recipient_account_id: string | null;
    created_at: number;
}

@Repository(TOKENS.ITransactionRepository)
export class SqliteTransactionRepository implements ITransactionRepository {
    private rowToTransaction(row: TransactionRow): Transaction {
        return Transaction.fromPersistence({
            id: row.id,
            accountId: row.account_id,
            type: row.type as TransactionType,
            amount: Money.fromAmount(row.amount),
            description: row.description,
            recipientAccountId: row.recipient_account_id || undefined,
            createdAt: new Date(row.created_at),
        });
    }

    async findById(id: string): Promise<Transaction | null> {
        const stmt = db.prepare('SELECT * FROM transactions WHERE id = ?');
        const row = stmt.get(id) as TransactionRow | undefined;
        return row ? this.rowToTransaction(row) : null;
    }

    async findByAccountId(accountId: string): Promise<Transaction[]> {
        const stmt = db.prepare('SELECT * FROM transactions WHERE account_id = ? ORDER BY created_at DESC');
        const rows = stmt.all(accountId) as TransactionRow[];
        return rows.map((row) => this.rowToTransaction(row));
    }

    async findAll(): Promise<Transaction[]> {
        const stmt = db.prepare('SELECT * FROM transactions ORDER BY created_at DESC');
        const rows = stmt.all() as TransactionRow[];
        return rows.map((row) => this.rowToTransaction(row));
    }

    async save(transaction: Transaction): Promise<Transaction> {
        const stmt = db.prepare(`
            INSERT INTO transactions (id, account_id, type, amount, description, recipient_account_id, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run(
            transaction.id,
            transaction.accountId,
            transaction.type,
            transaction.amount.getAmount(),
            transaction.description,
            transaction.recipientAccountId || null,
            transaction.createdAt.getTime()
        );
        
        return transaction;
    }

    async delete(id: string): Promise<void> {
        const stmt = db.prepare('DELETE FROM transactions WHERE id = ?');
        stmt.run(id);
    }
}
