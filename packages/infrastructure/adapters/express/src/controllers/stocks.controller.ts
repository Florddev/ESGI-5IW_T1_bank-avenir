import { container } from 'tsyringe';
import {
  GetAllStocksUseCase,
  BuyStockUseCase,
  SellStockUseCase,
  GetUserPortfolioUseCase,
  CreateStockUseCase,
  UpdateStockUseCase,
  DeleteStockUseCase,
} from '@workspace/application/use-cases';

export class StocksController {
  async getAllStocks() {
    const useCase = container.resolve(GetAllStocksUseCase);
    return await useCase.execute();
  }

  async buyStock(userId: string, stockId: string, quantity: number) {
    const useCase = container.resolve(BuyStockUseCase);
    return await useCase.execute(userId, stockId, quantity);
  }

  async sellStock(userId: string, stockId: string, quantity: number) {
    const useCase = container.resolve(SellStockUseCase);
    return await useCase.execute(userId, stockId, quantity);
  }

  async getUserPortfolio(userId: string) {
    const useCase = container.resolve(GetUserPortfolioUseCase);
    return await useCase.execute(userId);
  }

  async createStock(symbol: string, companyName: string) {
    const useCase = container.resolve(CreateStockUseCase);
    return await useCase.execute(symbol, companyName);
  }

  async updateStock(stockId: string, companyName?: string, makeAvailable?: boolean) {
    const useCase = container.resolve(UpdateStockUseCase);
    return await useCase.execute(stockId, companyName, makeAvailable);
  }

  async deleteStock(stockId: string) {
    const useCase = container.resolve(DeleteStockUseCase);
    return await useCase.execute(stockId);
  }
}
