import { Message } from '@workspace/domain/entities';

export interface IMessageRepository {
    findById(id: string): Promise<Message | null>;
    findByConversationId(conversationId: string): Promise<Message[]>;
    findUnreadByConversationId(conversationId: string, excludeUserId: string): Promise<Message[]>;
    save(message: Message): Promise<Message>;
    markAllAsRead(conversationId: string): Promise<void>;
}
