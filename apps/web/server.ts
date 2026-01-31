import 'reflect-metadata';
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { WebSocketServer, type WebSocket } from 'ws';

// ---------------------------------------------------------------------------
// Dynamic import of the workspace package (avoids ESM/CJS mismatch)
// ---------------------------------------------------------------------------
const { WebSocketRealtimeService } = await import('@workspace/service-realtime-websocket');

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '3000', 10);

// ---------------------------------------------------------------------------
// 1. Initialize WebSocketRealtimeService and store it on globalThis
//    so that di.ts can pick it up when REALTIME_PROTOCOL=websocket.
// ---------------------------------------------------------------------------
const globalForWs = globalThis as typeof globalThis & {
    __wsRealtimeService?: InstanceType<typeof WebSocketRealtimeService>;
};

if (!globalForWs.__wsRealtimeService) {
    globalForWs.__wsRealtimeService = new WebSocketRealtimeService();
}

const wsRealtimeService = globalForWs.__wsRealtimeService;

// ---------------------------------------------------------------------------
// 2. Prepare the Next.js application
// ---------------------------------------------------------------------------
const app = next({ dev });
const handle = app.getRequestHandler();

await app.prepare();

const server = createServer((req, res) => {
    const parsedUrl = parse(req.url || '', true);
    handle(req, res, parsedUrl);
});

// ---------------------------------------------------------------------------
// 3. Attach WebSocket server in noServer mode (path: /ws)
// ---------------------------------------------------------------------------
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (request, socket, head) => {
    const { pathname } = parse(request.url || '', true);

    if (pathname === '/ws') {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    }
    // Other upgrade requests (e.g. Next.js HMR) are handled by Next.js internally
});

wss.on('connection', (ws: WebSocket, request) => {
    const url = new URL(request.url || '', `http://${request.headers.host}`);
    const userId = url.searchParams.get('userId');
    const clientId = url.searchParams.get('clientId') || crypto.randomUUID();

    if (!userId) {
        ws.close(1008, 'Missing userId parameter');
        return;
    }

    console.log(`[WebSocket] Client connected: userId=${userId}, clientId=${clientId}`);
    wsRealtimeService.registerClient(userId, clientId, { ws });

    ws.on('message', (data: Buffer) => {
        try {
            JSON.parse(data.toString());
        } catch {
            ws.close(1007, 'Invalid message format');
        }
    });
});

// ---------------------------------------------------------------------------
// 4. Start listening
// ---------------------------------------------------------------------------
server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
    console.log(`> WebSocket available on ws://localhost:${port}/ws`);
    console.log(`> Mode: ${dev ? 'development' : 'production'}`);
});

// ---------------------------------------------------------------------------
// 5. Graceful shutdown
// ---------------------------------------------------------------------------
const shutdown = () => {
    console.log('[Server] Shutting down...');
    wsRealtimeService.shutdown();
    wss.close();
    server.close(() => {
        process.exit(0);
    });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
