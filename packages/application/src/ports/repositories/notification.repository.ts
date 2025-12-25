import { Notification } from '@workspace/domain/entities';

export interface INotificationRepository {
    findById(id: string): Promise<Notification | null>;
    findByUserId(userId: string): Promise<Notification[]>;
    findUnreadByUserId(userId: string): Promise<Notification[]>;
    save(notification: Notification): Promise<Notification>;
    markAllAsRead(userId: string): Promise<void>;
    delete(id: string): Promise<void>;
}
