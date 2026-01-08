import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import { Account, AccountType, Percentage } from '@workspace/domain';
import type { IAccountRepository } from '../../ports';
import type { AccountDto } from '../../dtos';

const DEFAULT_SAVINGS_RATE = 2;

@UseCase()
export class CreateAccountUseCase {
  constructor(
    @Inject(TOKENS.IAccountRepository)
    private accountRepository: IAccountRepository
  ) {}

  async execute(userId: string, customName: string, type: AccountType, savingsRate?: number): Promise<AccountDto> {
    let account: Account;

    if (type === AccountType.SAVINGS) {
      let rate: Percentage;

      if (savingsRate !== undefined) {
        rate = Percentage.fromDecimal(savingsRate / 100);
      } else {
        const existingSavingsAccounts = await this.accountRepository.findSavingsAccounts();
        if (existingSavingsAccounts.length > 0 && existingSavingsAccounts[0].savingsRate) {
          rate = existingSavingsAccounts[0].savingsRate;
        } else {
          rate = Percentage.fromDecimal(DEFAULT_SAVINGS_RATE / 100);
        }
      }

      account = Account.create(userId, customName, type, rate);
    } else {
      account = Account.create(userId, customName, type);
    }

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
