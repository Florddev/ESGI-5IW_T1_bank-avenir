import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import { ILoanRepository } from '../../ports';
import { LoanDto } from '../../dtos';

@UseCase()
export class GetClientLoansUseCase {
  constructor(
    @Inject(TOKENS.ILoanRepository)
    private loanRepository: ILoanRepository
  ) {}

  async execute(clientId: string): Promise<LoanDto[]> {
    const loans = await this.loanRepository.findByUserId(clientId);

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
