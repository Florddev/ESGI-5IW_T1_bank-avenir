import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import { Account, AccountType } from '@workspace/domain';
import { IAccountRepository } from '../../ports';
import { AccountDto } from '../../dtos';

@UseCase()
export class CreateAccountUseCase {
  constructor(
    @Inject(TOKENS.IAccountRepository)
    private accountRepository: IAccountRepository
  ) {}

  async execute(userId: string, customName: string, type: AccountType): Promise<AccountDto> {
    const account = Account.create(userId, customName, type);

    const savedAccount = await this.accountRepository.save(account);

    return {
      id: savedAccount.id,
      userId: savedAccount.userId,
      iban: savedAccount.iban.toString(),
      customName: savedAccount.customName,
      type: savedAccount.type,
      balance: savedAccount.balance.getAmount(),
      savingsRate: savedAccount.savingsRate?.toDecimal(),
      createdAt: savedAccount.createdAt,
      updatedAt: savedAccount.updatedAt,
    };
  }
}
