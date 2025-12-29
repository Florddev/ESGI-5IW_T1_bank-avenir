import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import { IPortfolioRepository, IStockRepository } from '../../ports';
import { PortfolioDto, PortfolioListDto } from '../../dtos';
import { Money } from '@workspace/domain';

@UseCase()
export class GetUserPortfolioUseCase {
  constructor(
    @Inject(TOKENS.IPortfolioRepository)
    private portfolioRepository: IPortfolioRepository,
    @Inject(TOKENS.IStockRepository)
    private stockRepository: IStockRepository
  ) {}

  async execute(userId: string): Promise<PortfolioListDto> {
    const portfolios = await this.portfolioRepository.findByUserId(userId);

    if (!portfolios || portfolios.length === 0) {
      return {
        portfolio: [],
        totalValue: 0,
        totalGainLoss: 0,
      };
    }

    const portfolioDtos: PortfolioDto[] = [];
    let totalValue = 0;
    let totalGainLoss = 0;

    for (const p of portfolios) {
      const stock = await this.stockRepository.findById(p.stockId);
      const currentPrice = stock?.currentPrice || Money.zero();
      const value = p.getTotalValue(currentPrice).getAmount();
      const gainLoss = p.getGainLoss(currentPrice).getAmount();

      portfolioDtos.push({
        id: p.id,
        userId: p.userId,
        stockId: p.stockId,
        stockSymbol: stock?.symbol || '',
        quantity: p.quantity,
        averagePurchasePrice: p.averagePurchasePrice.getAmount(),
        currentPrice: currentPrice.getAmount(),
        totalValue: value,
        gainLoss,
      });

      totalValue += value;
      totalGainLoss += gainLoss;
    }

    return {
      portfolio: portfolioDtos,
      totalValue,
      totalGainLoss,
    };
  }
}
