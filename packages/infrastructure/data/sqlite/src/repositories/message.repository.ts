import { IMessageRepository } from '@workspace/application/ports';
import { Message } from '@workspace/domain';
import { Repository, TOKENS } from '@workspace/shared/di';
import { db } from '../database';

interface MessageRow {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    created_at: number;
}

@Repository(TOKENS.IMessageRepository)
export class SqliteMessageRepository implements IMessageRepository {
    private rowToMessage(row: MessageRow): Message {
        return Message.fromPersistence({
            id: row.id,
            conversationId: row.conversation_id,
            senderId: row.sender_id,
            content: row.content,
            createdAt: new Date(row.created_at),
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

    async findAll(): Promise<Message[]> {
        const stmt = db.prepare('SELECT * FROM messages ORDER BY created_at DESC');
        const rows = stmt.all() as MessageRow[];
        return rows.map((row) => this.rowToMessage(row));
    }

    async save(message: Message): Promise<Message> {
        const stmt = db.prepare(`
            INSERT INTO messages (id, conversation_id, sender_id, content, created_at)
            VALUES (?, ?, ?, ?, ?)
        `);
        
        stmt.run(
            message.id,
            message.conversationId,
            message.senderId,
            message.content,
            message.createdAt.getTime()
        );
        
        return message;
    }

    async delete(id: string): Promise<void> {
        const stmt = db.prepare('DELETE FROM messages WHERE id = ?');
        stmt.run(id);
    }
}
