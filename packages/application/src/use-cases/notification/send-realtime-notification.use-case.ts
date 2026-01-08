import { UseCase, Inject, TOKENS } from '@workspace/shared/di';
import type { IRealtimeService, INotificationRepository } from '../../ports';
import { Notification, NotificationType } from '@workspace/domain/entities';

interface SendRealtimeNotificationDto {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
}

@UseCase()
export class SendRealtimeNotificationUseCase {
    constructor(
        @Inject(TOKENS.INotificationRepository)
        private readonly notificationRepository: INotificationRepository,
        @Inject(TOKENS.IRealtimeService)
        private readonly realtimeService: IRealtimeService
    ) {}

    async execute(dto: SendRealtimeNotificationDto): Promise<Notification> {
        const notification = Notification.create(
            dto.userId,
            dto.type,
            dto.title,
            dto.message
        );

        const savedNotification = await this.notificationRepository.save(notification);

        if (this.realtimeService.isUserConnected(dto.userId)) {
            await this.realtimeService.sendEventToUser(
                dto.userId,
                'notification_new',
                {
                    id: savedNotification.id,
                    userId: savedNotification.userId,
                    type: savedNotification.type,
                    title: savedNotification.title,
                    message: savedNotification.message,
                    isRead: savedNotification.isRead,
                    createdAt: savedNotification.createdAt.toISOString(),
                    updatedAt: savedNotification.updatedAt.toISOString(),
                }
            );
        }

        return savedNotification;
    }
}
