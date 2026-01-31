import 'reflect-metadata';
import { registerPostgresModule } from '@workspace/db-postgres';
import { container, TOKENS } from '@workspace/shared/di';
import { AuthJwtService } from '@workspace/service-auth-jwt';
import { EmailConsoleService } from '@workspace/service-email-console';
import { SSERealtimeService } from '@workspace/service-realtime-sse';
import type { IRealtimeService } from '@workspace/application/ports';
import type { DependencyContainer } from 'tsyringe';


const globalForRealtime = globalThis as typeof globalThis & {
    __sseRealtimeService?: SSERealtimeService;
    __wsRealtimeService?: IRealtimeService;
};

if (!globalForRealtime.__sseRealtimeService) {
    globalForRealtime.__sseRealtimeService = new SSERealtimeService();
}

let isInitialized = false;

function initializeDI() {
    if (isInitialized) {
        return;
    }

    registerPostgresModule();

    container.registerSingleton(TOKENS.IAuthService, AuthJwtService);
    container.registerSingleton(TOKENS.IEmailService, EmailConsoleService);

    isInitialized = true;
}

initializeDI();
function getRealtimeServiceMessages(): IRealtimeService {
    const hasWebSocket = !!globalForRealtime.__wsRealtimeService;
    if (hasWebSocket) {
        return globalForRealtime.__wsRealtimeService!;
    }
    return globalForRealtime.__sseRealtimeService!;
}

function getRealtimeServiceNotifications(): IRealtimeService {
    return globalForRealtime.__sseRealtimeService!;
}

container.register(TOKENS.IRealtimeServiceMessages, {
    useFactory: () => getRealtimeServiceMessages()
});

container.register(TOKENS.IRealtimeServiceNotifications, {
    useFactory: () => getRealtimeServiceNotifications()
});

container.register(TOKENS.IRealtimeService, {
    useFactory: () => getRealtimeServiceMessages()
});

export function getServerContainer(): DependencyContainer {
    return container;
}

export { container };
