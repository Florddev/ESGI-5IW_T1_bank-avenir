import { NextRequest } from 'next/server';
import '@/lib/di';
import { getServerContainer } from '@/lib/di';
import { SSERealtimeService } from '@workspace/service-realtime-sse';

/**
 * API Route pour Server-Sent Events (SSE)
 * Établit une connexion unidirectionnelle serveur → client
 * 
 * Usage: EventSource('/api/realtime/sse?userId=xxx')
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const clientId = searchParams.get('clientId') || crypto.randomUUID();

    if (!userId) {
        return new Response('Missing userId parameter', { status: 400 });
    }

    // Créer un ReadableStream pour SSE
    const stream = new ReadableStream({
        start(controller) {
            const container = getServerContainer();
            const realtimeService = container.resolve(SSERealtimeService);

            // Enregistrer le client
            realtimeService.registerSSEClient(userId, clientId, null, controller);

            // Envoyer un message de bienvenue
            const encoder = new TextEncoder();
            const welcomeMessage = `data: ${JSON.stringify({
                event: 'connected',
                data: { userId, clientId, timestamp: new Date().toISOString() },
            })}\n\n`;
            controller.enqueue(encoder.encode(welcomeMessage));

            // Keep-alive toutes les 30 secondes
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

            // Cleanup quand la connexion se ferme
            request.signal.addEventListener('abort', () => {
                clearInterval(keepAliveInterval);
                realtimeService.unregisterClient(clientId);
                controller.close();
            });
        },
    });

    // Headers SSE obligatoires
    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no', // Désactive le buffering nginx
        },
    });
}
