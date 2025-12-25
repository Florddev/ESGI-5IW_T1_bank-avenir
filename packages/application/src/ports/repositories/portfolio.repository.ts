import { Portfolio } from '@workspace/domain/entities';

export interface IPortfolioRepository {
    findById(id: string): Promise<Portfolio | null>;
    findByUserId(userId: string): Promise<Portfolio[]>;
    findByUserIdAndStockId(userId: string, stockId: string): Promise<Portfolio | null>;
    save(portfolio: Portfolio): Promise<Portfolio>;
    delete(id: string): Promise<void>;
}
