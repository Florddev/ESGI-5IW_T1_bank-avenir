import { Account } from '@workspace/domain/entities';

export interface IAccountRepository {
    findById(id: string): Promise<Account | null>;
    findByIban(iban: string): Promise<Account | null>;
    findByUserId(userId: string): Promise<Account[]>;
    findSavingsAccounts(): Promise<Account[]>;
    save(account: Account): Promise<Account>;
    update(account: Account): Promise<Account>;
    delete(id: string): Promise<void>;
}
