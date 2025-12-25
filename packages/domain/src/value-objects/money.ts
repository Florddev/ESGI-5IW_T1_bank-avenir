export class Money {
    private readonly amount: number;
    private readonly currency: string;

    private constructor(amount: number, currency: string = 'EUR') {
        if (amount < 0) {
            throw new Error('Money amount cannot be negative');
        }
        this.amount = Math.round(amount * 100) / 100;
        this.currency = currency;
    }

    static fromAmount(amount: number, currency: string = 'EUR'): Money {
        return new Money(amount, currency);
    }

    static zero(currency: string = 'EUR'): Money {
        return new Money(0, currency);
    }

    add(other: Money): Money {
        this.ensureSameCurrency(other);
        return new Money(this.amount + other.amount, this.currency);
    }

    subtract(other: Money): Money {
        this.ensureSameCurrency(other);
        const result = this.amount - other.amount;
        if (result < 0) {
            throw new Error('Insufficient funds');
        }
        return new Money(result, this.currency);
    }

    multiply(factor: number): Money {
        return new Money(this.amount * factor, this.currency);
    }

    divide(divisor: number): Money {
        if (divisor === 0) {
            throw new Error('Cannot divide by zero');
        }
        return new Money(this.amount / divisor, this.currency);
    }

    isGreaterThan(other: Money): boolean {
        this.ensureSameCurrency(other);
        return this.amount > other.amount;
    }

    isGreaterThanOrEqual(other: Money): boolean {
        this.ensureSameCurrency(other);
        return this.amount >= other.amount;
    }

    isLessThan(other: Money): boolean {
        this.ensureSameCurrency(other);
        return this.amount < other.amount;
    }

    isZero(): boolean {
        return this.amount === 0;
    }

    getAmount(): number {
        return this.amount;
    }

    getCurrency(): string {
        return this.currency;
    }

    private ensureSameCurrency(other: Money): void {
        if (this.currency !== other.currency) {
            throw new Error(`Currency mismatch: ${this.currency} vs ${other.currency}`);
        }
    }

    equals(other: Money): boolean {
        return this.amount === other.amount && this.currency === other.currency;
    }
}
