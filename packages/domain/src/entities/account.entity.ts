import { IBAN } from '../value-objects/iban';
import { Money } from '../value-objects/money';
import { Percentage } from '../value-objects/percentage';

export enum AccountType {
    CHECKING = 'CHECKING',
    SAVINGS = 'SAVINGS',
}

export interface AccountProps {
    id: string;
    userId: string;
    iban: IBAN;
    customName: string;
    type: AccountType;
    balance: Money;
    savingsRate?: Percentage;
    createdAt: Date;
    updatedAt: Date;
}

export class Account {
    private constructor(private readonly props: AccountProps) {}

    static create(
        userId: string,
        customName: string,
        type: AccountType,
        savingsRate?: Percentage
    ): Account {
        if (type === AccountType.SAVINGS && !savingsRate) {
            throw new Error('Savings account requires a savings rate');
        }

        return new Account({
            id: crypto.randomUUID(),
            userId,
            iban: IBAN.create(),
            customName,
            type,
            balance: Money.zero(),
            savingsRate,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    static fromPersistence(props: AccountProps): Account {
        return new Account(props);
    }

    credit(amount: Money): void {
        this.props.balance = this.props.balance.add(amount);
        this.props.updatedAt = new Date();
    }

    debit(amount: Money): void {
        if (this.props.balance.isLessThan(amount)) {
            throw new Error('Insufficient funds');
        }
        this.props.balance = this.props.balance.subtract(amount);
        this.props.updatedAt = new Date();
    }

    updateCustomName(name: string): void {
        this.props.customName = name;
        this.props.updatedAt = new Date();
    }

    updateSavingsRate(rate: Percentage): void {
        if (this.props.type !== AccountType.SAVINGS) {
            throw new Error('Only savings accounts can have a savings rate');
        }
        this.props.savingsRate = rate;
        this.props.updatedAt = new Date();
    }

    applyDailyInterest(): Money {
        if (this.props.type !== AccountType.SAVINGS || !this.props.savingsRate) {
            throw new Error('Only savings accounts can accrue interest');
        }

        const dailyRate = this.props.savingsRate.toDecimal() / 365;
        const interest = this.props.balance.multiply(dailyRate);
        this.credit(interest);
        return interest;
    }

    isSavingsAccount(): boolean {
        return this.props.type === AccountType.SAVINGS;
    }

    get id(): string {
        return this.props.id;
    }

    get userId(): string {
        return this.props.userId;
    }

    get iban(): IBAN {
        return this.props.iban;
    }

    get customName(): string {
        return this.props.customName;
    }

    get type(): AccountType {
        return this.props.type;
    }

    get balance(): Money {
        return this.props.balance;
    }

    get savingsRate(): Percentage | undefined {
        return this.props.savingsRate;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }
}
