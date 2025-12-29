import { UseCase, Inject, TOKENS } from '@workspace/shared/di';
import { Transaction, TransactionType, Money } from '@workspace/domain';
import { ITransactionRepository, IAccountRepository } from '../../ports';
import { TransactionDto } from '../../dtos';
import { AccountNotFoundError } from '@workspace/domain';

@UseCase()
export class DepositMoneyUseCase {
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
    account.credit(moneyAmount);
    await this.accountRepository.update(account);

    const systemAccountId = 'system-deposit';
    const transaction = Transaction.create(
      systemAccountId,
      accountId,
      moneyAmount,
      TransactionType.TRANSFER,
      'Deposit'
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
