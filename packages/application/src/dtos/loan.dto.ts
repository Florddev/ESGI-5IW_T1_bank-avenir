export interface CreateLoanDto {
    userId: string;
    advisorId: string;
    accountId: string;
    principal: number;
    annualInterestRate: number;
    insuranceRate: number;
    durationMonths: number;
}

export interface LoanDto {
    id: string;
    userId: string;
    advisorId: string;
    accountId: string;
    principal: number;
    remainingPrincipal: number;
    annualInterestRate: number;
    insuranceRate: number;
    monthlyPayment: number;
    durationMonths: number;
    remainingMonths: number;
    status: string;
    nextPaymentDate: Date;
    createdAt: Date;
}

export interface LoanListDto {
    loans: LoanDto[];
}

export interface ProcessLoanPaymentDto {
    loanId: string;
}

export interface LoanPaymentDto {
    principalAmount: number;
    interestAmount: number;
    insuranceAmount: number;
    totalAmount: number;
}
