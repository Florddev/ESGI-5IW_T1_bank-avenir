import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import { Loan, Money, Percentage } from '@workspace/domain';
import { ILoanRepository } from '../../ports';
import { LoanDto } from '../../dtos';

@UseCase()
export class CreateLoanUseCase {
  constructor(
    @Inject(TOKENS.ILoanRepository)
    private loanRepository: ILoanRepository
  ) {}

  async execute(
    userId: string,
    advisorId: string,
    accountId: string,
    principal: number,
    annualInterestRate: number,
    insuranceRate: number,
    durationMonths: number
  ): Promise<LoanDto> {
    const loan = Loan.create(
      userId,
      advisorId,
      accountId,
      Money.fromAmount(principal),
      Percentage.fromDecimal(annualInterestRate / 100),
      Percentage.fromDecimal(insuranceRate / 100),
      durationMonths
    );

    const savedLoan = await this.loanRepository.save(loan);

    return {
      id: savedLoan.id,
      userId: savedLoan.userId,
      advisorId: savedLoan.advisorId,
      accountId: savedLoan.accountId,
      principal: savedLoan.principal.getAmount(),
      remainingPrincipal: savedLoan.remainingPrincipal.getAmount(),
      annualInterestRate: savedLoan.annualInterestRate.toDecimal() * 100,
      insuranceRate: savedLoan.insuranceRate.toDecimal() * 100,
      monthlyPayment: savedLoan.monthlyPayment.getAmount(),
      durationMonths: savedLoan.durationMonths,
      remainingMonths: savedLoan.remainingMonths,
      status: savedLoan.status,
      nextPaymentDate: savedLoan.nextPaymentDate,
      createdAt: savedLoan.createdAt,
    };
  }
}
