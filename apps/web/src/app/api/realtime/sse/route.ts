import '@/lib/di';
import { NextRequest } from 'next/server';
import { RealtimeController } from '@workspace/adapter-next/controllers';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const clientId = searchParams.get('clientId') || crypto.randomUUID();

    if (!userId) {
        return new Response('Missing userId parameter', { status: 400 });
    }

    const stream = new ReadableStream({
        start(controller) {
            const realtimeController = new RealtimeController();
            const realtimeService = realtimeController.getRealtimeService();

            realtimeService.registerClient(userId, clientId, {
                response: null,
                controller: controller
            });

            const encoder = new TextEncoder();
            const welcomeMessage = `data: ${JSON.stringify({
                event: 'connected',
                data: { userId, clientId, timestamp: new Date().toISOString() },
            })}\n\n`;
            controller.enqueue(encoder.encode(welcomeMessage));

            const keepAliveInterval = setInterval(() => {
                try {
                    const pingMessage = `data: ${JSON.stringify({
                        event: 'ping',
                        data: { timestamp: new Date().toISOString() },
                    })}\n\n`;
                    controller.enqueue(encoder.encode(pingMessage));
                } catch (error) {
                    clearInterval(keepAliveInterval);
                    realtimeService.unregisterClient(clientId);
                    controller.close();
                }
            }, 30000);

            request.signal.addEventListener('abort', () => {
                clearInterval(keepAliveInterval);
                realtimeService.unregisterClient(clientId);
                controller.close();
            });
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no',
        },
    });
}
