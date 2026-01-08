import { eq, and, desc } from 'drizzle-orm';
import { Repository, TOKENS } from '@workspace/shared/di';
import type { INotificationRepository } from '@workspace/application/ports';
import { Notification, NotificationType } from '@workspace/domain/entities';
import { getDatabase } from '../database';
import { notifications } from '../schema';

@Repository(TOKENS.INotificationRepository)
export class PostgresNotificationRepository implements INotificationRepository {
  private get db() {
    return getDatabase();
  }

  async findById(id: string): Promise<Notification | null> {
    const result = await this.db
      .select()
      .from(notifications)
      .where(eq(notifications.id, id))
      .limit(1);

    if (result.length === 0) return null;

    return this.rowToEntity(result[0]!);
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    const result = await this.db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));

    return result.map(row => this.rowToEntity(row));
  }

  async findUnreadByUserId(userId: string): Promise<Notification[]> {
    const result = await this.db
      .select()
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, userId),
          eq(notifications.isRead, false)
        )
      )
      .orderBy(desc(notifications.createdAt));

    return result.map(row => this.rowToEntity(row));
  }

  async save(notification: Notification): Promise<Notification> {
    const values = {
      id: notification.id,
      userId: notification.userId,
      type: notification.type as any,
      title: notification.title,
      message: notification.message,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    };

    await this.db
      .insert(notifications)
      .values(values)
      .onConflictDoUpdate({
        target: notifications.id,
        set: values,
      });

    return notification;
  }

  async update(notification: Notification): Promise<Notification> {
    const updateData: Record<string, any> = {
      isRead: notification.isRead,
      updatedAt: notification.updatedAt,
    };

    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    await this.db
      .update(notifications)
      .set(updateData)
      .where(eq(notifications.id, notification.id));

    return notification;
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.db
      .update(notifications)
      .set({
        isRead: true,
        updatedAt: new Date(),
      })
      .where(eq(notifications.userId, userId));
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(notifications).where(eq(notifications.id, id));
  }

  private rowToEntity(row: typeof notifications.$inferSelect): Notification {
    return Notification.fromPersistence({
      id: row.id,
      userId: row.userId,
      type: row.type as NotificationType,
      title: row.title,
      message: row.message,
      isRead: row.isRead,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
