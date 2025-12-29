import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import { IStockRepository } from '../../ports';
import { StockDto } from '../../dtos';
import { StockNotFoundError } from '@workspace/domain';

@UseCase()
export class UpdateStockUseCase {
  constructor(
    @Inject(TOKENS.IStockRepository)
    private stockRepository: IStockRepository
  ) {}

  async execute(
    stockId: string,
    companyName?: string,
    makeAvailable?: boolean
  ): Promise<StockDto> {
    const stock = await this.stockRepository.findById(stockId);

    if (!stock) {
      throw new StockNotFoundError(stockId);
    }

    if (companyName) {
      stock.updateInfo(companyName);
    }

    if (makeAvailable !== undefined) {
      if (makeAvailable) {
        stock.makeAvailable();
      } else {
        stock.makeUnavailable();
      }
    }

    const updatedStock = await this.stockRepository.update(stock);

    return {
      id: updatedStock.id,
      symbol: updatedStock.symbol,
      companyName: updatedStock.companyName,
      status: updatedStock.status,
      currentPrice: updatedStock.currentPrice?.getAmount(),
      createdAt: updatedStock.createdAt,
      updatedAt: updatedStock.updatedAt,
    };
  }
}
