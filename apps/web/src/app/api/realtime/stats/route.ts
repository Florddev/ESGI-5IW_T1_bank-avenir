import '@/lib/di';
import { NextRequest, NextResponse } from 'next/server';
import { RealtimeController } from '@workspace/adapter-next/controllers';

/**
 * GET /api/realtime/stats
 * Récupère les statistiques de connexion en temps réel
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('userId');

        const controller = new RealtimeController();
        const stats = await controller.getStats(userId || undefined);

        return NextResponse.json(stats);
    } catch (error) {
        console.error('Error getting realtime stats:', error);
        return NextResponse.json(
            { error: 'Failed to get stats' },
            { status: 500 }
        );
    }
}
