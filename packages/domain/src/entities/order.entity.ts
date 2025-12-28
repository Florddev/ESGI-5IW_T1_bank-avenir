import { Money } from '../value-objects/money';

export enum OrderType {
    BUY = 'BUY',
    SELL = 'SELL',
}

export enum OrderStatus {
    PENDING = 'PENDING',
    PARTIALLY_FILLED = 'PARTIALLY_FILLED',
    FILLED = 'FILLED',
    CANCELLED = 'CANCELLED',
}

export interface OrderProps {
    id: string;
    userId: string;
    stockId: string;
    type: OrderType;
    quantity: number;
    pricePerShare: Money;
    remainingQuantity: number;
    fees: Money;
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
}

export class Order {
    private constructor(private readonly props: OrderProps) {}

    static create(
        userId: string,
        stockId: string,
        type: OrderType,
        quantity: number,
        pricePerShare: Money
    ): Order {
        if (quantity <= 0) {
            throw new Error('Order quantity must be positive');
        }

        const transactionFee = Money.fromAmount(1);

        return new Order({
            id: crypto.randomUUID(),
            userId,
            stockId,
            type,
            quantity,
            pricePerShare,
            remainingQuantity: quantity,
            fees: transactionFee,
            status: OrderStatus.PENDING,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    static fromPersistence(props: OrderProps): Order {
        return new Order(props);
    }

    fill(quantity: number): void {
        if (quantity <= 0 || quantity > this.props.remainingQuantity) {
            throw new Error('Invalid fill quantity');
        }

        this.props.remainingQuantity -= quantity;

        if (this.props.remainingQuantity === 0) {
            this.props.status = OrderStatus.FILLED;
        } else {
            this.props.status = OrderStatus.PARTIALLY_FILLED;
        }

        this.props.updatedAt = new Date();
    }

    cancel(): void {
        if (this.props.status === OrderStatus.FILLED) {
            throw new Error('Cannot cancel a filled order');
        }
        this.props.status = OrderStatus.CANCELLED;
        this.props.updatedAt = new Date();
    }

    getTotalCost(): Money {
        const sharesValue = this.props.pricePerShare.multiply(this.props.quantity);
        return sharesValue.add(this.props.fees);
    }

    getRemainingCost(): Money {
        return this.props.pricePerShare.multiply(this.props.remainingQuantity);
    }

    isFilled(): boolean {
        return this.props.status === OrderStatus.FILLED;
    }

    isPending(): boolean {
        return (
            this.props.status === OrderStatus.PENDING ||
            this.props.status === OrderStatus.PARTIALLY_FILLED
        );
    }

    get id(): string {
        return this.props.id;
    }

    get userId(): string {
        return this.props.userId;
    }

    get stockId(): string {
        return this.props.stockId;
    }

    get type(): OrderType {
        return this.props.type;
    }

    get quantity(): number {
        return this.props.quantity;
    }

    get pricePerShare(): Money {
        return this.props.pricePerShare;
    }

    get remainingQuantity(): number {
        return this.props.remainingQuantity;
    }

    get fees(): Money {
        return this.props.fees;
    }

    get status(): OrderStatus {
        return this.props.status;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }
}
