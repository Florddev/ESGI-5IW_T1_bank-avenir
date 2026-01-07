import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import type { INotificationRepository } from '../../ports';
import type { NotificationDto } from '../../dtos';

@UseCase()
export class GetUserNotificationsUseCase {
  constructor(
    @Inject(TOKENS.INotificationRepository)
    private notificationRepository: INotificationRepository
  ) {}

  async execute(userId: string): Promise<NotificationDto[]> {
    const notifications = await this.notificationRepository.findByUserId(userId);

    return notifications.map((notification) => ({
      id: notification.id,
      userId: notification.userId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    }));
  }
}
