// Database connection
export { db, DatabaseConnection } from './database';

// Migration
export { runMigrations } from './migrations/schema';

// Module registration
export { registerSqliteRepositories } from './sqlite-module';

// Repositories
export { SqliteUserRepository } from './repositories/user.repository';
export { SqliteStockRepository } from './repositories/stock.repository';
export { SqliteAccountRepository } from './repositories/account.repository';
export { SqliteTransactionRepository } from './repositories/transaction.repository';
export { SqliteLoanRepository } from './repositories/loan.repository';
export { SqlitePortfolioRepository } from './repositories/portfolio.repository';
export { SqliteOrderRepository } from './repositories/order.repository';
export { SqliteNotificationRepository } from './repositories/notification.repository';
export { SqliteConversationRepository } from './repositories/conversation.repository';
export { SqliteMessageRepository } from './repositories/message.repository';
