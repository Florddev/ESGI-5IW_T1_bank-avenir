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
    
    const sseService = new SSERealtimeService();
    container.registerInstance(TOKENS.IRealtimeService, sseService);
    container.registerInstance(TOKENS.IRealtimeServiceMessages, sseService);
    container.registerInstance(TOKENS.IRealtimeServiceNotifications, sseService);

    isInitialized = true;
}

initializeDI();

export { container };
