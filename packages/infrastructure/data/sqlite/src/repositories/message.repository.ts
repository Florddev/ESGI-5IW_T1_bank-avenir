import { IMessageRepository } from '@workspace/application/ports';
import { Message } from '@workspace/domain';
import { Repository, TOKENS } from '@workspace/shared/di';
import { db } from '../database';

interface MessageRow {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    is_read: number;
    created_at: number;
    updated_at: number;
}

@Repository(TOKENS.IMessageRepository)
export class SqliteMessageRepository implements IMessageRepository {
    private rowToMessage(row: MessageRow): Message {
        return Message.fromPersistence({
            id: row.id,
            conversationId: row.conversation_id,
            senderId: row.sender_id,
            content: row.content,
            isRead: row.is_read === 1,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at),
        });
    }

    async findById(id: string): Promise<Message | null> {
        const stmt = db.prepare('SELECT * FROM messages WHERE id = ?');
        const row = stmt.get(id) as MessageRow | undefined;
        return row ? this.rowToMessage(row) : null;
    }

    async findByConversationId(conversationId: string): Promise<Message[]> {
        const stmt = db.prepare('SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC');
        const rows = stmt.all(conversationId) as MessageRow[];
        return rows.map((row) => this.rowToMessage(row));
    }

    async findUnreadByConversationId(conversationId: string, excludeUserId: string): Promise<Message[]> {
        const stmt = db.prepare('SELECT * FROM messages WHERE conversation_id = ? AND is_read = 0 AND sender_id != ? ORDER BY created_at ASC');
        const rows = stmt.all(conversationId, excludeUserId) as MessageRow[];
        return rows.map((row) => this.rowToMessage(row));
    }

    async save(message: Message): Promise<Message> {
        const stmt = db.prepare(`
            INSERT INTO messages (id, conversation_id, sender_id, content, is_read, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            message.id,
            message.conversationId,
            message.senderId,
            message.content,
            message.isRead ? 1 : 0,
            message.createdAt.getTime(),
            message.updatedAt.getTime()
        );

        return message;
    }

    async markAllAsRead(conversationId: string): Promise<void> {
        const stmt = db.prepare(`
            UPDATE messages
            SET is_read = 1, updated_at = ?
            WHERE conversation_id = ? AND is_read = 0
        `);

        stmt.run(Date.now(), conversationId);
    }
}
