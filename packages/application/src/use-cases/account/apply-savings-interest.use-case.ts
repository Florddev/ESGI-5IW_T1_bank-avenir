import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import { IAccountRepository, ITransactionRepository } from '../../ports';

@UseCase()
export class ApplySavingsInterestUseCase {
  constructor(
    @Inject(TOKENS.IAccountRepository)
    private accountRepository: IAccountRepository,
    @Inject(TOKENS.ITransactionRepository)
    private transactionRepository: ITransactionRepository
  ) {}

  async execute(): Promise<{ accountsProcessed: number; totalInterest: number }> {
    // Récupérer tous les comptes d'épargne
    const savingsAccounts = await this.accountRepository.findSavingsAccounts();

    let accountsProcessed = 0;
    let totalInterest = 0;

    for (const account of savingsAccounts) {
      try {
        // Appliquer l'intérêt quotidien
        const interest = account.applyDailyInterest();
        
        // Sauvegarder le compte mis à jour
        await this.accountRepository.update(account);

        totalInterest += interest.getAmount();
        accountsProcessed++;
      } catch (error) {
        // Log l'erreur mais continue avec les autres comptes
        console.error(`Failed to apply interest for account ${account.id}:`, error);
      }
    }

    return {
      accountsProcessed,
      totalInterest,
    };
  }
}
