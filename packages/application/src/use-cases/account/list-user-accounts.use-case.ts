import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import type { IAccountRepository } from '../../ports';
import type { AccountDto } from '../../dtos';

@UseCase()
export class ListUserAccountsUseCase {
  constructor(
    @Inject(TOKENS.IAccountRepository)
    private accountRepository: IAccountRepository
  ) {}

  async execute(userId: string): Promise<AccountDto[]> {
    const accounts = await this.accountRepository.findByUserId(userId);

    return accounts.map((account) => ({
      id: account.id,
      userId: account.userId,
      iban: account.iban.toString(),
      customName: account.customName,
      type: account.type,
      balance: account.balance.getAmount(),
      savingsRate: account.savingsRate?.toDecimal(),
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    }));
  }
}
