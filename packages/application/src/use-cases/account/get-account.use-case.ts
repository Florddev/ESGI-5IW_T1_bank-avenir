import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import { IAccountRepository } from '../../ports';
import { AccountDto } from '../../dtos';
import { AccountNotFoundError } from '@workspace/domain';

@UseCase()
export class GetAccountUseCase {
  constructor(
    @Inject(TOKENS.IAccountRepository)
    private accountRepository: IAccountRepository
  ) {}

  async execute(accountId: string): Promise<AccountDto> {
    const account = await this.accountRepository.findById(accountId);

    if (!account) {
      throw new AccountNotFoundError(accountId);
    }

    return {
      id: account.id,
      userId: account.userId,
      iban: account.iban.toString(),
      customName: account.customName,
      type: account.type,
      balance: account.balance.getAmount(),
      savingsRate: account.savingsRate?.toDecimal(),
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    };
  }
}
