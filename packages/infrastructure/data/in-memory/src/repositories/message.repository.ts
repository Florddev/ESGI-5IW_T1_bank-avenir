import { Injectable } from '@workspace/shared/di';
import { IMessageRepository } from '@workspace/application/ports';
import { Message } from '@workspace/domain/entities';

@Injectable()
export class InMemoryMessageRepository implements IMessageRepository {
    private messages: Map<string, Message> = new Map();

    async findById(id: string): Promise<Message | null> {
        return this.messages.get(id) || null;
    }

    async findByConversationId(conversationId: string): Promise<Message[]> {
        return Array.from(this.messages.values())
            .filter((message) => message.conversationId === conversationId)
            .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }

    async findUnreadByConversationId(conversationId: string): Promise<Message[]> {
        return Array.from(this.messages.values())
            .filter((message) => message.conversationId === conversationId && !message.isRead)
            .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }

    async save(message: Message): Promise<Message> {
        this.messages.set(message.id, message);
        return message;
    }

    async markAllAsRead(conversationId: string): Promise<void> {
        const messages = await this.findByConversationId(conversationId);
        for (const message of messages) {
            message.markAsRead();
            await this.save(message);
        }
    }
}
