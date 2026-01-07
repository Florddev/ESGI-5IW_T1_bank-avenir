import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import { Order, OrderType, Money } from '@workspace/domain';
import type { IOrderRepository, IStockRepository } from '../../ports';
import type { OrderDto } from '../../dtos';
import { StockNotFoundError } from '@workspace/domain';
import { MatchOrdersUseCase } from './match-orders.use-case';
import { container } from '@workspace/shared/di';

@UseCase()
export class PlaceBuyOrderUseCase {
  constructor(
    @Inject(TOKENS.IOrderRepository)
    private orderRepository: IOrderRepository,
    @Inject(TOKENS.IStockRepository)
    private stockRepository: IStockRepository
  ) {}

  async execute(
    userId: string,
    stockId: string,
    quantity: number,
    pricePerShare: number
  ): Promise<OrderDto> {
    const stock = await this.stockRepository.findById(stockId);

    if (!stock) {
      throw new StockNotFoundError(stockId);
    }

    const price = Money.fromAmount(pricePerShare);
    const order = Order.create(userId, stockId, OrderType.BUY, quantity, price);

    const savedOrder = await this.orderRepository.save(order);

    const matchOrdersUseCase = container.resolve(MatchOrdersUseCase);
    await matchOrdersUseCase.execute(stockId);

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
