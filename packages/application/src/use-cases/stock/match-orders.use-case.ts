import { UseCase, Inject, TOKENS } from '@workspace/shared/di';
import { IOrderRepository, IStockRepository } from '../../ports';
import { Order, OrderStatus, OrderType } from '@workspace/domain/entities';
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
    ) {}

    async execute(stockId: string): Promise<MatchedOrder[]> {
        const buyOrders = (await this.orderRepository.findPendingByStock(stockId, OrderType.BUY))
            .filter(order => order.status !== OrderStatus.FILLED)
            .sort((a, b) => {
                const priceDiff = b.pricePerShare.amount - a.pricePerShare.amount;
                if (priceDiff !== 0) return priceDiff;
                return a.createdAt.getTime() - b.createdAt.getTime();
            });

        const sellOrders = (await this.orderRepository.findPendingByStock(stockId, OrderType.SELL))
            .filter(order => order.status !== OrderStatus.FILLED)
            .sort((a, b) => {
                const priceDiff = a.pricePerShare.amount - b.pricePerShare.amount;
                if (priceDiff !== 0) return priceDiff;
                return a.createdAt.getTime() - b.createdAt.getTime();
            });

        const matches: MatchedOrder[] = [];

        for (const buyOrder of buyOrders) {
            if (buyOrder.remainingQuantity === 0) continue;

            for (const sellOrder of sellOrders) {
                if (sellOrder.remainingQuantity === 0) continue;

                if (buyOrder.pricePerShare.amount >= sellOrder.pricePerShare.amount) {
                    const matchQuantity = Math.min(
                        buyOrder.remainingQuantity,
                        sellOrder.remainingQuantity
                    );

                    const executionPrice = (buyOrder.pricePerShare.amount + sellOrder.pricePerShare.amount) / 2;

                    buyOrder.fill(matchQuantity);
                    sellOrder.fill(matchQuantity);

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
