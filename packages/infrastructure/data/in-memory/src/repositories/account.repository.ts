import { Repository, TOKENS } from '@workspace/shared/di';
import { IAccountRepository } from '@workspace/application/ports';
import { Account, AccountType } from '@workspace/domain/entities';

@Repository(TOKENS.IAccountRepository)
export class InMemoryAccountRepository implements IAccountRepository {
    private accounts: Map<string, Account> = new Map();

    async findById(id: string): Promise<Account | null> {
        return this.accounts.get(id) || null;
    }

    async findByIban(iban: string): Promise<Account | null> {
        for (const account of this.accounts.values()) {
            if (account.iban.toString() === iban) {
                return account;
            }
        }
        return null;
    }

    async findByUserId(userId: string): Promise<Account[]> {
        return Array.from(this.accounts.values()).filter((account) => account.userId === userId);
    }

    async findSavingsAccounts(): Promise<Account[]> {
        return Array.from(this.accounts.values()).filter(
            (account) => account.type === AccountType.SAVINGS
        );
    }

    async save(account: Account): Promise<Account> {
        this.accounts.set(account.id, account);
        return account;
    }

    async update(account: Account): Promise<Account> {
        this.accounts.set(account.id, account);
        return account;
    }

    async delete(id: string): Promise<void> {
        this.accounts.delete(id);
    }
}
