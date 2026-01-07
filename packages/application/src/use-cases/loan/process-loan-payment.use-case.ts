import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import type { ILoanRepository } from '../../ports';
import type { LoanPaymentDto } from '../../dtos';
import { LoanNotFoundError } from '@workspace/domain';

@UseCase()
export class ProcessLoanPaymentUseCase {
  constructor(
    @Inject(TOKENS.ILoanRepository)
    private loanRepository: ILoanRepository
  ) {}

  async execute(loanId: string): Promise<LoanPaymentDto> {
    const loan = await this.loanRepository.findById(loanId);

    if (!loan) {
      throw new LoanNotFoundError(loanId);
    }

    const payment = loan.processPayment();
    await this.loanRepository.update(loan);

    return {
      principalAmount: payment.principal.getAmount(),
      interestAmount: payment.interest.getAmount(),
      insuranceAmount: payment.insurance.getAmount(),
      totalAmount: loan.monthlyPayment.getAmount(),
    };
  }
}
