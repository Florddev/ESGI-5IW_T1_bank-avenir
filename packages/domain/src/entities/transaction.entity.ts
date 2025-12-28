import { Money } from '../value-objects/money';

export enum TransactionType {
    TRANSFER = 'TRANSFER',
    INTEREST = 'INTEREST',
    LOAN_DISBURSEMENT = 'LOAN_DISBURSEMENT',
    LOAN_PAYMENT = 'LOAN_PAYMENT',
    STOCK_PURCHASE = 'STOCK_PURCHASE',
    STOCK_SALE = 'STOCK_SALE',
}

export enum TransactionStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
}

export interface TransactionProps {
    id: string;
    fromAccountId: string;
    toAccountId: string;
    amount: Money;
    type: TransactionType;
    status: TransactionStatus;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

export class Transaction {
    private constructor(private readonly props: TransactionProps) {}

    static create(
        fromAccountId: string,
        toAccountId: string,
        amount: Money,
        type: TransactionType,
        description?: string
    ): Transaction {
        if (amount.isZero()) {
            throw new Error('Transaction amount must be greater than zero');
        }

        if (fromAccountId === toAccountId) {
            throw new Error('Cannot transfer to the same account');
        }

        return new Transaction({
            id: crypto.randomUUID(),
            fromAccountId,
            toAccountId,
            amount,
            type,
            status: TransactionStatus.PENDING,
            description,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    static fromPersistence(props: TransactionProps): Transaction {
        return new Transaction(props);
    }

    complete(): void {
        if (this.props.status !== TransactionStatus.PENDING) {
            throw new Error('Only pending transactions can be completed');
        }
        this.props.status = TransactionStatus.COMPLETED;
        this.props.updatedAt = new Date();
    }

    fail(): void {
        if (this.props.status !== TransactionStatus.PENDING) {
            throw new Error('Only pending transactions can be failed');
        }
        this.props.status = TransactionStatus.FAILED;
        this.props.updatedAt = new Date();
    }

    get id(): string {
        return this.props.id;
    }

    get fromAccountId(): string {
        return this.props.fromAccountId;
    }

    get toAccountId(): string {
        return this.props.toAccountId;
    }

    get amount(): Money {
        return this.props.amount;
    }

    get type(): TransactionType {
        return this.props.type;
    }

    get status(): TransactionStatus {
        return this.props.status;
    }

    get description(): string | undefined {
        return this.props.description;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }
}
