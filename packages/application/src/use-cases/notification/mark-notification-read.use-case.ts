import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import type { INotificationRepository, IRealtimeService } from '../../ports';
import { NotificationNotFoundError } from '@workspace/domain';

@UseCase()
export class MarkNotificationAsReadUseCase {
  constructor(
    @Inject(TOKENS.INotificationRepository)
    private notificationRepository: INotificationRepository,
    @Inject(TOKENS.IRealtimeServiceNotifications)
    private realtimeService: IRealtimeService
  ) {}

  async execute(notificationId: string): Promise<void> {
    const notification = await this.notificationRepository.findById(notificationId);

    if (!notification) {
      throw new NotificationNotFoundError();
    }

    notification.markAsRead();
    await this.notificationRepository.update(notification);

    await this.realtimeService.sendEventToUser(
      notification.userId,
      'notification_read',
      { notificationId: notification.id }
    );
  }
}
