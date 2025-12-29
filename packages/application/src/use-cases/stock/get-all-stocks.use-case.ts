import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import { IStockRepository } from '../../ports';
import { StockDto } from '../../dtos';

@UseCase()
export class GetAllStocksUseCase {
  constructor(
    @Inject(TOKENS.IStockRepository)
    private stockRepository: IStockRepository
  ) {}

  async execute(): Promise<StockDto[]> {
    const stocks = await this.stockRepository.findAll();

    return stocks.map((stock) => ({
      id: stock.id,
      symbol: stock.symbol,
      companyName: stock.companyName,
      status: stock.status,
      currentPrice: stock.currentPrice?.getAmount(),
      createdAt: stock.createdAt,
    }));
  }
}
