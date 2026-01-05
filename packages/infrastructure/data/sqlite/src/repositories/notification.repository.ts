import { INotificationRepository } from '@workspace/application/ports';
import { Notification, NotificationType } from '@workspace/domain';
import { Repository, TOKENS } from '@workspace/shared/di';
import { db } from '../database';

interface NotificationRow {
    id: string;
    user_id: string;
    type: string;
    title: string;
    message: string;
    read: number;
    created_at: number;
}

@Repository(TOKENS.INotificationRepository)
export class SqliteNotificationRepository implements INotificationRepository {
    private rowToNotification(row: NotificationRow): Notification {
        return Notification.fromPersistence({
            id: row.id,
            userId: row.user_id,
            type: row.type as NotificationType,
            title: row.title,
            message: row.message,
            read: row.read === 1,
            createdAt: new Date(row.created_at),
        });
    }

    async findById(id: string): Promise<Notification | null> {
        const stmt = db.prepare('SELECT * FROM notifications WHERE id = ?');
        const row = stmt.get(id) as NotificationRow | undefined;
        return row ? this.rowToNotification(row) : null;
    }

    async findByUserId(userId: string): Promise<Notification[]> {
        const stmt = db.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC');
        const rows = stmt.all(userId) as NotificationRow[];
        return rows.map((row) => this.rowToNotification(row));
    }

    async findUnreadByUserId(userId: string): Promise<Notification[]> {
        const stmt = db.prepare('SELECT * FROM notifications WHERE user_id = ? AND read = 0 ORDER BY created_at DESC');
        const rows = stmt.all(userId) as NotificationRow[];
        return rows.map((row) => this.rowToNotification(row));
    }

    async findAll(): Promise<Notification[]> {
        const stmt = db.prepare('SELECT * FROM notifications ORDER BY created_at DESC');
        const rows = stmt.all() as NotificationRow[];
        return rows.map((row) => this.rowToNotification(row));
    }

    async save(notification: Notification): Promise<Notification> {
        const stmt = db.prepare(`
            INSERT INTO notifications (id, user_id, type, title, message, read, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run(
            notification.id,
            notification.userId,
            notification.type,
            notification.title,
            notification.message,
            notification.read ? 1 : 0,
            notification.createdAt.getTime()
        );
        
        return notification;
    }

    async update(notification: Notification): Promise<Notification> {
        const stmt = db.prepare(`
            UPDATE notifications
            SET read = ?
            WHERE id = ?
        `);
        
        stmt.run(notification.read ? 1 : 0, notification.id);
        
        return notification;
    }

    async delete(id: string): Promise<void> {
        const stmt = db.prepare('DELETE FROM notifications WHERE id = ?');
        stmt.run(id);
    }

    async markAsRead(id: string): Promise<void> {
        const stmt = db.prepare('UPDATE notifications SET read = 1 WHERE id = ?');
        stmt.run(id);
    }

    async markAllAsRead(userId: string): Promise<void> {
        const stmt = db.prepare('UPDATE notifications SET read = 1 WHERE user_id = ?');
        stmt.run(userId);
    }
}
