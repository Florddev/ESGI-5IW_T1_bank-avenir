import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import type { ILoanRepository } from '../../ports';
import type { LoanDto } from '../../dtos';

@UseCase()
export class GetAdvisorLoansUseCase {
  constructor(
    @Inject(TOKENS.ILoanRepository)
    private loanRepository: ILoanRepository
  ) {}

  async execute(advisorId: string): Promise<LoanDto[]> {
    const loans = await this.loanRepository.findByAdvisorId(advisorId);

    return loans.map((loan) => ({
      id: loan.id,
      userId: loan.userId,
      advisorId: loan.advisorId,
      accountId: loan.accountId,
      principal: loan.principal.getAmount(),
      remainingPrincipal: loan.remainingPrincipal.getAmount(),
      annualInterestRate: loan.annualInterestRate.toDecimal() * 100,
      insuranceRate: loan.insuranceRate.toDecimal() * 100,
      monthlyPayment: loan.monthlyPayment.getAmount(),
      durationMonths: loan.durationMonths,
      remainingMonths: loan.remainingMonths,
      status: loan.status,
      nextPaymentDate: loan.nextPaymentDate,
      createdAt: loan.createdAt,
    }));
  }
}
