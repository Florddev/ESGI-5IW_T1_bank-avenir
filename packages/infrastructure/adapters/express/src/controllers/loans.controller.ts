import { container } from 'tsyringe';
import {
  CreateLoanUseCase,
  GetUserLoansUseCase,
  GetAdvisorLoansUseCase,
  GetClientLoansUseCase,
  ProcessLoanPaymentUseCase,
  MarkLoanDefaultedUseCase,
} from '@workspace/application/use-cases';

export class LoansController {
  async createLoan(
    userId: string,
    advisorId: string,
    accountId: string,
    principal: number,
    annualInterestRate: number,
    insuranceRate: number,
    durationMonths: number
  ) {
    const useCase = container.resolve(CreateLoanUseCase);
    return await useCase.execute(
      userId,
      advisorId,
      accountId,
      principal,
      annualInterestRate,
      insuranceRate,
      durationMonths
    );
  }

  async getUserLoans(userId: string) {
    const useCase = container.resolve(GetUserLoansUseCase);
    return await useCase.execute(userId);
  }

  async getAdvisorLoans(advisorId: string) {
    const useCase = container.resolve(GetAdvisorLoansUseCase);
    return await useCase.execute(advisorId);
  }

  async getClientLoans(clientId: string) {
    const useCase = container.resolve(GetClientLoansUseCase);
    return await useCase.execute(clientId);
  }

  async processPayment(loanId: string) {
    const useCase = container.resolve(ProcessLoanPaymentUseCase);
    return await useCase.execute(loanId);
  }

  async markDefaulted(loanId: string) {
    const useCase = container.resolve(MarkLoanDefaultedUseCase);
    return await useCase.execute(loanId);
  }
}
