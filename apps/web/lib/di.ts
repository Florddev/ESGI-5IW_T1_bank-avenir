import 'reflect-metadata';
import { registerInMemoryModule } from '@workspace/db-in-memory';
import { container, TOKENS } from '@workspace/shared/di';
import { AuthJwtService } from '@workspace/service-auth-jwt';
import { EmailConsoleService } from '@workspace/service-email-console';

let isInitialized = false;

function initializeDI() {
    if (isInitialized) {
        return;
    }

    registerInMemoryModule();

    container.registerSingleton(TOKENS.IAuthService, AuthJwtService);
    container.registerSingleton(TOKENS.IEmailService, EmailConsoleService);

    isInitialized = true;
}

initializeDI();
