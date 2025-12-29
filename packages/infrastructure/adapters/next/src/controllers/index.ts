import 'reflect-metadata';
import { registerInMemoryModule } from '@workspace/db-in-memory';
import { container, TOKENS } from '@workspace/shared/di';
import { AuthJwtService } from '@workspace/service-auth-jwt';
import { EmailConsoleService } from '@workspace/service-email-console';

let isInitialized = false;

if (!isInitialized) {
    registerInMemoryModule();
    container.registerSingleton(TOKENS.IAuthService, AuthJwtService);
    container.registerSingleton(TOKENS.IEmailService, EmailConsoleService);
    isInitialized = true;
}

export { AuthController } from './auth.controller';
export { AccountsController } from './accounts.controller';
export { TransactionsController } from './transactions.controller';
export { LoansController } from './loans.controller';
export { StocksController } from './stocks.controller';
export { NotificationsController } from './notifications.controller';
export { AdminController } from './admin.controller';
export { ConversationsController } from './conversations.controller';
