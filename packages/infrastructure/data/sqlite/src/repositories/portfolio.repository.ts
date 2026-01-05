import { IPortfolioRepository } from '@workspace/application/ports';
import { Portfolio, PortfolioHolding, Money } from '@workspace/domain';
import { Repository, TOKENS } from '@workspace/shared/di';
import { db } from '../database';

interface PortfolioRow {
    id: string;
    user_id: string;
    created_at: number;
    updated_at: number;
}

interface HoldingRow {
    stock_id: string;
    quantity: number;
    average_buy_price: number;
}

@Repository(TOKENS.IPortfolioRepository)
export class SqlitePortfolioRepository implements IPortfolioRepository {
    private rowToPortfolio(portfolioRow: PortfolioRow, holdingRows: HoldingRow[]): Portfolio {
        const holdings = holdingRows.map((h) =>
            PortfolioHolding.create(h.stock_id, h.quantity, Money.fromAmount(h.average_buy_price))
        );

        return Portfolio.fromPersistence({
            id: portfolioRow.id,
            userId: portfolioRow.user_id,
            holdings,
            createdAt: new Date(portfolioRow.created_at),
            updatedAt: new Date(portfolioRow.updated_at),
        });
    }

    async findById(id: string): Promise<Portfolio | null> {
        const portfolioStmt = db.prepare('SELECT * FROM portfolios WHERE id = ?');
        const portfolioRow = portfolioStmt.get(id) as PortfolioRow | undefined;
        
        if (!portfolioRow) return null;

        const holdingsStmt = db.prepare('SELECT * FROM portfolio_holdings WHERE portfolio_id = ?');
        const holdingRows = holdingsStmt.all(id) as HoldingRow[];

        return this.rowToPortfolio(portfolioRow, holdingRows);
    }

    async findByUserId(userId: string): Promise<Portfolio | null> {
        const portfolioStmt = db.prepare('SELECT * FROM portfolios WHERE user_id = ?');
        const portfolioRow = portfolioStmt.get(userId) as PortfolioRow | undefined;
        
        if (!portfolioRow) return null;

        const holdingsStmt = db.prepare('SELECT * FROM portfolio_holdings WHERE portfolio_id = ?');
        const holdingRows = holdingsStmt.all(portfolioRow.id) as HoldingRow[];

        return this.rowToPortfolio(portfolioRow, holdingRows);
    }

    async findAll(): Promise<Portfolio[]> {
        const portfolioStmt = db.prepare('SELECT * FROM portfolios ORDER BY created_at DESC');
        const portfolioRows = portfolioStmt.all() as PortfolioRow[];

        return portfolioRows.map((portfolioRow) => {
            const holdingsStmt = db.prepare('SELECT * FROM portfolio_holdings WHERE portfolio_id = ?');
            const holdingRows = holdingsStmt.all(portfolioRow.id) as HoldingRow[];
            return this.rowToPortfolio(portfolioRow, holdingRows);
        });
    }

    async save(portfolio: Portfolio): Promise<Portfolio> {
        const portfolioStmt = db.prepare(`
            INSERT INTO portfolios (id, user_id, created_at, updated_at)
            VALUES (?, ?, ?, ?)
        `);
        
        portfolioStmt.run(
            portfolio.id,
            portfolio.userId,
            portfolio.createdAt.getTime(),
            portfolio.updatedAt.getTime()
        );

        const holdingStmt = db.prepare(`
            INSERT INTO portfolio_holdings (portfolio_id, stock_id, quantity, average_buy_price)
            VALUES (?, ?, ?, ?)
        `);

        for (const holding of portfolio.holdings) {
            holdingStmt.run(
                portfolio.id,
                holding.stockId,
                holding.quantity,
                holding.averageBuyPrice.getAmount()
            );
        }

        return portfolio;
    }

    async update(portfolio: Portfolio): Promise<Portfolio> {
        const portfolioStmt = db.prepare(`
            UPDATE portfolios
            SET updated_at = ?
            WHERE id = ?
        `);
        
        portfolioStmt.run(portfolio.updatedAt.getTime(), portfolio.id);

        // Delete existing holdings
        const deleteStmt = db.prepare('DELETE FROM portfolio_holdings WHERE portfolio_id = ?');
        deleteStmt.run(portfolio.id);

        // Re-insert holdings
        const holdingStmt = db.prepare(`
            INSERT INTO portfolio_holdings (portfolio_id, stock_id, quantity, average_buy_price)
            VALUES (?, ?, ?, ?)
        `);

        for (const holding of portfolio.holdings) {
            holdingStmt.run(
                portfolio.id,
                holding.stockId,
                holding.quantity,
                holding.averageBuyPrice.getAmount()
            );
        }

        return portfolio;
    }

    async delete(id: string): Promise<void> {
        const stmt = db.prepare('DELETE FROM portfolios WHERE id = ?');
        stmt.run(id);
        // Cascade delete will remove holdings automatically
    }
}
