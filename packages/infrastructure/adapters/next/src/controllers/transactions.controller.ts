import { container } from '@workspace/shared/di';
import {
  TransferMoneyUseCase,
  DepositMoneyUseCase,
  WithdrawMoneyUseCase,
  GetAccountTransactionsUseCase,
} from '@workspace/application/use-cases';

export class TransactionsController {
  async transfer(fromAccountId: string, toAccountId: string, amount: number) {
    const useCase = container.resolve(TransferMoneyUseCase);
    return await useCase.execute(fromAccountId, toAccountId, amount);
  }

  async deposit(accountId: string, amount: number) {
    const useCase = container.resolve(DepositMoneyUseCase);
    return await useCase.execute(accountId, amount);
  }

  async withdraw(accountId: string, amount: number) {
    const useCase = container.resolve(WithdrawMoneyUseCase);
    return await useCase.execute(accountId, amount);
  }

  async getAccountTransactions(accountId: string) {
    const useCase = container.resolve(GetAccountTransactionsUseCase);
    return await useCase.execute(accountId);
  }
}
