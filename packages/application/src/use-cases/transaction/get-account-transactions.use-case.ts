import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import type { ITransactionRepository } from '../../ports';
import type { TransactionDto } from '../../dtos';

@UseCase()
export class GetAccountTransactionsUseCase {
  constructor(
    @Inject(TOKENS.ITransactionRepository)
    private transactionRepository: ITransactionRepository
  ) {}

  async execute(accountId: string): Promise<TransactionDto[]> {
    const transactions = await this.transactionRepository.findByAccountId(accountId);

    return transactions.map((transaction) => ({
      id: transaction.id,
      fromAccountId: transaction.fromAccountId,
      toAccountId: transaction.toAccountId,
      amount: transaction.amount.getAmount(),
      type: transaction.type,
      status: transaction.status,
      description: transaction.description,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    }));
  }
}
