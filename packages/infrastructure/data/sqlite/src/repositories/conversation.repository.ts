import { IConversationRepository } from '@workspace/application/ports';
import { Conversation, ConversationStatus } from '@workspace/domain';
import { Repository, TOKENS } from '@workspace/shared/di';
import { db } from '../database';

interface ConversationRow {
    id: string;
    client_id: string;
    advisor_id: string | null;
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
            clientId: row.client_id,
            advisorId: row.advisor_id || undefined,
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

    async findByClientId(clientId: string): Promise<Conversation[]> {
        const stmt = db.prepare('SELECT * FROM conversations WHERE client_id = ? ORDER BY updated_at DESC');
        const rows = stmt.all(clientId) as ConversationRow[];
        return rows.map((row) => this.rowToConversation(row));
    }

    async findByAdvisorId(advisorId: string): Promise<Conversation[]> {
        const stmt = db.prepare('SELECT * FROM conversations WHERE advisor_id = ? ORDER BY updated_at DESC');
        const rows = stmt.all(advisorId) as ConversationRow[];
        return rows.map((row) => this.rowToConversation(row));
    }

    async findWaitingConversations(): Promise<Conversation[]> {
        const stmt = db.prepare('SELECT * FROM conversations WHERE status = ? ORDER BY created_at ASC');
        const rows = stmt.all(ConversationStatus.WAITING) as ConversationRow[];
        return rows.map((row) => this.rowToConversation(row));
    }

    async findByUserId(userId: string): Promise<Conversation[]> {
        const stmt = db.prepare('SELECT * FROM conversations WHERE client_id = ? OR advisor_id = ? ORDER BY updated_at DESC');
        const rows = stmt.all(userId, userId) as ConversationRow[];
        return rows.map((row) => this.rowToConversation(row));
    }

    async save(conversation: Conversation): Promise<Conversation> {
        const stmt = db.prepare(`
            INSERT INTO conversations (id, client_id, advisor_id, subject, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            conversation.id,
            conversation.clientId,
            conversation.advisorId || null,
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
            SET client_id = ?, advisor_id = ?, subject = ?, status = ?, updated_at = ?
            WHERE id = ?
        `);

        stmt.run(
            conversation.clientId,
            conversation.advisorId || null,
            conversation.subject,
            conversation.status,
            conversation.updatedAt.getTime(),
            conversation.id
        );

        return conversation;
    }
}
