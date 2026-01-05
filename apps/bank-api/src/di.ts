import 'reflect-metadata';
import { registerSqliteRepositories } from '@workspace/db-sqlite';
import { container, TOKENS } from '@workspace/shared/di';
import { AuthJwtService } from '@workspace/service-auth-jwt';
import { EmailConsoleService } from '@workspace/service-email-console';

let isInitialized = false;

function initializeDI() {
    if (isInitialized) {
        return;
    }

    registerSqliteRepositories();
    container.registerSingleton(TOKENS.IAuthService, AuthJwtService);
    container.registerSingleton(TOKENS.IEmailService, EmailConsoleService);

    isInitialized = true;
}

initializeDI();

export { container };
