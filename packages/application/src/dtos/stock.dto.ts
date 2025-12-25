export interface CreateStockDto {
    symbol: string;
    companyName: string;
}

export interface UpdateStockDto {
    stockId: string;
    companyName: string;
}

export interface ToggleStockAvailabilityDto {
    stockId: string;
    available: boolean;
}

export interface StockDto {
    id: string;
    symbol: string;
    companyName: string;
    status: string;
    currentPrice?: number;
    createdAt: Date;
}

export interface StockListDto {
    stocks: StockDto[];
}
