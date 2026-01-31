import 'reflect-metadata';
//import { registerInMemoryModule } from '@workspace/db-in-memory';
import { registerPostgresModule } from '@workspace/db-postgres';
import { container, TOKENS } from '@workspace/shared/di';
import { AuthJwtService } from '@workspace/service-auth-jwt';
import { EmailConsoleService } from '@workspace/service-email-console';
import { SSERealtimeService } from '@workspace/service-realtime-sse';
import type { IRealtimeService } from '@workspace/application/ports';
import type { DependencyContainer } from 'tsyringe';

const realtimeProtocol = process.env.REALTIME_PROTOCOL || 'sse';

// ---------------------------------------------------------------------------
// Realtime: singleton stored on globalThis to survive Next.js hot reloads.
// In websocket mode, server.ts sets __wsRealtimeService before DI loads.
// If it's missing (e.g. started with `next dev` instead of `server.ts`),
// we fall back to SSE so the app doesn't crash.
// ---------------------------------------------------------------------------
const globalForRealtime = globalThis as typeof globalThis & {
    __sseRealtimeService?: SSERealtimeService;
    __wsRealtimeService?: IRealtimeService;
};

const useWebSocket = realtimeProtocol === 'websocket' && !!globalForRealtime.__wsRealtimeService;

if (!useWebSocket && !globalForRealtime.__sseRealtimeService) {
    if (realtimeProtocol === 'websocket') {
        console.warn(
            '[DI] REALTIME_PROTOCOL=websocket but WebSocketRealtimeService not found on globalThis. ' +
            'Falling back to SSE. Use `pnpm dev:ws` to start with WebSocket support.'
        );
    }
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

    // Register realtime service based on protocol
    if (useWebSocket) {
        container.registerInstance(TOKENS.IRealtimeService, globalForRealtime.__wsRealtimeService!);
    } else {
        container.registerInstance(TOKENS.IRealtimeService, globalForRealtime.__sseRealtimeService!);
    }

    isInitialized = true;
}

initializeDI();

export function getServerContainer(): DependencyContainer {
    return container;
}

export { container };
