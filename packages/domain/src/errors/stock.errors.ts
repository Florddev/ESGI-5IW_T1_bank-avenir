import { DomainError } from './domain.error';

export class StockNotFoundError extends DomainError {
    constructor(identifier: string) {
        super(`Stock not found: ${identifier}`);
    }
}

export class StockNotAvailableError extends DomainError {
    constructor(symbol: string) {
        super(`Stock is not available for trading: ${symbol}`);
    }
}

export class StockAlreadyExistsError extends DomainError {
    constructor(symbol: string) {
        super(`Stock already exists with symbol: ${symbol}`);
    }
}
