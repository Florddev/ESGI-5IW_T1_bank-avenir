import { inject, injectable } from 'tsyringe';
import { TOKENS } from '@workspace/shared/di';
import type { IRealtimeService, IConversationRepository, IUserRepository } from '../../ports';
import { UserRole } from '@workspace/domain/entities';

export interface NotifyTypingInput {
    conversationId: string;
    userId: string;
    recipientId?: string;
    isTyping: boolean;
}

@injectable()
export class NotifyTypingUseCase {
    constructor(
        @inject(TOKENS.IRealtimeServiceMessages)
        private realtimeService: IRealtimeService,
        @inject(TOKENS.IConversationRepository)
        private conversationRepository: IConversationRepository,
        @inject(TOKENS.IUserRepository)
        private userRepository: IUserRepository
    ) {}

    async execute(input: NotifyTypingInput): Promise<void> {
        const event = input.isTyping ? 'typing_start' : 'typing_stop';
        const eventData = {
            conversationId: input.conversationId,
            userId: input.userId,
            timestamp: new Date().toISOString(),
        };

        const conversation = await this.conversationRepository.findById(input.conversationId);
        
        if (conversation?.isGroupChat) {
            const advisors = await this.userRepository.findByRole(UserRole.ADVISOR);
            const directors = await this.userRepository.findByRole(UserRole.DIRECTOR);
            const staffIds = [...advisors, ...directors]
                .map(u => u.id)
                .filter(id => id !== input.userId);

            for (const staffId of staffIds) {
                await this.realtimeService.sendEventToUser(staffId, event, eventData);
            }
        } else if (input.recipientId) {
            await this.realtimeService.sendEventToUser(input.recipientId, event, eventData);
        }
    }
}
