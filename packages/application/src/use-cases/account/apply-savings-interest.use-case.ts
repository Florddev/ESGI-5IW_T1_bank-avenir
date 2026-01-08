import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import type { IAccountRepository, ITransactionRepository } from '../../ports';

@UseCase()
export class ApplySavingsInterestUseCase {
  constructor(
    @Inject(TOKENS.IAccountRepository)
    private accountRepository: IAccountRepository,
    @Inject(TOKENS.ITransactionRepository)
    private transactionRepository: ITransactionRepository
  ) {}

  async execute(): Promise<{ accountsProcessed: number; totalInterest: number }> {
    const savingsAccounts = await this.accountRepository.findSavingsAccounts();

    let accountsProcessed = 0;
    let totalInterest = 0;

    for (const account of savingsAccounts) {
      try {
        const interest = account.applyDailyInterest();
        
        await this.accountRepository.update(account);

        totalInterest += interest.getAmount();
        accountsProcessed++;
      } catch (error) {
        console.error(`Failed to apply interest for account ${account.id}:`, error);
      }
    }

    return {
      accountsProcessed,
      totalInterest,
    };
  }
}
