import { Money } from '../value-objects/money.js';

export enum StockStatus {
    AVAILABLE = 'AVAILABLE',
    UNAVAILABLE = 'UNAVAILABLE',
}

export interface StockProps {
    id: string;
    symbol: string;
    companyName: string;
    status: StockStatus;
    currentPrice?: Money;
    createdAt: Date;
    updatedAt: Date;
}

export class Stock {
    private constructor(private readonly props: StockProps) {}

    static create(symbol: string, companyName: string): Stock {
        return new Stock({
            id: crypto.randomUUID(),
            symbol: symbol.toUpperCase(),
            companyName,
            status: StockStatus.AVAILABLE,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    static fromPersistence(props: StockProps): Stock {
        return new Stock(props);
    }

    updatePrice(price: Money): void {
        this.props.currentPrice = price;
        this.props.updatedAt = new Date();
    }

    makeAvailable(): void {
        this.props.status = StockStatus.AVAILABLE;
        this.props.updatedAt = new Date();
    }

    makeUnavailable(): void {
        this.props.status = StockStatus.UNAVAILABLE;
        this.props.updatedAt = new Date();
    }

    updateInfo(companyName: string): void {
        this.props.companyName = companyName;
        this.props.updatedAt = new Date();
    }

    isAvailable(): boolean {
        return this.props.status === StockStatus.AVAILABLE;
    }

    get id(): string {
        return this.props.id;
    }

    get symbol(): string {
        return this.props.symbol;
    }

    get companyName(): string {
        return this.props.companyName;
    }

    get status(): StockStatus {
        return this.props.status;
    }

    get currentPrice(): Money | undefined {
        return this.props.currentPrice;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }
}
