import '@/lib/di';
import { NextRequest, NextResponse } from 'next/server';
import { MessagesController } from '@workspace/adapter-next/controllers';

/**
 * POST /api/messages/send
 * Envoie un message en temps réel à un destinataire
 */
export async function POST(request: NextRequest) {
    try {
        const controller = new MessagesController();
        const body = await request.json();

        const { conversationId, senderId, recipientId, content } = body;

        if (!conversationId || !senderId || !recipientId || !content) {
            return NextResponse.json(
                { error: 'Champs manquants' },
                { status: 400 }
            );
        }

        await controller.sendRealtimeMessage(conversationId, senderId, recipientId, content);

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
