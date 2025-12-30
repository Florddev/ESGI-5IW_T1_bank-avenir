import { NextRequest, NextResponse } from 'next/server';
import '@/lib/di';
import { getServerContainer } from '@/lib/di';
import { SSERealtimeService } from '@workspace/service-realtime-sse';

/**
 * GET /api/realtime/stats
 * Récupère les statistiques de connexion en temps réel
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('userId');

        const container = getServerContainer();
        const realtimeService = container.resolve(SSERealtimeService);

        if (userId) {
            // Stats pour un utilisateur spécifique
            const isConnected = realtimeService.isUserConnected(userId);
            const clientIds = realtimeService.getConnectedClients(userId);

            return NextResponse.json({
                userId,
                isConnected,
                connectedClients: clientIds.length,
                clientIds,
            });
        } else {
            // Stats globales
            const stats = realtimeService.getStats();
            return NextResponse.json(stats);
        }
    } catch (error) {
        console.error('Error getting realtime stats:', error);
        return NextResponse.json(
            { error: 'Failed to get stats' },
            { status: 500 }
        );
    }
}
