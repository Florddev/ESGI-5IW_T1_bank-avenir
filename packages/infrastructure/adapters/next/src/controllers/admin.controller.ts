import { container } from '@workspace/shared/di';
import {
  CreateUserAccountUseCase,
  UpdateUserAccountUseCase,
  DeleteUserAccountUseCase,
  BanUserUseCase,
  UpdateGlobalSavingsRateUseCase,
  ApplySavingsInterestUseCase,
} from '@workspace/application/use-cases';

export class AdminController {
  async createUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: any
  ) {
    const useCase = container.resolve(CreateUserAccountUseCase);
    return await useCase.execute(email, password, firstName, lastName, role);
  }

  async updateUser(userId: string, firstName: string, lastName: string) {
    const useCase = container.resolve(UpdateUserAccountUseCase);
    return await useCase.execute(userId, firstName, lastName);
  }

  async deleteUser(userId: string) {
    const useCase = container.resolve(DeleteUserAccountUseCase);
    return await useCase.execute(userId);
  }

  async banUser(userId: string) {
    const useCase = container.resolve(BanUserUseCase);
    return await useCase.execute(userId);
  }

  async updateSavingsRate(newRate: number) {
    const useCase = container.resolve(UpdateGlobalSavingsRateUseCase);
    return await useCase.execute(newRate);
  }

  async applySavingsInterest() {
    const useCase = container.resolve(ApplySavingsInterestUseCase);
    return await useCase.execute();
  }
}
