import { Injectable } from '@workspace/shared/di';
import { IPortfolioRepository } from '@workspace/application/ports';
import { Portfolio } from '@workspace/domain/entities';

@Injectable()
export class InMemoryPortfolioRepository implements IPortfolioRepository {
    private portfolios: Map<string, Portfolio> = new Map();

    async findById(id: string): Promise<Portfolio | null> {
        return this.portfolios.get(id) || null;
    }

    async findByUserId(userId: string): Promise<Portfolio[]> {
        return Array.from(this.portfolios.values()).filter(
            (portfolio) => portfolio.userId === userId
        );
    }

    async findByUserIdAndStockId(userId: string, stockId: string): Promise<Portfolio | null> {
        for (const portfolio of this.portfolios.values()) {
            if (portfolio.userId === userId && portfolio.stockId === stockId) {
                return portfolio;
            }
        }
        return null;
    }

    async save(portfolio: Portfolio): Promise<Portfolio> {
        this.portfolios.set(portfolio.id, portfolio);
        return portfolio;
    }

    async update(portfolio: Portfolio): Promise<Portfolio> {
        this.portfolios.set(portfolio.id, portfolio);
        return portfolio;
    }

    async delete(id: string): Promise<void> {
        this.portfolios.delete(id);
    }
}
