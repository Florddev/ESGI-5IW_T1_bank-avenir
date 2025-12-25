import { container } from '@workspace/shared/di';
import { TOKENS } from '@workspace/shared/di';
import {
    InMemoryUserRepository,
    InMemoryAccountRepository,
    InMemoryTransactionRepository,
    InMemoryStockRepository,
    InMemoryOrderRepository,
    InMemoryPortfolioRepository,
    InMemoryLoanRepository,
    InMemoryConversationRepository,
    InMemoryMessageRepository,
    InMemoryNotificationRepository,
} from './repositories';

export function registerInMemoryModule(): void {
    container.registerSingleton(TOKENS.IUserRepository, InMemoryUserRepository);
    container.registerSingleton(TOKENS.IAccountRepository, InMemoryAccountRepository);
    container.registerSingleton(TOKENS.ITransactionRepository, InMemoryTransactionRepository);
    container.registerSingleton(TOKENS.IStockRepository, InMemoryStockRepository);
    container.registerSingleton(TOKENS.IOrderRepository, InMemoryOrderRepository);
    container.registerSingleton(TOKENS.IPortfolioRepository, InMemoryPortfolioRepository);
    container.registerSingleton(TOKENS.ILoanRepository, InMemoryLoanRepository);
    container.registerSingleton(TOKENS.IConversationRepository, InMemoryConversationRepository);
    container.registerSingleton(TOKENS.IMessageRepository, InMemoryMessageRepository);
    container.registerSingleton(TOKENS.INotificationRepository, InMemoryNotificationRepository);
}
