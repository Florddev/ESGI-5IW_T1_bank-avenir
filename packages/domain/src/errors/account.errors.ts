import { DomainError } from './domain.error.js';

export class AccountNotFoundError extends DomainError {
    constructor(identifier: string) {
        super(`Account not found: ${identifier}`);
    }
}

export class InsufficientFundsError extends DomainError {
    constructor(accountId: string) {
        super(`Insufficient funds in account: ${accountId}`);
    }
}

export class InvalidAccountTypeError extends DomainError {
    constructor(message: string) {
        super(message);
    }
}

export class AccountNotOwnedByUserError extends DomainError {
    constructor(accountId: string, userId: string) {
        super(`Account ${accountId} is not owned by user ${userId}`);
    }
}
