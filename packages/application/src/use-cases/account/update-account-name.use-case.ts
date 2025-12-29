import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import { IAccountRepository } from '../../ports';
import { AccountDto } from '../../dtos';
import { AccountNotFoundError } from '@workspace/domain';

@UseCase()
export class UpdateAccountNameUseCase {
  constructor(
    @Inject(TOKENS.IAccountRepository)
    private accountRepository: IAccountRepository
  ) {}

  async execute(accountId: string, customName: string): Promise<AccountDto> {
    const account = await this.accountRepository.findById(accountId);

    if (!account) {
      throw new AccountNotFoundError(accountId);
    }

    account.updateCustomName(customName);
    const updatedAccount = await this.accountRepository.update(account);

    return {
      id: updatedAccount.id,
      userId: updatedAccount.userId,
      iban: updatedAccount.iban.toString(),
      customName: updatedAccount.customName,
      type: updatedAccount.type,
      balance: updatedAccount.balance.getAmount(),
      savingsRate: updatedAccount.savingsRate?.toDecimal(),
      createdAt: updatedAccount.createdAt,
      updatedAt: updatedAccount.updatedAt,
    };
  }
}
