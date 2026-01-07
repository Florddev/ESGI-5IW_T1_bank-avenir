import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import { Account, AccountType, Percentage } from '@workspace/domain';
import type { IAccountRepository } from '../../ports';
import type { AccountDto } from '../../dtos';

const DEFAULT_SAVINGS_RATE = 2; // 2% par défaut

@UseCase()
export class CreateAccountUseCase {
  constructor(
    @Inject(TOKENS.IAccountRepository)
    private accountRepository: IAccountRepository
  ) {}

  async execute(userId: string, customName: string, type: AccountType, savingsRate?: number): Promise<AccountDto> {
    let account: Account;

    if (type === AccountType.SAVINGS) {
      // Si c'est un compte épargne, récupérer le taux depuis les comptes existants ou utiliser le défaut
      let rate: Percentage;

      if (savingsRate !== undefined) {
        rate = Percentage.fromDecimal(savingsRate / 100);
      } else {
        // Essayer de récupérer le taux d'un compte épargne existant
        const existingSavingsAccounts = await this.accountRepository.findSavingsAccounts();
        if (existingSavingsAccounts.length > 0 && existingSavingsAccounts[0].savingsRate) {
          rate = existingSavingsAccounts[0].savingsRate;
        } else {
          // Utiliser le taux par défaut
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
