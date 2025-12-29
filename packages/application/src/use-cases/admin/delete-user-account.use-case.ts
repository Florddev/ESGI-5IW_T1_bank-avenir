import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import { IUserRepository, IAccountRepository } from '../../ports';
import { UserNotFoundError } from '@workspace/domain';
import { Money } from '@workspace/domain';

@UseCase()
export class DeleteUserAccountUseCase {
  constructor(
    @Inject(TOKENS.IUserRepository)
    private userRepository: IUserRepository,
    @Inject(TOKENS.IAccountRepository)
    private accountRepository: IAccountRepository
  ) {}

  async execute(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    // Vérifier que tous les comptes de l'utilisateur ont un solde nul
    const accounts = await this.accountRepository.findByUserId(userId);
    for (const account of accounts) {
      if (!account.balance.equals(Money.fromAmount(0))) {
        throw new Error(
          `Cannot delete user with non-zero balance accounts. Account ${account.iban.toString()} has balance ${account.balance.getAmount()}`
        );
      }
    }

    // Supprimer tous les comptes de l'utilisateur
    for (const account of accounts) {
      await this.accountRepository.delete(account.id);
    }

    // Supprimer l'utilisateur
    await this.userRepository.delete(userId);
  }
}
