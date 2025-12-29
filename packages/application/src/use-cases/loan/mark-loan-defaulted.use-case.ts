import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import { ILoanRepository } from '../../ports';
import { LoanDto } from '../../dtos';
import { LoanNotFoundError } from '@workspace/domain';

@UseCase()
export class MarkLoanDefaultedUseCase {
  constructor(
    @Inject(TOKENS.ILoanRepository)
    private loanRepository: ILoanRepository
  ) {}

  async execute(loanId: string): Promise<LoanDto> {
    const loan = await this.loanRepository.findById(loanId);

    if (!loan) {
      throw new LoanNotFoundError(loanId);
    }

    loan.markAsDefaulted();
    const updatedLoan = await this.loanRepository.update(loan);

    return {
      id: updatedLoan.id,
      userId: updatedLoan.userId,
      advisorId: updatedLoan.advisorId,
      accountId: updatedLoan.accountId,
      principal: updatedLoan.principal.getAmount(),
      remainingPrincipal: updatedLoan.remainingPrincipal.getAmount(),
      annualInterestRate: updatedLoan.annualInterestRate.toDecimal() * 100,
      insuranceRate: updatedLoan.insuranceRate.toDecimal() * 100,
      monthlyPayment: updatedLoan.monthlyPayment.getAmount(),
      durationMonths: updatedLoan.durationMonths,
      remainingMonths: updatedLoan.remainingMonths,
      status: updatedLoan.status,
      nextPaymentDate: updatedLoan.nextPaymentDate,
      createdAt: updatedLoan.createdAt,
    };
  }
}
