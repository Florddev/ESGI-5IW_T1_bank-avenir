import { UseCase, Inject, TOKENS } from '@workspace/shared/di';
import type { IOrderRepository, IStockRepository, IPortfolioRepository } from '../../ports';
import { Order, OrderStatus, OrderType, Portfolio } from '@workspace/domain/entities';
import { Money } from '@workspace/domain/value-objects';

interface MatchedOrder {
    buyOrder: Order;
    sellOrder: Order;
    quantity: number;
    price: number;
}

@UseCase()
export class MatchOrdersUseCase {
    constructor(
        @Inject(TOKENS.IOrderRepository) private readonly orderRepository: IOrderRepository,
        @Inject(TOKENS.IStockRepository) private readonly stockRepository: IStockRepository,
        @Inject(TOKENS.IPortfolioRepository) private readonly portfolioRepository: IPortfolioRepository,
    ) {}

    async execute(stockId: string): Promise<MatchedOrder[]> {
        const buyOrders = (await this.orderRepository.findPendingByStock(stockId, OrderType.BUY))
            .filter(order => order.status !== OrderStatus.FILLED)
            .sort((a, b) => {
                const priceDiff = b.pricePerShare.getAmount() - a.pricePerShare.getAmount();
                if (priceDiff !== 0) return priceDiff;
                return a.createdAt.getTime() - b.createdAt.getTime();
            });

        const sellOrders = (await this.orderRepository.findPendingByStock(stockId, OrderType.SELL))
            .filter(order => order.status !== OrderStatus.FILLED)
            .sort((a, b) => {
                const priceDiff = a.pricePerShare.getAmount() - b.pricePerShare.getAmount();
                if (priceDiff !== 0) return priceDiff;
                return a.createdAt.getTime() - b.createdAt.getTime();
            });

        const matches: MatchedOrder[] = [];

        for (const buyOrder of buyOrders) {
            if (buyOrder.remainingQuantity === 0) continue;

            for (const sellOrder of sellOrders) {
                if (sellOrder.remainingQuantity === 0) continue;

                if (buyOrder.pricePerShare.getAmount() >= sellOrder.pricePerShare.getAmount()) {
                    const matchQuantity = Math.min(
                        buyOrder.remainingQuantity,
                        sellOrder.remainingQuantity
                    );

                    const executionPrice = (buyOrder.pricePerShare.getAmount() + sellOrder.pricePerShare.getAmount()) / 2;

                    buyOrder.fill(matchQuantity);
                    sellOrder.fill(matchQuantity);

                    const executionPriceMoney = Money.fromAmount(executionPrice);

                    const buyerPortfolio = await this.portfolioRepository.findByUserIdAndStockId(buyOrder.userId, stockId);
                    if (buyerPortfolio) {
                        buyerPortfolio.addShares(matchQuantity, executionPriceMoney);
                        await this.portfolioRepository.update(buyerPortfolio);
                    } else {
                        const newBuyerPortfolio = Portfolio.create(buyOrder.userId, stockId, matchQuantity, executionPriceMoney);
                        await this.portfolioRepository.save(newBuyerPortfolio);
                    }

                    const sellerPortfolio = await this.portfolioRepository.findByUserIdAndStockId(sellOrder.userId, stockId);
                    if (sellerPortfolio) {
                        sellerPortfolio.removeShares(matchQuantity);
                        await this.portfolioRepository.update(sellerPortfolio);
                    }

                    matches.push({
                        buyOrder,
                        sellOrder,
                        quantity: matchQuantity,
                        price: executionPrice,
                    });

                    await this.orderRepository.save(buyOrder);
                    await this.orderRepository.save(sellOrder);

                    if (buyOrder.remainingQuantity === 0) break;
                }
            }
        }

        if (matches.length > 0) {
            const totalVolume = matches.reduce((sum, match) => sum + match.quantity, 0);
            const weightedPrice = matches.reduce(
                (sum, match) => sum + match.price * match.quantity,
                0
            ) / totalVolume;

            const stock = await this.stockRepository.findById(stockId);
            if (stock) {
                stock.updatePrice(Money.fromAmount(weightedPrice));
                await this.stockRepository.save(stock);
            }
        }

        return matches;
    }
}
