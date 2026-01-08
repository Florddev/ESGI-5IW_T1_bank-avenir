import 'reflect-metadata';
//import { registerInMemoryModule } from '@workspace/db-in-memory';
import { registerPostgresModule } from '@workspace/db-postgres';
import { container, TOKENS } from '@workspace/shared/di';
import { AuthJwtService } from '@workspace/service-auth-jwt';
import { EmailConsoleService } from '@workspace/service-email-console';
import { SSERealtimeService } from '@workspace/service-realtime-sse';
import type { DependencyContainer } from 'tsyringe';

let isInitialized = false;

function initializeDI() {
    if (isInitialized) {
        return;
    }

    // Register data layer (repositories)
    //registerInMemoryModule();
    registerPostgresModule();

    // Register services
    container.registerSingleton(TOKENS.IAuthService, AuthJwtService);
    container.registerSingleton(TOKENS.IEmailService, EmailConsoleService);
    container.registerSingleton(TOKENS.IRealtimeService, SSERealtimeService);

    isInitialized = true;
}

initializeDI();

export function getServerContainer(): DependencyContainer {
    return container;
}

export { container };
