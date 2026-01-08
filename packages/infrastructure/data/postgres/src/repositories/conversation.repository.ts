import { eq, or } from 'drizzle-orm';
import { Repository, TOKENS } from '@workspace/shared/di';
import type { IConversationRepository } from '@workspace/application/ports';
import { Conversation, ConversationStatus } from '@workspace/domain/entities';
import { getDatabase } from '../database';
import { conversations } from '../schema';

@Repository(TOKENS.IConversationRepository)
export class PostgresConversationRepository implements IConversationRepository {
  private get db() {
    return getDatabase();
  }

  async findById(id: string): Promise<Conversation | null> {
    const result = await this.db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id))
      .limit(1);

    if (result.length === 0) return null;

    return this.rowToEntity(result[0]!);
  }

  async findByClientId(clientId: string): Promise<Conversation[]> {
    const result = await this.db
      .select()
      .from(conversations)
      .where(eq(conversations.clientId, clientId));

    return result.map(row => this.rowToEntity(row));
  }

  async findByAdvisorId(advisorId: string): Promise<Conversation[]> {
    const result = await this.db
      .select()
      .from(conversations)
      .where(eq(conversations.advisorId, advisorId));

    return result.map(row => this.rowToEntity(row));
  }

  async findWaitingConversations(): Promise<Conversation[]> {
    const result = await this.db
      .select()
      .from(conversations)
      .where(eq(conversations.status, 'WAITING'));

    return result.map(row => this.rowToEntity(row));
  }

  async findByUserId(userId: string): Promise<Conversation[]> {
    const result = await this.db
      .select()
      .from(conversations)
      .where(
        or(
          eq(conversations.clientId, userId),
          eq(conversations.advisorId, userId)
        )
      );

    return result.map(row => this.rowToEntity(row));
  }

  async save(conversation: Conversation): Promise<Conversation> {
    const values = {
      id: conversation.id,
      subject: conversation.subject,
      clientId: conversation.clientId,
      advisorId: conversation.advisorId || undefined,
      status: conversation.status as any,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };

    await this.db
      .insert(conversations)
      .values(values)
      .onConflictDoUpdate({
        target: conversations.id,
        set: values,
      });

    return conversation;
  }

  async update(conversation: Conversation): Promise<Conversation> {
    await this.db
      .update(conversations)
      .set({
        advisorId: conversation.advisorId || undefined,
        status: conversation.status as any,
        updatedAt: conversation.updatedAt,
      })
      .where(eq(conversations.id, conversation.id));

    return conversation;
  }

  private rowToEntity(row: typeof conversations.$inferSelect): Conversation {
    return Conversation.fromPersistence({
      id: row.id,
      subject: row.subject,
      clientId: row.clientId,
      advisorId: row.advisorId || undefined,
      status: row.status as ConversationStatus,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
