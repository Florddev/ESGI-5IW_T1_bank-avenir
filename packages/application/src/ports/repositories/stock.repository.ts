import { Stock } from '@workspace/domain/entities';

export interface IStockRepository {
    findById(id: string): Promise<Stock | null>;
    findBySymbol(symbol: string): Promise<Stock | null>;
    findAll(): Promise<Stock[]>;
    findAvailable(): Promise<Stock[]>;
    save(stock: Stock): Promise<Stock>;
    delete(id: string): Promise<void>;
}
