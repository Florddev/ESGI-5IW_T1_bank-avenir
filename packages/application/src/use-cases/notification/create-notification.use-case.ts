import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import { Notification, NotificationType } from '@workspace/domain';
import { INotificationRepository, IRealtimeService } from '../../ports';
import { NotificationDto, RealtimeNotificationDto } from '../../dtos';

@UseCase()
export class CreateNotificationUseCase {
  constructor(
    @Inject(TOKENS.INotificationRepository)
    private notificationRepository: INotificationRepository,
    @Inject(TOKENS.IRealtimeService)
    private realtimeService: IRealtimeService
  ) {}

  async execute(
    userId: string,
    type: NotificationType,
    title: string,
    message: string
  ): Promise<NotificationDto> {
    const notification = Notification.create(userId, type, title, message);

    const savedNotification = await this.notificationRepository.save(notification);

    const realtimeDto: RealtimeNotificationDto = {
      id: savedNotification.id,
      userId: savedNotification.userId,
      type: savedNotification.type,
      title: savedNotification.title,
      message: savedNotification.message,
      isRead: savedNotification.isRead,
      createdAt: savedNotification.createdAt.toISOString(),
      updatedAt: savedNotification.updatedAt.toISOString(),
    };

    await this.realtimeService.sendEventToUser(
      userId,
      'notification_new',
      realtimeDto
    );

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
