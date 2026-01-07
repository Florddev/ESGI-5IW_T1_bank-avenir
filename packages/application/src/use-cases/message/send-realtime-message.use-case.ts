import { inject, injectable } from 'tsyringe';
import { TOKENS } from '@workspace/shared/di';
import type { IRealtimeService } from '../../ports';
import type { RealtimeMessageDto } from '../../dtos';

export interface SendRealtimeMessageInput {
    conversationId: string;
    senderId: string;
    recipientId: string;
    content: string;
}

@injectable()
export class SendRealtimeMessageUseCase {
    constructor(
        @inject(TOKENS.IRealtimeService) private realtimeService: IRealtimeService
    ) {}

    async execute(input: SendRealtimeMessageInput): Promise<void> {
        const messageDto: RealtimeMessageDto = {
            id: crypto.randomUUID(),
            conversationId: input.conversationId,
            senderId: input.senderId,
            content: input.content,
            createdAt: new Date().toISOString(),
            isRead: false,
        };

        await this.realtimeService.sendEventToUser(
            input.recipientId,
            'message_new',
            messageDto
        );

        console.log(`[UseCase] Message envoyé de ${input.senderId} vers ${input.recipientId}`);
    }
}
