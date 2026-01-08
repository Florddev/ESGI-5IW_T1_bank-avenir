import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import type { IAccountRepository } from '../../ports';
import { AccountNotFoundError, InsufficientFundsError } from '@workspace/domain';
import { Money } from '@workspace/domain';

@UseCase()
export class DeleteAccountUseCase {
  constructor(
    @Inject(TOKENS.IAccountRepository)
    private accountRepository: IAccountRepository
  ) {}

  async execute(accountId: string): Promise<void> {
    const account = await this.accountRepository.findById(accountId);

    if (!account) {
      throw new AccountNotFoundError(accountId);
    }

    if (!account.balance.equals(Money.fromAmount(0))) {
      throw new InsufficientFundsError(accountId);
    }

    await this.accountRepository.delete(accountId);
  }
}
