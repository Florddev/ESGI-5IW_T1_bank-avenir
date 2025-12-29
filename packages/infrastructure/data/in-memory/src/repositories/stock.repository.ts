import { Injectable } from '@workspace/shared/di';
import { IStockRepository } from '@workspace/application/ports';
import { Stock, StockStatus } from '@workspace/domain/entities';

@Injectable()
export class InMemoryStockRepository implements IStockRepository {
    private stocks: Map<string, Stock> = new Map();

    async findById(id: string): Promise<Stock | null> {
        return this.stocks.get(id) || null;
    }

    async findBySymbol(symbol: string): Promise<Stock | null> {
        for (const stock of this.stocks.values()) {
            if (stock.symbol === symbol.toUpperCase()) {
                return stock;
            }
        }
        return null;
    }

    async findAll(): Promise<Stock[]> {
        return Array.from(this.stocks.values());
    }

    async findAvailable(): Promise<Stock[]> {
        return Array.from(this.stocks.values()).filter(
            (stock) => stock.status === StockStatus.AVAILABLE
        );
    }

    async save(stock: Stock): Promise<Stock> {
        this.stocks.set(stock.id, stock);
        return stock;
    }

    async update(stock: Stock): Promise<Stock> {
        this.stocks.set(stock.id, stock);
        return stock;
    }

    async delete(id: string): Promise<void> {
        this.stocks.delete(id);
    }
}
