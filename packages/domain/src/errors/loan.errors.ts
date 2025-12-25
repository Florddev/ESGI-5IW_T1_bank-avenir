import { DomainError } from './domain.error.js';

export class LoanNotFoundError extends DomainError {
    constructor(loanId: string) {
        super(`Loan not found: ${loanId}`);
    }
}

export class LoanNotActiveError extends DomainError {
    constructor(loanId: string) {
        super(`Loan is not active: ${loanId}`);
    }
}

export class InvalidLoanParametersError extends DomainError {
    constructor(message: string) {
        super(message);
    }
}
