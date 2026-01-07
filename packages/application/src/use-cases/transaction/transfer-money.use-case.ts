import { UseCase, Inject, TOKENS } from '@workspace/shared/di';
import { Transaction, TransactionType, Money } from '@workspace/domain';
import type { ITransactionRepository, IAccountRepository } from '../../ports';
import type { TransactionDto } from '../../dtos';
import { AccountNotFoundError, InsufficientFundsError } from '@workspace/domain';

@UseCase()
export class TransferMoneyUseCase {
  constructor(
    @Inject(TOKENS.ITransactionRepository)
    private transactionRepository: ITransactionRepository,
    @Inject(TOKENS.IAccountRepository)
    private accountRepository: IAccountRepository
  ) {}

  async execute(
    fromAccountId: string,
    toAccountId: string,
    amount: number
  ): Promise<TransactionDto> {
    const fromAccount = await this.accountRepository.findById(fromAccountId);
    const toAccount = await this.accountRepository.findById(toAccountId);

    if (!fromAccount) {
      throw new AccountNotFoundError(fromAccountId);
    }
    if (!toAccount) {
      throw new AccountNotFoundError(toAccountId);
    }

    const moneyAmount = Money.fromAmount(amount);

    if (fromAccount.balance.isLessThan(moneyAmount)) {
      throw new InsufficientFundsError(fromAccountId);
    }

    fromAccount.debit(moneyAmount);
    toAccount.credit(moneyAmount);

    await this.accountRepository.update(fromAccount);
    await this.accountRepository.update(toAccount);

    const transaction = Transaction.create(
      fromAccountId,
      toAccountId,
      moneyAmount,
      TransactionType.TRANSFER
    );

    transaction.complete();

    const savedTransaction = await this.transactionRepository.save(transaction);

    return {
      id: savedTransaction.id,
      fromAccountId: savedTransaction.fromAccountId,
      toAccountId: savedTransaction.toAccountId,
      amount: savedTransaction.amount.getAmount(),
      type: savedTransaction.type,
      status: savedTransaction.status,
      description: savedTransaction.description,
      createdAt: savedTransaction.createdAt,
      updatedAt: savedTransaction.updatedAt,
    };
  }
}
