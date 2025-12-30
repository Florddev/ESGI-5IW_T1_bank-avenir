import { NextRequest, NextResponse } from 'next/server';
import { getServerContainer } from '@/lib/init-server';
import { SendRealtimeMessageUseCase } from '@workspace/application/use-cases/message';

/**
 * POST /api/messages/send
 * Envoie un message en temps réel à un destinataire
 */
export async function POST(request: NextRequest) {
    try {
        const container = await getServerContainer();
        const useCase = container.resolve(SendRealtimeMessageUseCase);

        const body = await request.json();

        const { conversationId, senderId, recipientId, content } = body;

        if (!conversationId || !senderId || !recipientId || !content) {
            return NextResponse.json(
                { error: 'Champs manquants' },
                { status: 400 }
            );
        }

        await useCase.execute({
            conversationId,
            senderId,
            recipientId,
            content,
        });

        return NextResponse.json({
            success: true,
            message: 'Message envoyé en temps réel',
        });
    } catch (error) {
        console.error('[API Messages] Erreur:', error);
        return NextResponse.json(
            { error: 'Erreur lors de l\'envoi du message' },
            { status: 500 }
        );
    }
}
