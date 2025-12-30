import { IConversationRepository } from '@workspace/application/ports';
import { Conversation, ConversationStatus } from '@workspace/domain/entities';
import { Repository, TOKENS } from '@workspace/shared/di';

@Repository(TOKENS.IConversationRepository)
export class InMemoryConversationRepository implements IConversationRepository {
    private conversations: Map<string, Conversation> = new Map();

    async findById(id: string): Promise<Conversation | null> {
        return this.conversations.get(id) || null;
    }

    async findByClientId(clientId: string): Promise<Conversation[]> {
        return Array.from(this.conversations.values())
            .filter((conversation) => conversation.clientId === clientId)
            .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    }

    async findByAdvisorId(advisorId: string): Promise<Conversation[]> {
        return Array.from(this.conversations.values())
            .filter((conversation) => conversation.advisorId === advisorId)
            .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    }

    async findWaitingConversations(): Promise<Conversation[]> {
        return Array.from(this.conversations.values())
            .filter((conversation) => conversation.status === ConversationStatus.WAITING)
            .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }

    async findByUserId(userId: string): Promise<Conversation[]> {
        return Array.from(this.conversations.values())
            .filter((conversation) => conversation.clientId === userId || conversation.advisorId === userId)
            .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    }

    async save(conversation: Conversation): Promise<Conversation> {
        this.conversations.set(conversation.id, conversation);
        return conversation;
    }

    async update(conversation: Conversation): Promise<Conversation> {
        this.conversations.set(conversation.id, conversation);
        return conversation;
    }
}
