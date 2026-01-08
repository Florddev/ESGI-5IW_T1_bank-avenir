import { eq, lte } from 'drizzle-orm';
import { Repository, TOKENS } from '@workspace/shared/di';
import type { ILoanRepository } from '@workspace/application/ports';
import { Loan, LoanStatus } from '@workspace/domain/entities';
import { Money, Percentage } from '@workspace/domain/value-objects';
import { getDatabase } from '../database';
import { loans } from '../schema';

@Repository(TOKENS.ILoanRepository)
export class PostgresLoanRepository implements ILoanRepository {
  private get db() {
    return getDatabase();
  }

  async findById(id: string): Promise<Loan | null> {
    const result = await this.db
      .select()
      .from(loans)
      .where(eq(loans.id, id))
      .limit(1);

    if (result.length === 0) return null;

    return this.rowToEntity(result[0]!);
  }

  async findByUserId(userId: string): Promise<Loan[]> {
    const result = await this.db
      .select()
      .from(loans)
      .where(eq(loans.userId, userId));

    return result.map(row => this.rowToEntity(row));
  }

  async findByAdvisorId(advisorId: string): Promise<Loan[]> {
    const result = await this.db
      .select()
      .from(loans)
      .where(eq(loans.advisorId, advisorId));

    return result.map(row => this.rowToEntity(row));
  }

  async findActiveLoans(): Promise<Loan[]> {
    const result = await this.db
      .select()
      .from(loans)
      .where(eq(loans.status, 'ACTIVE'));

    return result.map(row => this.rowToEntity(row));
  }

  async findDuePayments(date: Date): Promise<Loan[]> {
    const result = await this.db
      .select()
      .from(loans)
      .where(lte(loans.nextPaymentDate, date));

    return result.map(row => this.rowToEntity(row));
  }

  async save(loan: Loan): Promise<Loan> {
    const values = {
      id: loan.id,
      userId: loan.userId,
      advisorId: loan.advisorId,
      accountId: loan.accountId,
      principal: loan.principal.getAmount().toString(),
      remainingPrincipal: loan.remainingPrincipal.getAmount().toString(),
      annualInterestRate: loan.annualInterestRate.toDecimal().toString(),
      insuranceRate: loan.insuranceRate.toDecimal().toString(),
      monthlyPayment: loan.monthlyPayment.getAmount().toString(),
      durationMonths: loan.durationMonths,
      remainingMonths: loan.remainingMonths,
      status: loan.status,
      nextPaymentDate: loan.nextPaymentDate,
      createdAt: loan.createdAt,
      updatedAt: loan.updatedAt,
    };

    await this.db
      .insert(loans)
      .values(values)
      .onConflictDoUpdate({
        target: loans.id,
        set: values,
      });

    return loan;
  }

  async update(loan: Loan): Promise<Loan> {
    await this.db
      .update(loans)
      .set({
        remainingPrincipal: loan.remainingPrincipal.getAmount().toString(),
        remainingMonths: loan.remainingMonths,
        status: loan.status,
        nextPaymentDate: loan.nextPaymentDate,
        updatedAt: loan.updatedAt,
      })
      .where(eq(loans.id, loan.id));

    return loan;
  }

  private rowToEntity(row: typeof loans.$inferSelect): Loan {
    return Loan.fromPersistence({
      id: row.id,
      userId: row.userId,
      advisorId: row.advisorId,
      accountId: row.accountId,
      principal: Money.fromAmount(parseFloat(row.principal)),
      remainingPrincipal: Money.fromAmount(parseFloat(row.remainingPrincipal)),
      annualInterestRate: Percentage.fromDecimal(parseFloat(row.annualInterestRate)),
      insuranceRate: Percentage.fromDecimal(parseFloat(row.insuranceRate)),
      monthlyPayment: Money.fromAmount(parseFloat(row.monthlyPayment)),
      durationMonths: row.durationMonths,
      remainingMonths: row.remainingMonths,
      status: row.status as LoanStatus,
      nextPaymentDate: row.nextPaymentDate,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
