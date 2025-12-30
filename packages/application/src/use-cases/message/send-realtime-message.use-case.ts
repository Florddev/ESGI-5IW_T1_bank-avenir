import { inject, injectable } from 'tsyringe';
import { TOKENS } from '@workspace/shared/di';
import { IRealtimeService } from '../../ports';
import { RealtimeMessageDto } from '../../dtos';

export interface SendRealtimeMessageInput {
    conversationId: string;
    senderId: string;
    recipientId: string; // ou recipientIds: string[] pour groupe
    content: string;
}

/**
 * Use Case : Envoyer un message en temps réel
 * Utilise le service temps réel générique pour envoyer des messages instantanés
 */
@injectable()
export class SendRealtimeMessageUseCase {
    constructor(
        @inject(TOKENS.IRealtimeService)
        private realtimeService: IRealtimeService
    ) {}

    async execute(input: SendRealtimeMessageInput): Promise<void> {
        // 1. Créer le DTO du message
        const messageDto: RealtimeMessageDto = {
            id: crypto.randomUUID(),
            conversationId: input.conversationId,
            senderId: input.senderId,
            content: input.content,
            createdAt: new Date().toISOString(),
            isRead: false,
        };

        // 2. Envoyer en temps réel au destinataire
        await this.realtimeService.sendEventToUser(
            input.recipientId,
            'message_new',
            messageDto
        );

        console.log(`[UseCase] Message envoyé de ${input.senderId} vers ${input.recipientId}`);
    }
}
