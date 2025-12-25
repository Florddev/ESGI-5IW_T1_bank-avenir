import { Loan } from '@workspace/domain/entities';

export interface ILoanRepository {
    findById(id: string): Promise<Loan | null>;
    findByUserId(userId: string): Promise<Loan[]>;
    findByAdvisorId(advisorId: string): Promise<Loan[]>;
    findActiveLoans(): Promise<Loan[]>;
    findDuePayments(date: Date): Promise<Loan[]>;
    save(loan: Loan): Promise<Loan>;
}
