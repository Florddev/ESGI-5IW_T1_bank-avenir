import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import { IStockRepository } from '../../ports';
import { StockNotFoundError } from '@workspace/domain';

@UseCase()
export class DeleteStockUseCase {
  constructor(
    @Inject(TOKENS.IStockRepository)
    private stockRepository: IStockRepository
  ) {}

  async execute(stockId: string): Promise<void> {
    const stock = await this.stockRepository.findById(stockId);

    if (!stock) {
      throw new StockNotFoundError(stockId);
    }

    await this.stockRepository.delete(stockId);
  }
}
