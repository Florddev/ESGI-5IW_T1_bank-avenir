import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import { Notification, NotificationType } from '@workspace/domain';
import { INotificationRepository } from '../../ports';
import { NotificationDto } from '../../dtos';

@UseCase()
export class CreateNotificationUseCase {
  constructor(
    @Inject(TOKENS.INotificationRepository)
    private notificationRepository: INotificationRepository
  ) {}

  async execute(
    userId: string,
    type: NotificationType,
    title: string,
    message: string
  ): Promise<NotificationDto> {
    const notification = Notification.create(userId, type, title, message);

    const savedNotification = await this.notificationRepository.save(notification);

    return {
      id: savedNotification.id,
      userId: savedNotification.userId,
      type: savedNotification.type,
      title: savedNotification.title,
      message: savedNotification.message,
      isRead: savedNotification.isRead,
      createdAt: savedNotification.createdAt,
      updatedAt: savedNotification.updatedAt,
    };
  }
}
