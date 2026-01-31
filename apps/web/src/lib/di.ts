import 'reflect-metadata';
//import { registerInMemoryModule } from '@workspace/db-in-memory';
import { registerPostgresModule } from '@workspace/db-postgres';
import { container, TOKENS } from '@workspace/shared/di';
import { AuthJwtService } from '@workspace/service-auth-jwt';
import { EmailConsoleService } from '@workspace/service-email-console';
import { SSERealtimeService } from '@workspace/service-realtime-sse';
import type { DependencyContainer } from 'tsyringe';

const globalForRealtime = globalThis as typeof globalThis & {
    __sseRealtimeService?: SSERealtimeService;
};

if (!globalForRealtime.__sseRealtimeService) {
    globalForRealtime.__sseRealtimeService = new SSERealtimeService();
}

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
    container.registerInstance(TOKENS.IRealtimeService, globalForRealtime.__sseRealtimeService!);

    isInitialized = true;
}

initializeDI();

export function getServerContainer(): DependencyContainer {
    return container;
}

export { container };
