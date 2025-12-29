import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import { IStockRepository } from '../../ports';
import { Stock } from '@workspace/domain';
import { StockDto } from '../../dtos';

@UseCase()
export class CreateStockUseCase {
  constructor(
    @Inject(TOKENS.IStockRepository)
    private stockRepository: IStockRepository
  ) {}

  async execute(symbol: string, companyName: string): Promise<StockDto> {
    const stock = Stock.create(symbol, companyName);

    const savedStock = await this.stockRepository.save(stock);

    return {
      id: savedStock.id,
      symbol: savedStock.symbol,
      companyName: savedStock.companyName,
      status: savedStock.status,
      currentPrice: savedStock.currentPrice?.getAmount(),
      createdAt: savedStock.createdAt,
      updatedAt: savedStock.updatedAt,
    };
  }
}
