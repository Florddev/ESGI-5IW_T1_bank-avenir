export interface CreateOrderDto {
    userId: string;
    stockId: string;
    type: 'BUY' | 'SELL';
    quantity: number;
    pricePerShare: number;
}

export interface OrderDto {
    id: string;
    userId: string;
    stockId: string;
    type: string;
    quantity: number;
    pricePerShare: number;
    remainingQuantity: number;
    fees: number;
    status: string;
    createdAt: Date;
}

export interface OrderListDto {
    orders: OrderDto[];
}

export interface PortfolioDto {
    id: string;
    userId: string;
    stockId: string;
    stockSymbol: string;
    quantity: number;
    averagePurchasePrice: number;
    currentPrice?: number;
    totalValue?: number;
    gainLoss?: number;
}

export interface PortfolioListDto {
    portfolio: PortfolioDto[];
    totalValue: number;
    totalGainLoss: number;
}
