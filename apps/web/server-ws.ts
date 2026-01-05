import 'reflect-metadata';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { TOKENS } from '@workspace/shared/di';
import type { IRealtimeService } from '@workspace/application/ports';
import { container } from '@/lib/di';

const PORT = process.env.WS_PORT || 3001;

const httpServer = createServer();
const wss = new WebSocketServer({ server: httpServer });

const realtimeService = container.resolve<IRealtimeService>(TOKENS.IRealtimeService);

wss.on('connection', (ws, request) => {
    const url = new URL(request.url || '', `http://${request.headers.host}`);
    const userId = url.searchParams.get('userId');
    const clientId = url.searchParams.get('clientId') || crypto.randomUUID();

    if (!userId) {
        ws.close(1008, 'Missing userId parameter');
        return;
    }

    realtimeService.registerClient(userId, clientId, { ws });

    ws.on('message', (data) => {
        try {
            JSON.parse(data.toString());
        } catch (error) {
            ws.close(1007, 'Invalid message format');
        }
    });
});

httpServer.listen(PORT, () => {
    console.log(`🚀 Serveur WebSocket démarré sur ws://localhost:${PORT}`);
});

process.on('SIGTERM', async () => {
    if (realtimeService.shutdown) {
        await realtimeService.shutdown();
    }
    httpServer.close(() => {
        process.exit(0);
    });
});
