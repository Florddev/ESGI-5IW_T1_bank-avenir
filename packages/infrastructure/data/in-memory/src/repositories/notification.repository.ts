import { INotificationRepository } from '@workspace/application/ports';
import { Notification } from '@workspace/domain/entities';
import { Repository, TOKENS } from '@workspace/shared/di';

@Repository(TOKENS.INotificationRepository)
export class InMemoryNotificationRepository implements INotificationRepository {
    private notifications: Map<string, Notification> = new Map();

    async findById(id: string): Promise<Notification | null> {
        return this.notifications.get(id) || null;
    }

    async findByUserId(userId: string): Promise<Notification[]> {
        return Array.from(this.notifications.values())
            .filter((notification) => notification.userId === userId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    async findUnreadByUserId(userId: string): Promise<Notification[]> {
        return Array.from(this.notifications.values())
            .filter((notification) => notification.userId === userId && !notification.isRead)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    async save(notification: Notification): Promise<Notification> {
        this.notifications.set(notification.id, notification);
        return notification;
    }

    async update(notification: Notification): Promise<Notification> {
        this.notifications.set(notification.id, notification);
        return notification;
    }

    async markAllAsRead(userId: string): Promise<void> {
        const notifications = await this.findByUserId(userId);
        for (const notification of notifications) {
            notification.markAsRead();
            await this.save(notification);
        }
    }

    async delete(id: string): Promise<void> {
        this.notifications.delete(id);
    }
}
