import { ITransactionRepository } from '@workspace/application/ports';
import { Transaction } from '@workspace/domain/entities';
import { Repository, TOKENS } from '@workspace/shared/di';

@Repository(TOKENS.ITransactionRepository)
export class InMemoryTransactionRepository implements ITransactionRepository {
    private transactions: Map<string, Transaction> = new Map();

    async findById(id: string): Promise<Transaction | null> {
        return this.transactions.get(id) || null;
    }

    async findByAccountId(accountId: string): Promise<Transaction[]> {
        return Array.from(this.transactions.values())
            .filter(
                (transaction) =>
                    transaction.fromAccountId === accountId || transaction.toAccountId === accountId
            )
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    async findByAccountIdPaginated(
        accountId: string,
        limit: number,
        offset: number
    ): Promise<Transaction[]> {
        const transactions = await this.findByAccountId(accountId);
        return transactions.slice(offset, offset + limit);
    }

    async save(transaction: Transaction): Promise<Transaction> {
        this.transactions.set(transaction.id, transaction);
        return transaction;
    }
}
