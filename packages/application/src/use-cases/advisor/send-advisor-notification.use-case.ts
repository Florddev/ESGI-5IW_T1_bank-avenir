import { UseCase, Inject, TOKENS } from '@workspace/shared/di';
import type { IConversationRepository, INotificationRepository, IRealtimeService } from '../../ports';
import { Notification, NotificationType } from '@workspace/domain/entities';
import { Conversation } from '@workspace/domain/entities';

interface SendAdvisorNotificationResult {
    notifiedCount: number;
}

@UseCase()
export class SendAdvisorNotificationUseCase {
    constructor(
        @Inject(TOKENS.IConversationRepository)
        private readonly conversationRepository: IConversationRepository,
        @Inject(TOKENS.INotificationRepository)
        private readonly notificationRepository: INotificationRepository,
        @Inject(TOKENS.IRealtimeService)
        private readonly realtimeService: IRealtimeService
    ) {}

    async execute(advisorId: string, title: string, message: string): Promise<SendAdvisorNotificationResult> {
        const conversations = await this.conversationRepository.findByAdvisorId(advisorId);
        const allClientIds = conversations
            .map((c: Conversation) => c.clientId)
            .filter((id): id is string => id !== undefined);
        const clientIds = [...new Set(allClientIds)];

        if (clientIds.length === 0) {
            return { notifiedCount: 0 };
        }

        const notifications = await Promise.all(
            clientIds.map(async (clientId) => {
                const notification = Notification.create(
                    clientId,
                    NotificationType.ADVISOR_MESSAGE,
                    title,
                    message
                );

                const saved = await this.notificationRepository.save(notification);

                await this.realtimeService.sendEventToUser(clientId, 'notification_new', {
                    id: saved.id,
                    userId: saved.userId,
                    type: saved.type,
                    title: saved.title,
                    message: saved.message,
                    isRead: saved.isRead,
                    createdAt: saved.createdAt.toISOString(),
                    updatedAt: saved.updatedAt.toISOString(),
                });

                return saved;
            })
        );

        return { notifiedCount: notifications.length };
    }
}
