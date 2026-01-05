import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import { Message, Notification, NotificationType } from '@workspace/domain';
import { IMessageRepository, IRealtimeService, IConversationRepository, INotificationRepository } from '../../ports';
import { MessageDto, RealtimeMessageDto } from '../../dtos';

@UseCase()
export class SendMessageUseCase {
  constructor(
    @Inject(TOKENS.IMessageRepository)
    private messageRepository: IMessageRepository,
    @Inject(TOKENS.IRealtimeService)
    private realtimeService: IRealtimeService,
    @Inject(TOKENS.IConversationRepository)
    private conversationRepository: IConversationRepository,
    @Inject(TOKENS.INotificationRepository)
    private notificationRepository: INotificationRepository
  ) {}

  async execute(
    conversationId: string,
    senderId: string,
    content: string
  ): Promise<MessageDto> {
    const message = Message.create(conversationId, senderId, content);

    const savedMessage = await this.messageRepository.save(message);

    const conversation = await this.conversationRepository.findById(conversationId);
    if (conversation) {
      const realtimeDto: RealtimeMessageDto = {
        id: savedMessage.id,
        conversationId: savedMessage.conversationId,
        senderId: savedMessage.senderId,
        content: savedMessage.content,
        createdAt: savedMessage.createdAt.toISOString(),
        isRead: savedMessage.isRead,
      };

      const participants = [conversation.clientId, conversation.advisorId].filter(
        (id): id is string => id !== undefined && id !== senderId
      );

      for (const participantId of participants) {
        await this.realtimeService.sendEventToUser(
          participantId,
          'message_new',
          realtimeDto
        );

        const notification = Notification.create(
          participantId,
          NotificationType.MESSAGE_RECEIVED,
          'Nouveau message',
          `${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`
        );
        await this.notificationRepository.save(notification);

        await this.realtimeService.sendEventToUser(
          participantId,
          'notification_new',
          {
            id: notification.id,
            userId: notification.userId,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            isRead: notification.isRead,
            createdAt: notification.createdAt.toISOString(),
            updatedAt: notification.updatedAt.toISOString(),
          }
        );
      }
    }

    return {
      id: savedMessage.id,
      conversationId: savedMessage.conversationId,
      senderId: savedMessage.senderId,
      content: savedMessage.content,
      isRead: savedMessage.isRead,
      createdAt: savedMessage.createdAt,
    };
  }
}
