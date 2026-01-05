import { ILoanRepository } from '@workspace/application/ports';
import { Loan, LoanStatus, Money } from '@workspace/domain';
import { Repository, TOKENS } from '@workspace/shared/di';
import { db } from '../database';

interface LoanRow {
    id: string;
    user_id: string;
    amount: number;
    interest_rate: number;
    duration_months: number;
    remaining_balance: number;
    monthly_payment: number;
    status: string;
    approved_at: number | null;
    created_at: number;
    updated_at: number;
}

@Repository(TOKENS.ILoanRepository)
export class SqliteLoanRepository implements ILoanRepository {
    private rowToLoan(row: LoanRow): Loan {
        return Loan.fromPersistence({
            id: row.id,
            userId: row.user_id,
            amount: Money.fromAmount(row.amount),
            interestRate: row.interest_rate,
            durationMonths: row.duration_months,
            remainingBalance: Money.fromAmount(row.remaining_balance),
            monthlyPayment: Money.fromAmount(row.monthly_payment),
            status: row.status as LoanStatus,
            approvedAt: row.approved_at ? new Date(row.approved_at) : undefined,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at),
        });
    }

    async findById(id: string): Promise<Loan | null> {
        const stmt = db.prepare('SELECT * FROM loans WHERE id = ?');
        const row = stmt.get(id) as LoanRow | undefined;
        return row ? this.rowToLoan(row) : null;
    }

    async findByUserId(userId: string): Promise<Loan[]> {
        const stmt = db.prepare('SELECT * FROM loans WHERE user_id = ? ORDER BY created_at DESC');
        const rows = stmt.all(userId) as LoanRow[];
        return rows.map((row) => this.rowToLoan(row));
    }

    async findAll(): Promise<Loan[]> {
        const stmt = db.prepare('SELECT * FROM loans ORDER BY created_at DESC');
        const rows = stmt.all() as LoanRow[];
        return rows.map((row) => this.rowToLoan(row));
    }

    async save(loan: Loan): Promise<Loan> {
        const stmt = db.prepare(`
            INSERT INTO loans (id, user_id, amount, interest_rate, duration_months, remaining_balance, monthly_payment, status, approved_at, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run(
            loan.id,
            loan.userId,
            loan.amount.getAmount(),
            loan.interestRate,
            loan.durationMonths,
            loan.remainingBalance.getAmount(),
            loan.monthlyPayment.getAmount(),
            loan.status,
            loan.approvedAt ? loan.approvedAt.getTime() : null,
            loan.createdAt.getTime(),
            loan.updatedAt.getTime()
        );
        
        return loan;
    }

    async update(loan: Loan): Promise<Loan> {
        const stmt = db.prepare(`
            UPDATE loans
            SET remaining_balance = ?, monthly_payment = ?, status = ?, approved_at = ?, updated_at = ?
            WHERE id = ?
        `);
        
        stmt.run(
            loan.remainingBalance.getAmount(),
            loan.monthlyPayment.getAmount(),
            loan.status,
            loan.approvedAt ? loan.approvedAt.getTime() : null,
            loan.updatedAt.getTime(),
            loan.id
        );
        
        return loan;
    }

    async delete(id: string): Promise<void> {
        const stmt = db.prepare('DELETE FROM loans WHERE id = ?');
        stmt.run(id);
    }
}
