import { NextRequest, NextResponse } from 'next/server';
import '@/lib/di';
import { getServerContainer } from '@/lib/di';
import { SendRealtimeNotificationUseCase } from '@workspace/application/use-cases/notification';
import { NotificationType } from '@workspace/domain/entities';

/**
 * POST /api/realtime/notify
 * Envoie une notification en temps réel à un utilisateur
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, type, title, message } = body;

        if (!userId || !type || !title || !message) {
            return NextResponse.json(
                { error: 'Missing required fields: userId, type, title, message' },
                { status: 400 }
            );
        }

        // Valider le type de notification
        if (!Object.values(NotificationType).includes(type)) {
            return NextResponse.json(
                { error: 'Invalid notification type' },
                { status: 400 }
            );
        }

        const container = getServerContainer();
        const useCase = container.resolve(SendRealtimeNotificationUseCase);

        const notification = await useCase.execute({
            userId,
            type,
            title,
            message,
        });

        return NextResponse.json({
            success: true,
            notification: {
                id: notification.id,
                userId: notification.userId,
                type: notification.type,
                title: notification.title,
                message: notification.message,
                isRead: notification.isRead,
                createdAt: notification.createdAt.toISOString(),
                updatedAt: notification.updatedAt.toISOString(),
            },
        });
    } catch (error) {
        console.error('Error sending realtime notification:', error);
        return NextResponse.json(
            { error: 'Failed to send notification' },
            { status: 500 }
        );
    }
}
