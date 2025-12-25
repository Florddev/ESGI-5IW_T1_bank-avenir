import { Conversation } from '@workspace/domain/entities';

export interface IConversationRepository {
    findById(id: string): Promise<Conversation | null>;
    findByClientId(clientId: string): Promise<Conversation[]>;
    findByAdvisorId(advisorId: string): Promise<Conversation[]>;
    findWaitingConversations(): Promise<Conversation[]>;
    save(conversation: Conversation): Promise<Conversation>;
}
