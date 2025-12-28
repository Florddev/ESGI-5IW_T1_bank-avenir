import { Money } from '../value-objects/money';

export interface PortfolioProps {
    id: string;
    userId: string;
    stockId: string;
    quantity: number;
    averagePurchasePrice: Money;
    createdAt: Date;
    updatedAt: Date;
}

export class Portfolio {
    private constructor(private readonly props: PortfolioProps) {}

    static create(
        userId: string,
        stockId: string,
        quantity: number,
        purchasePrice: Money
    ): Portfolio {
        if (quantity <= 0) {
            throw new Error('Portfolio quantity must be positive');
        }

        return new Portfolio({
            id: crypto.randomUUID(),
            userId,
            stockId,
            quantity,
            averagePurchasePrice: purchasePrice,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    static fromPersistence(props: PortfolioProps): Portfolio {
        return new Portfolio(props);
    }

    addShares(quantity: number, pricePerShare: Money): void {
        if (quantity <= 0) {
            throw new Error('Quantity must be positive');
        }

        const totalCurrentCost = this.props.averagePurchasePrice.multiply(this.props.quantity);
        const newCost = pricePerShare.multiply(quantity);
        const totalCost = totalCurrentCost.add(newCost);

        this.props.quantity += quantity;
        this.props.averagePurchasePrice = totalCost.divide(this.props.quantity);
        this.props.updatedAt = new Date();
    }

    removeShares(quantity: number): void {
        if (quantity <= 0) {
            throw new Error('Quantity must be positive');
        }

        if (quantity > this.props.quantity) {
            throw new Error('Cannot remove more shares than owned');
        }

        this.props.quantity -= quantity;
        this.props.updatedAt = new Date();
    }

    getTotalValue(currentPrice: Money): Money {
        return currentPrice.multiply(this.props.quantity);
    }

    getTotalCost(): Money {
        return this.props.averagePurchasePrice.multiply(this.props.quantity);
    }

    getGainLoss(currentPrice: Money): Money {
        const currentValue = this.getTotalValue(currentPrice);
        const totalCost = this.getTotalCost();
        return Money.fromAmount(currentValue.getAmount() - totalCost.getAmount());
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

    get quantity(): number {
        return this.props.quantity;
    }

    get averagePurchasePrice(): Money {
        return this.props.averagePurchasePrice;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }
}
