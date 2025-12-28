import { DomainError } from './domain.error';

export class TransactionNotFoundError extends DomainError {
    constructor(transactionId: string) {
        super(`Transaction not found: ${transactionId}`);
    }
}

export class InvalidTransactionAmountError extends DomainError {
    constructor(message: string) {
        super(message);
    }
}

export class TransactionFailedError extends DomainError {
    constructor(reason: string) {
        super(`Transaction failed: ${reason}`);
    }
}
