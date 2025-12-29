import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import { Order, OrderType, Portfolio } from '@workspace/domain';
import { IOrderRepository, IStockRepository, IPortfolioRepository } from '../../ports';
import { OrderDto } from '../../dtos';
import { StockNotFoundError } from '@workspace/domain';

@UseCase()
export class BuyStockUseCase {
  constructor(
    @Inject(TOKENS.IOrderRepository)
    private orderRepository: IOrderRepository,
    @Inject(TOKENS.IStockRepository)
    private stockRepository: IStockRepository,
    @Inject(TOKENS.IPortfolioRepository)
    private portfolioRepository: IPortfolioRepository
  ) {}

  async execute(
    userId: string,
    stockId: string,
    quantity: number
  ): Promise<OrderDto> {
    const stock = await this.stockRepository.findById(stockId);

    if (!stock || !stock.currentPrice) {
      throw new StockNotFoundError(stockId);
    }

    const order = Order.create(userId, stockId, OrderType.BUY, quantity, stock.currentPrice);
    order.fill(quantity);

    const savedOrder = await this.orderRepository.save(order);

    const existingPortfolio = await this.portfolioRepository.findByUserIdAndStockId(userId, stockId);

    if (existingPortfolio) {
      existingPortfolio.addShares(quantity, stock.currentPrice);
      await this.portfolioRepository.update(existingPortfolio);
    } else {
      const portfolio = Portfolio.create(userId, stockId, quantity, stock.currentPrice);
      await this.portfolioRepository.save(portfolio);
    }

    return {
      id: savedOrder.id,
      userId: savedOrder.userId,
      stockId: savedOrder.stockId,
      type: savedOrder.type,
      quantity: savedOrder.quantity,
      pricePerShare: savedOrder.pricePerShare.getAmount(),
      remainingQuantity: savedOrder.remainingQuantity,
      fees: savedOrder.fees.getAmount(),
      status: savedOrder.status,
      createdAt: savedOrder.createdAt,
    };
  }
}
