import 'reflect-metadata';
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { WebSocketServer, type WebSocket } from 'ws';

const { WebSocketRealtimeService } = await import('@workspace/service-realtime-websocket');

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '3000', 10);

const globalForWs = globalThis as typeof globalThis & {
    __wsRealtimeService?: InstanceType<typeof WebSocketRealtimeService>;
};

if (!globalForWs.__wsRealtimeService) {
    globalForWs.__wsRealtimeService = new WebSocketRealtimeService();
    console.log('[Server] ✓ WebSocketRealtimeService initialized for messages/conversations');
}

const wsRealtimeService = globalForWs.__wsRealtimeService;

const app = next({ dev });
const handle = app.getRequestHandler();

await app.prepare();

const server = createServer((req, res) => {
    const parsedUrl = parse(req.url || '', true);
    handle(req, res, parsedUrl);
});

const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (request, socket, head) => {
    const { pathname } = parse(request.url || '', true);

    if (pathname === '/ws') {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    }
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

server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
    console.log(`> WebSocket (Messages) available on ws://localhost:${port}/ws`);
    console.log(`> SSE (Notifications) available on /api/realtime/sse`);
    console.log(`> Dual Realtime Strategy: WebSocket for conversations, SSE for notifications`);
    console.log(`> Mode: ${dev ? 'development' : 'production'}`);
});

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
