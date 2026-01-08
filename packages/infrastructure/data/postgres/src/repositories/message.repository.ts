import { eq, and, ne, asc } from 'drizzle-orm';
import { Repository, TOKENS } from '@workspace/shared/di';
import type { IMessageRepository } from '@workspace/application/ports';
import { Message } from '@workspace/domain/entities';
import { getDatabase } from '../database';
import { messages } from '../schema';

@Repository(TOKENS.IMessageRepository)
export class PostgresMessageRepository implements IMessageRepository {
  private get db() {
    return getDatabase();
  }

  async findById(id: string): Promise<Message | null> {
    const result = await this.db
      .select()
      .from(messages)
      .where(eq(messages.id, id))
      .limit(1);

    if (result.length === 0) return null;

    return this.rowToEntity(result[0]!);
  }

  async findByConversationId(conversationId: string): Promise<Message[]> {
    const result = await this.db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(asc(messages.createdAt));

    return result.map(row => this.rowToEntity(row));
  }

  async findUnreadByConversationId(conversationId: string, excludeUserId: string): Promise<Message[]> {
    const result = await this.db
      .select()
      .from(messages)
      .where(
        and(
          eq(messages.conversationId, conversationId),
          eq(messages.isRead, false),
          ne(messages.senderId, excludeUserId)
        )
      );

    return result.map(row => this.rowToEntity(row));
  }

  async save(message: Message): Promise<Message> {
    const values = {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      content: message.content,
      isRead: message.isRead,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };

    await this.db
      .insert(messages)
      .values(values)
      .onConflictDoUpdate({
        target: messages.id,
        set: values,
      });

    return message;
  }

  async markAllAsRead(conversationId: string): Promise<void> {
    await this.db
      .update(messages)
      .set({
        isRead: true,
        updatedAt: new Date(),
      })
      .where(eq(messages.conversationId, conversationId));
  }

  private rowToEntity(row: typeof messages.$inferSelect): Message {
    return Message.fromPersistence({
      id: row.id,
      conversationId: row.conversationId,
      senderId: row.senderId,
      content: row.content,
      isRead: row.isRead,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
