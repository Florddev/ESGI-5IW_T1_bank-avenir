import { IConversationRepository } from '@workspace/application/ports';
import { Conversation, ConversationStatus } from '@workspace/domain';
import { Repository, TOKENS } from '@workspace/shared/di';
import { db } from '../database';

interface ConversationRow {
    id: string;
    user_id: string;
    subject: string;
    status: string;
    created_at: number;
    updated_at: number;
}

@Repository(TOKENS.IConversationRepository)
export class SqliteConversationRepository implements IConversationRepository {
    private rowToConversation(row: ConversationRow): Conversation {
        return Conversation.fromPersistence({
            id: row.id,
            userId: row.user_id,
            subject: row.subject,
            status: row.status as ConversationStatus,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at),
        });
    }

    async findById(id: string): Promise<Conversation | null> {
        const stmt = db.prepare('SELECT * FROM conversations WHERE id = ?');
        const row = stmt.get(id) as ConversationRow | undefined;
        return row ? this.rowToConversation(row) : null;
    }

    async findByUserId(userId: string): Promise<Conversation[]> {
        const stmt = db.prepare('SELECT * FROM conversations WHERE user_id = ? ORDER BY updated_at DESC');
        const rows = stmt.all(userId) as ConversationRow[];
        return rows.map((row) => this.rowToConversation(row));
    }

    async findAll(): Promise<Conversation[]> {
        const stmt = db.prepare('SELECT * FROM conversations ORDER BY updated_at DESC');
        const rows = stmt.all() as ConversationRow[];
        return rows.map((row) => this.rowToConversation(row));
    }

    async save(conversation: Conversation): Promise<Conversation> {
        const stmt = db.prepare(`
            INSERT INTO conversations (id, user_id, subject, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run(
            conversation.id,
            conversation.userId,
            conversation.subject,
            conversation.status,
            conversation.createdAt.getTime(),
            conversation.updatedAt.getTime()
        );
        
        return conversation;
    }

    async update(conversation: Conversation): Promise<Conversation> {
        const stmt = db.prepare(`
            UPDATE conversations
            SET subject = ?, status = ?, updated_at = ?
            WHERE id = ?
        `);
        
        stmt.run(
            conversation.subject,
            conversation.status,
            conversation.updatedAt.getTime(),
            conversation.id
        );
        
        return conversation;
    }

    async delete(id: string): Promise<void> {
        const stmt = db.prepare('DELETE FROM conversations WHERE id = ?');
        stmt.run(id);
    }
}
