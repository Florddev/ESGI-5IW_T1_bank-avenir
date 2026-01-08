import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import type { IUserRepository, IAccountRepository } from '../../ports';
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

    const accounts = await this.accountRepository.findByUserId(userId);
    for (const account of accounts) {
      if (!account.balance.equals(Money.fromAmount(0))) {
        throw new Error(
          `Cannot delete user with non-zero balance accounts. Account ${account.iban.toString()} has balance ${account.balance.getAmount()}`
        );
      }
    }

    for (const account of accounts) {
      await this.accountRepository.delete(account.id);
    }

    await this.userRepository.delete(userId);
  }
}
