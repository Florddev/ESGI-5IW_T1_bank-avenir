import { UseCase, Inject, TOKENS } from '@workspace/shared/di';
import { Transaction, TransactionType, Money } from '@workspace/domain';
import type { ITransactionRepository, IAccountRepository } from '../../ports';
import type { TransactionDto } from '../../dtos';
import { AccountNotFoundError, InsufficientFundsError } from '@workspace/domain';

@UseCase()
export class WithdrawMoneyUseCase {
  constructor(
    @Inject(TOKENS.ITransactionRepository)
    private transactionRepository: ITransactionRepository,
    @Inject(TOKENS.IAccountRepository)
    private accountRepository: IAccountRepository
  ) {}

  async execute(accountId: string, amount: number): Promise<TransactionDto> {
    const account = await this.accountRepository.findById(accountId);

    if (!account) {
      throw new AccountNotFoundError(accountId);
    }

    const moneyAmount = Money.fromAmount(amount);

    if (account.balance.isLessThan(moneyAmount)) {
      throw new InsufficientFundsError(accountId);
    }

    account.debit(moneyAmount);
    await this.accountRepository.update(account);

    const systemAccountId = 'system-withdrawal';
    const transaction = Transaction.create(
      accountId,
      systemAccountId,
      moneyAmount,
      TransactionType.TRANSFER,
      'Withdrawal'
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
