import { DomainError } from './domain.error';

export class OrderNotFoundError extends DomainError {
    constructor(orderId: string) {
        super(`Order not found: ${orderId}`);
    }
}

export class InvalidOrderQuantityError extends DomainError {
    constructor(message: string) {
        super(message);
    }
}

export class InsufficientSharesError extends DomainError {
    constructor(stockSymbol: string, available: number, requested: number) {
        super(
            `Insufficient shares of ${stockSymbol}. Available: ${available}, Requested: ${requested}`
        );
    }
}

export class OrderAlreadyFilledError extends DomainError {
    constructor(orderId: string) {
        super(`Order already filled: ${orderId}`);
    }
}
