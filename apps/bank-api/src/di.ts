import 'reflect-metadata';
import { registerPostgresModule } from '@workspace/db-postgres';
import { container, TOKENS } from '@workspace/shared/di';
import { AuthJwtService } from '@workspace/service-auth-jwt';
import { EmailConsoleService } from '@workspace/service-email-console';
import { SSERealtimeService } from '@workspace/service-realtime-sse';

let isInitialized = false;

function initializeDI() {
    if (isInitialized) {
        return;
    }

    registerPostgresModule();
    container.registerSingleton(TOKENS.IAuthService, AuthJwtService);
    container.registerSingleton(TOKENS.IEmailService, EmailConsoleService);
    container.registerSingleton(TOKENS.IRealtimeService, SSERealtimeService);

    isInitialized = true;
}

initializeDI();

export { container };
