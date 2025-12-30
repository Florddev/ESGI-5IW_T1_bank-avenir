import { ILoanRepository } from '@workspace/application/ports';
import { Loan, LoanStatus } from '@workspace/domain/entities';
import { Repository, TOKENS } from '@workspace/shared/di';

@Repository(TOKENS.ILoanRepository)
export class InMemoryLoanRepository implements ILoanRepository {
    private loans: Map<string, Loan> = new Map();

    async findById(id: string): Promise<Loan | null> {
        return this.loans.get(id) || null;
    }

    async findByUserId(userId: string): Promise<Loan[]> {
        return Array.from(this.loans.values())
            .filter((loan) => loan.userId === userId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    async findByAdvisorId(advisorId: string): Promise<Loan[]> {
        return Array.from(this.loans.values())
            .filter((loan) => loan.advisorId === advisorId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    async findActiveLoans(): Promise<Loan[]> {
        return Array.from(this.loans.values()).filter((loan) => loan.status === LoanStatus.ACTIVE);
    }

    async findDuePayments(date: Date): Promise<Loan[]> {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        return Array.from(this.loans.values()).filter((loan) => {
            if (loan.status !== LoanStatus.ACTIVE) return false;
            const nextPayment = loan.nextPaymentDate;
            return nextPayment >= startOfDay && nextPayment <= endOfDay;
        });
    }

    async save(loan: Loan): Promise<Loan> {
        this.loans.set(loan.id, loan);
        return loan;
    }

    async update(loan: Loan): Promise<Loan> {
        this.loans.set(loan.id, loan);
        return loan;
    }
}
