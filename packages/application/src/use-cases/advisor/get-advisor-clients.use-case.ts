import { UseCase, Inject, TOKENS } from '@workspace/shared/di';
import type { IUserRepository, IConversationRepository } from '../../ports';
import { Conversation } from '@workspace/domain/entities';

export interface AdvisorClientDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    activeConversationsCount: number;
    createdAt: Date;
}

@UseCase()
export class GetAdvisorClientsUseCase {
    constructor(
        @Inject(TOKENS.IUserRepository)
        private userRepository: IUserRepository,
        @Inject(TOKENS.IConversationRepository)
        private conversationRepository: IConversationRepository
    ) {}

    async execute(advisorId: string): Promise<AdvisorClientDto[]> {
        const conversations = await this.conversationRepository.findByAdvisorId(advisorId);

        const clientIds = [...new Set(conversations.map((c: Conversation) => c.clientId))];

        const clients = await Promise.all(
            clientIds.map(async (clientId) => {
                const user = await this.userRepository.findById(clientId);
                if (!user) return null;

                const activeConversations = conversations.filter(
                    (c: Conversation) => c.clientId === clientId &&
                    (c.status === 'OPEN' || c.status === 'ASSIGNED')
                ).length;

                return {
                    id: user.id,
                    email: user.email.toString(),
                    firstName: user.firstName,
                    lastName: user.lastName,
                    activeConversationsCount: activeConversations,
                    createdAt: user.createdAt
                };
            })
        );

        return clients
            .filter((c): c is AdvisorClientDto => c !== null)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
}
