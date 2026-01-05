import '@/lib/di';
import { NextRequest, NextResponse } from 'next/server';
import { MessagesController } from '@workspace/adapter-next/controllers';

/**
 * POST /api/messages/typing
 * Notifie qu'un utilisateur est en train d'écrire
 */
export async function POST(request: NextRequest) {
    try {
        const controller = new MessagesController();
        const body = await request.json();
        const { conversationId, userId, recipientId, isTyping } = body;

        if (!conversationId || !userId || !recipientId || typeof isTyping !== 'boolean') {
            return NextResponse.json(
                { error: 'Champs manquants ou invalides' },
                { status: 400 }
            );
        }

        await controller.notifyTyping(conversationId, userId, recipientId, isTyping);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[API Typing] Erreur:', error);
        return NextResponse.json(
            { error: 'Erreur' },
            { status: 500 }
        );
    }
}
