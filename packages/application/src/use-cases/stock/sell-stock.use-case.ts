import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import { Order, OrderType } from '@workspace/domain';
import { IOrderRepository, IStockRepository, IPortfolioRepository } from '../../ports';
import { OrderDto } from '../../dtos';
import { StockNotFoundError, InsufficientStockError } from '@workspace/domain';

@UseCase()
export class SellStockUseCase {
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

    const portfolio = await this.portfolioRepository.findByUserIdAndStockId(userId, stockId);

    if (!portfolio || portfolio.quantity < quantity) {
      throw new InsufficientStockError(stock.symbol, portfolio?.quantity ?? 0, quantity);
    }

    const order = Order.create(userId, stockId, OrderType.SELL, quantity, stock.currentPrice);
    order.fill(quantity);

    const savedOrder = await this.orderRepository.save(order);

    portfolio.removeShares(quantity);
    await this.portfolioRepository.update(portfolio);

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
