import { inject, injectable } from 'tsyringe';
import { TOKENS } from '@workspace/shared/di';
import { IRealtimeService } from '../../ports';

export interface NotifyTypingInput {
    conversationId: string;
    userId: string;
    recipientId: string;
    isTyping: boolean; // true = start, false = stop
}

/**
 * Use Case : Notifier qu'un utilisateur est en train d'écrire
 * Exemple d'utilisation légère du temps réel (événements éphémères)
 */
@injectable()
export class NotifyTypingUseCase {
    constructor(
        @inject(TOKENS.IRealtimeService)
        private realtimeService: IRealtimeService
    ) {}

    async execute(input: NotifyTypingInput): Promise<void> {
        const event = input.isTyping ? 'typing_start' : 'typing_stop';

        await this.realtimeService.sendEventToUser(
            input.recipientId,
            event,
            {
                conversationId: input.conversationId,
                userId: input.userId,
                timestamp: new Date().toISOString(),
            }
        );
    }
}
