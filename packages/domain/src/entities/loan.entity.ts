import { Money } from '../value-objects/money.js';
import { Percentage } from '../value-objects/percentage.js';

export enum LoanStatus {
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
    DEFAULTED = 'DEFAULTED',
}

export interface LoanProps {
    id: string;
    userId: string;
    advisorId: string;
    accountId: string;
    principal: Money;
    remainingPrincipal: Money;
    annualInterestRate: Percentage;
    insuranceRate: Percentage;
    monthlyPayment: Money;
    durationMonths: number;
    remainingMonths: number;
    status: LoanStatus;
    nextPaymentDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

export class Loan {
    private constructor(private readonly props: LoanProps) {}

    static create(
        userId: string,
        advisorId: string,
        accountId: string,
        principal: Money,
        annualInterestRate: Percentage,
        insuranceRate: Percentage,
        durationMonths: number
    ): Loan {
        if (durationMonths <= 0) {
            throw new Error('Loan duration must be positive');
        }

        const monthlyPayment = this.calculateMonthlyPayment(
            principal,
            annualInterestRate,
            insuranceRate,
            durationMonths
        );

        const nextPaymentDate = new Date();
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

        return new Loan({
            id: crypto.randomUUID(),
            userId,
            advisorId,
            accountId,
            principal,
            remainingPrincipal: principal,
            annualInterestRate,
            insuranceRate,
            monthlyPayment,
            durationMonths,
            remainingMonths: durationMonths,
            status: LoanStatus.ACTIVE,
            nextPaymentDate,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    static fromPersistence(props: LoanProps): Loan {
        return new Loan(props);
    }

    private static calculateMonthlyPayment(
        principal: Money,
        annualInterestRate: Percentage,
        insuranceRate: Percentage,
        durationMonths: number
    ): Money {
        const monthlyRate = annualInterestRate.toDecimal() / 12;
        const principalAmount = principal.getAmount();

        const loanPayment =
            monthlyRate === 0
                ? principalAmount / durationMonths
                : (principalAmount * monthlyRate * Math.pow(1 + monthlyRate, durationMonths)) /
                  (Math.pow(1 + monthlyRate, durationMonths) - 1);

        const insuranceAmount = (principalAmount * insuranceRate.toDecimal()) / durationMonths;

        return Money.fromAmount(loanPayment + insuranceAmount);
    }

    processPayment(): { principal: Money; interest: Money; insurance: Money } {
        if (this.props.status !== LoanStatus.ACTIVE) {
            throw new Error('Cannot process payment for inactive loan');
        }

        const monthlyRate = this.props.annualInterestRate.toDecimal() / 12;
        const interestAmount = this.props.remainingPrincipal.multiply(monthlyRate);
        const insuranceAmount = this.props.principal.multiply(
            this.props.insuranceRate.toDecimal() / this.props.durationMonths
        );

        const principalAmount = this.props.monthlyPayment
            .subtract(interestAmount)
            .subtract(insuranceAmount);

        this.props.remainingPrincipal = this.props.remainingPrincipal.subtract(principalAmount);
        this.props.remainingMonths -= 1;

        if (this.props.remainingMonths === 0) {
            this.props.status = LoanStatus.COMPLETED;
        } else {
            const nextPaymentDate = new Date(this.props.nextPaymentDate);
            nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
            this.props.nextPaymentDate = nextPaymentDate;
        }

        this.props.updatedAt = new Date();

        return {
            principal: principalAmount,
            interest: interestAmount,
            insurance: insuranceAmount,
        };
    }

    markAsDefaulted(): void {
        if (this.props.status !== LoanStatus.ACTIVE) {
            throw new Error('Only active loans can be defaulted');
        }
        this.props.status = LoanStatus.DEFAULTED;
        this.props.updatedAt = new Date();
    }

    isActive(): boolean {
        return this.props.status === LoanStatus.ACTIVE;
    }

    get id(): string {
        return this.props.id;
    }

    get userId(): string {
        return this.props.userId;
    }

    get advisorId(): string {
        return this.props.advisorId;
    }

    get accountId(): string {
        return this.props.accountId;
    }

    get principal(): Money {
        return this.props.principal;
    }

    get remainingPrincipal(): Money {
        return this.props.remainingPrincipal;
    }

    get annualInterestRate(): Percentage {
        return this.props.annualInterestRate;
    }

    get insuranceRate(): Percentage {
        return this.props.insuranceRate;
    }

    get monthlyPayment(): Money {
        return this.props.monthlyPayment;
    }

    get durationMonths(): number {
        return this.props.durationMonths;
    }

    get remainingMonths(): number {
        return this.props.remainingMonths;
    }

    get status(): LoanStatus {
        return this.props.status;
    }

    get nextPaymentDate(): Date {
        return this.props.nextPaymentDate;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }
}
