import { container } from 'tsyringe';
import {
  CreateAccountUseCase,
  GetAccountUseCase,
  ListUserAccountsUseCase,
  UpdateAccountNameUseCase,
  DeleteAccountUseCase,
} from '@workspace/application/use-cases';

export class AccountsController {
  async createAccount(userId: string, customName: string, type: string, savingsRate?: number) {
    const useCase = container.resolve(CreateAccountUseCase);
    return await useCase.execute(userId, customName, type as any, savingsRate);
  }

  async getAccount(accountId: string) {
    const useCase = container.resolve(GetAccountUseCase);
    return await useCase.execute(accountId);
  }

  async listUserAccounts(userId: string) {
    const useCase = container.resolve(ListUserAccountsUseCase);
    return await useCase.execute(userId);
  }

  async updateAccountName(accountId: string, customName: string) {
    const useCase = container.resolve(UpdateAccountNameUseCase);
    return await useCase.execute(accountId, customName);
  }

  async deleteAccount(accountId: string) {
    const useCase = container.resolve(DeleteAccountUseCase);
    return await useCase.execute(accountId);
  }
}
