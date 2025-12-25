import { Transaction } from '@workspace/domain/entities';

export interface ITransactionRepository {
    findById(id: string): Promise<Transaction | null>;
    findByAccountId(accountId: string): Promise<Transaction[]>;
    findByAccountIdPaginated(
        accountId: string,
        limit: number,
        offset: number
    ): Promise<Transaction[]>;
    save(transaction: Transaction): Promise<Transaction>;
}
