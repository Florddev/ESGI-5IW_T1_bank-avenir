import { NextRequest, NextResponse } from 'next/server';
import { getServerContainer } from '@/lib/init-server';
import { NotifyTypingUseCase } from '@workspace/application/use-cases/message';

/**
 * POST /api/messages/typing
 * Notifie qu'un utilisateur est en train d'écrire
 */
export async function POST(request: NextRequest) {
    try {
        const container = await getServerContainer();
        const useCase = container.resolve(NotifyTypingUseCase);

        const body = await request.json();
        const { conversationId, userId, recipientId, isTyping } = body;

        if (!conversationId || !userId || !recipientId || typeof isTyping !== 'boolean') {
            return NextResponse.json(
                { error: 'Champs manquants ou invalides' },
                { status: 400 }
            );
        }

        await useCase.execute({
            conversationId,
            userId,
            recipientId,
            isTyping,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[API Typing] Erreur:', error);
        return NextResponse.json(
            { error: 'Erreur' },
            { status: 500 }
        );
    }
}
