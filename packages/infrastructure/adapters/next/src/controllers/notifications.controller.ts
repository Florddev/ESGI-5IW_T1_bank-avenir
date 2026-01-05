import { container } from '@workspace/shared/di';
import {
  GetUserNotificationsUseCase,
  MarkNotificationAsReadUseCase,
  CreateNotificationUseCase,
} from '@workspace/application/use-cases';

export class NotificationsController {
  async getUserNotifications(userId: string) {
    const useCase = container.resolve(GetUserNotificationsUseCase);
    return await useCase.execute(userId);
  }

  async markAsRead(notificationId: string) {
    const useCase = container.resolve(MarkNotificationAsReadUseCase);
    return await useCase.execute(notificationId);
  }

  async createNotification(
    userId: string,
    type: any,
    title: string,
    message: string
  ) {
    const useCase = container.resolve(CreateNotificationUseCase);
    return await useCase.execute(userId, type, title, message);
  }
}
