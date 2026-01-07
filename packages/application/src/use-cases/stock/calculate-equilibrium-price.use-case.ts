import { UseCase, Inject, TOKENS } from '@workspace/shared/di';
import type { IOrderRepository, IStockRepository } from '../../ports';
import { OrderType, OrderStatus } from '@workspace/domain/entities';

export interface EquilibriumPriceResult {
    stockId: string;
    equilibriumPrice: number;
    totalBuyVolume: number;
    totalSellVolume: number;
    matchableVolume: number;
}

@UseCase()
export class CalculateEquilibriumPriceUseCase {
    constructor(
        @Inject(TOKENS.IOrderRepository) private readonly orderRepository: IOrderRepository,
        @Inject(TOKENS.IStockRepository) private readonly stockRepository: IStockRepository,
    ) {}

    async execute(stockId: string): Promise<EquilibriumPriceResult> {
        const buyOrders = (await this.orderRepository.findPendingByStock(stockId, OrderType.BUY))
            .filter(order => order.status !== OrderStatus.FILLED)
            .sort((a, b) => b.pricePerShare.getAmount() - a.pricePerShare.getAmount());

        const sellOrders = (await this.orderRepository.findPendingByStock(stockId, OrderType.SELL))
            .filter(order => order.status !== OrderStatus.FILLED)
            .sort((a, b) => a.pricePerShare.getAmount() - b.pricePerShare.getAmount());

        const totalBuyVolume = buyOrders.reduce((sum, order) => sum + order.remainingQuantity, 0);
        const totalSellVolume = sellOrders.reduce((sum, order) => sum + order.remainingQuantity, 0);

        if (buyOrders.length === 0 || sellOrders.length === 0) {
            const stock = await this.stockRepository.findById(stockId);
            return {
                stockId,
                equilibriumPrice: stock?.currentPrice?.getAmount() || 0,
                totalBuyVolume,
                totalSellVolume,
                matchableVolume: 0,
            };
        }

        const highestBid = buyOrders[0].pricePerShare.getAmount();
        const lowestAsk = sellOrders[0].pricePerShare.getAmount();

        if (highestBid < lowestAsk) {
            const stock = await this.stockRepository.findById(stockId);
            return {
                stockId,
                equilibriumPrice: stock?.currentPrice?.getAmount() || (highestBid + lowestAsk) / 2,
                totalBuyVolume,
                totalSellVolume,
                matchableVolume: 0,
            };
        }

        let cumulativeBuyVolume = 0;
        let cumulativeSellVolume = 0;
        let equilibriumPrice = (highestBid + lowestAsk) / 2;
        let maxMatchableVolume = 0;

        const pricePoints = new Set([
            ...buyOrders.map(o => o.pricePerShare.getAmount()),
            ...sellOrders.map(o => o.pricePerShare.getAmount()),
        ]);

        for (const price of Array.from(pricePoints).sort((a, b) => b - a)) {
            const buyVolumeAtPrice = buyOrders
                .filter(o => o.pricePerShare.getAmount() >= price)
                .reduce((sum, o) => sum + o.remainingQuantity, 0);

            const sellVolumeAtPrice = sellOrders
                .filter(o => o.pricePerShare.getAmount() <= price)
                .reduce((sum, o) => sum + o.remainingQuantity, 0);

            const matchableVolume = Math.min(buyVolumeAtPrice, sellVolumeAtPrice);

            if (matchableVolume > maxMatchableVolume) {
                maxMatchableVolume = matchableVolume;
                equilibriumPrice = price;
                cumulativeBuyVolume = buyVolumeAtPrice;
                cumulativeSellVolume = sellVolumeAtPrice;
            }
        }

        return {
            stockId,
            equilibriumPrice,
            totalBuyVolume,
            totalSellVolume,
            matchableVolume: maxMatchableVolume,
        };
    }
}
