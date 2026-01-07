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
        // 1. Créer la notification
        const notification = Notification.create(
            dto.userId,
            dto.type,
            dto.title,
            dto.message
        );

        // 2. Persister en base de données
        const savedNotification = await this.notificationRepository.save(notification);

        // 3. Envoyer en temps réel si l'utilisateur est connecté
        if (this.realtimeService.isUserConnected(dto.userId)) {
            // Utiliser la méthode générique avec l'événement 'notification'
            await this.realtimeService.sendEventToUser(
                dto.userId,
                'notification',
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
